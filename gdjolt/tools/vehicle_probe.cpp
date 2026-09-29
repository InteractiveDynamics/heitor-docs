// Banco de ensaio · Jolt puro, sem o Godot no caminho.
//
// Monta DUAS plataformas diferentes e submete as duas à MESMA manobra — acelerar
// em reta contra um degrau — para responder a pergunta que decide o rumo do
// projeto: a articulação de verdade segura o chassi mais nivelado que o modelo
// de um corpo só?
//
//   --rig=lumped   VehicleConstraint de quatro rodas · UM corpo rígido, sem
//                  articulação nenhuma. Boa modelagem de pneu (curvas de slip,
//                  clamp μ·N), zero mecanismo.
//
//   --rig=rocker   chassi + dois braços articulados + quatro rodas, ligados por
//                  HingeConstraint. Sete corpos, seis juntas. As rodas são
//                  acionadas pelo EIXO, com motor na junta, como na vida real.
//                  Mecanismo de verdade; o pneu vira atrito comum de corpo
//                  rígido.
//
//   --rig=bogie    rocker-bogie de seis rodas: o rocker segura a roda traseira
//                  e, na frente, um bogie articulado com duas rodas. Onze
//                  corpos, dez juntas. Mesmo entre-eixos, bitola e massa do
//                  rocker de quatro — muda só o mecanismo.
//
//   --rig=all      as três, uma depois da outra ("both" continua sendo lumped
//                  e rocker, como na primeira versão do ensaio).
//
//   --sweep        varre o degrau de 0,10 a 0,50 m nas três montagens e
//                  imprime só a tabela de quem sobe o quê.
//
// A métrica principal é a INCLINAÇÃO DO CHASSI durante a passagem pelo degrau.
// É ela que diz se o mecanismo está fazendo o que o rocker-bogie existe para
// fazer: deixar uma roda subir sem levar o chassi junto.
//
// O cronômetro em volta do Update também mede o custo por passo — é a
// instrumentação que a faixa A do roadmap vai precisar.
//
// Baseado em HelloWorld/HelloWorld.cpp, Samples/Tests/Vehicle/
// VehicleConstraintTest.cpp e VehicleSixDOFTest.cpp do repositório do Jolt.

#include <Jolt/Jolt.h>

#include <Jolt/Core/Factory.h>
#include <Jolt/Core/JobSystemThreadPool.h>
#include <Jolt/Core/TempAllocator.h>
#include <Jolt/Physics/Body/BodyCreationSettings.h>
#include <Jolt/Physics/Collision/GroupFilterTable.h>
#include <Jolt/Physics/Collision/Shape/BoxShape.h>
#include <Jolt/Physics/Collision/Shape/CylinderShape.h>
#include <Jolt/Physics/Collision/Shape/OffsetCenterOfMassShape.h>
#include <Jolt/Physics/Constraints/HingeConstraint.h>
#include <Jolt/Physics/PhysicsSettings.h>
#include <Jolt/Physics/PhysicsSystem.h>
#include <Jolt/Physics/Vehicle/VehicleCollisionTester.h>
#include <Jolt/Physics/Vehicle/VehicleConstraint.h>
#include <Jolt/Physics/Vehicle/WheeledVehicleController.h>
#include <Jolt/RegisterTypes.h>

#include "../src/jolt_layers.h"
#include "../src/rocker_rig.h"

#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstdarg>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <thread>
#include <vector>

JPH_SUPPRESS_WARNINGS

using namespace JPH;
using namespace JPH::literals;
using namespace gdjolt;

// ---------------------------------------------------------------------------
// infraestrutura
// ---------------------------------------------------------------------------

static void TraceImpl(const char *inFMT, ...) {
	va_list list;
	va_start(list, inFMT);
	char buffer[1024];
	vsnprintf(buffer, sizeof(buffer), inFMT, list);
	va_end(list);
	std::cout << buffer << std::endl;
}

#ifdef JPH_ENABLE_ASSERTS
static bool AssertFailedImpl(const char *inExpression, const char *inMessage, const char *inFile, uint inLine) {
	std::cout << inFile << ":" << inLine << ": (" << inExpression << ") "
			  << (inMessage != nullptr ? inMessage : "") << std::endl;
	return true;
}
#endif

// ---------------------------------------------------------------------------
// parâmetros comuns às duas plataformas
//
// Mesma pegada no chão, mesma massa total, mesmo raio de roda. Sem isso a
// comparação não vale nada: qualquer diferença de inclinação poderia ser
// geometria em vez de mecanismo.
// ---------------------------------------------------------------------------

static constexpr float kWheelRadius = 0.3f;
static constexpr float kWheelWidth = 0.2f;
static constexpr float kHalfLength = 2.0f; // meia distância entre eixos + folga
static constexpr float kHalfWidth = 0.9f;  // meia bitola
static constexpr float kHalfHeight = 0.2f;
static constexpr float kTotalMass = 1500.0f;

// Onde as rodas ficam, em Z, nas duas plataformas.
static constexpr float kAxleZ = kHalfLength - 2.0f * kWheelRadius; // 1.4

// O atrito PADRÃO de corpo no Jolt é 0.2 (BodyCreationSettings.h:107) — baixo
// demais: a roda acionada por motor patina em vez de subir o degrau. Este valor
// é parâmetro do experimento, não detalhe.
static constexpr float kGroundFriction = 1.0f;
static constexpr float kWheelFriction = 1.0f;

// A manobra padrão.
static constexpr float kDeltaTime = 1.0f / 60.0f;
// Velocidade-alvo em m/s, IGUAL para as duas plataformas. Sem isto o ensaio
// compara um carro a 19 m/s com um rover a 1,8 m/s, e qualquer diferença de
// inclinação vira artefato da velocidade em vez de resultado do mecanismo.
static constexpr float kTargetSpeed = 1.5f;
static constexpr int kSettleSteps = 60;    // 1 s parado, para assentar
static constexpr float kSpawnHeight = 0.75f;

struct World {
	PhysicsSystem *system = nullptr;
	BodyInterface *bi = nullptr;
	Ref<GroupFilterTable> group_filter;
};

// ---------------------------------------------------------------------------
// a interface que as duas plataformas implementam
// ---------------------------------------------------------------------------

class Rig {
public:
	virtual ~Rig() = default;

	virtual const char *Name() const = 0;
	virtual void Build(World &w, RVec3Arg origin) = 0;
	virtual void Drive(World &w, bool go) = 0;
	virtual const Body *Chassis() const = 0;

	/// Uma linha de telemetria específica da plataforma (ângulos das juntas,
	/// comprimento da suspensão...). Vazio é aceitável.
	virtual void DetailRow(char *out, size_t n) const { out[0] = '\0'; (void)n; }
	virtual const char *DetailHeader() const { return ""; }

	/// Inclinação do chassi em relação à vertical do mundo, em graus.
	/// É a métrica principal do experimento.
	float TiltDegrees() const {
		Vec3 up = Chassis()->GetRotation().RotateAxisY();
		float c = std::min(1.0f, std::max(-1.0f, up.Dot(Vec3::sAxisY())));
		return RadiansToDegrees(std::acos(c));
	}
};

// ---------------------------------------------------------------------------
// plataforma A · lumped — a VehicleConstraint que já existia
// ---------------------------------------------------------------------------

static WheelSettingsWV *MakeWheelWV(Vec3Arg position, float max_steer, float hand_brake) {
	WheelSettingsWV *w = new WheelSettingsWV;
	w->mPosition = position;
	w->mRadius = kWheelRadius;
	w->mWidth = kWheelWidth;
	w->mSuspensionMinLength = 0.3f;
	w->mSuspensionMaxLength = 0.5f;
	w->mSuspensionSpring.mFrequency = 1.5f;
	w->mSuspensionSpring.mDamping = 0.5f;
	w->mMaxSteerAngle = max_steer;
	w->mMaxHandBrakeTorque = hand_brake;
	return w;
}

class LumpedRig final : public Rig {
public:
	const char *Name() const override { return "lumped"; }
	const Body *Chassis() const override { return mBody; }

	void Build(World &w, RVec3Arg origin) override {
		// Um corpo rígido SÓ. As rodas não são corpos: são dados na constraint.
		RefConst<Shape> shape = OffsetCenterOfMassShapeSettings(
				Vec3(0, -kHalfHeight, 0),
				new BoxShape(Vec3(kHalfWidth, kHalfHeight, kHalfLength)))
									.Create()
									.Get();

		BodyCreationSettings bcs(shape, origin, Quat::sIdentity(),
				EMotionType::Dynamic, Layers::MOVING);
		bcs.mOverrideMassProperties = EOverrideMassProperties::CalculateInertia;
		bcs.mMassPropertiesOverride.mMass = kTotalMass;
		bcs.mFriction = kWheelFriction;

		mBody = w.bi->CreateBody(bcs);
		w.bi->AddBody(mBody->GetID(), EActivation::Activate);

		VehicleConstraintSettings v;
		const float wy = -0.9f * kHalfHeight;
		v.mWheels = {
			MakeWheelWV(Vec3(kHalfWidth, wy, kAxleZ), 0.0f, 0.0f),
			MakeWheelWV(Vec3(-kHalfWidth, wy, kAxleZ), 0.0f, 0.0f),
			MakeWheelWV(Vec3(kHalfWidth, wy, -kAxleZ), 0.0f, 0.0f),
			MakeWheelWV(Vec3(-kHalfWidth, wy, -kAxleZ), 0.0f, 0.0f),
		};

		// Tração nas quatro, para ser comparável com o rocker (que também tem
		// motor nas quatro).
		WheeledVehicleControllerSettings *ctrl = new WheeledVehicleControllerSettings;
		ctrl->mDifferentials.resize(2);
		ctrl->mDifferentials[0].mLeftWheel = 0;
		ctrl->mDifferentials[0].mRightWheel = 1;
		ctrl->mDifferentials[1].mLeftWheel = 2;
		ctrl->mDifferentials[1].mRightWheel = 3;
		ctrl->mDifferentials[0].mEngineTorqueRatio = 0.5f;
		ctrl->mDifferentials[1].mEngineTorqueRatio = 0.5f;
		v.mController = ctrl;

		mConstraint = new VehicleConstraint(*mBody, v);
		mConstraint->SetVehicleCollisionTester(new VehicleCollisionTesterRay(Layers::MOVING));

		w.system->AddConstraint(mConstraint);
		w.system->AddStepListener(mConstraint);
	}

	void Drive(World &w, bool go) override {
		auto *c = static_cast<WheeledVehicleController *>(mConstraint->GetController());
		if (go) {
			// Acelerador proporcional: o motor do WheeledVehicleController tem
			// curva de torque própria e sairia a 19 m/s se recebesse 1.0 fixo.
			// Segurar a velocidade-alvo é o que torna o ensaio comparável.
			float v = mBody->GetLinearVelocity().Dot(mBody->GetRotation().RotateAxisZ());
			float err = kTargetSpeed - v;
			float throttle = std::min(1.0f, std::max(0.0f, err));
			float brake = err < -0.5f ? std::min(1.0f, -err - 0.5f) : 0.0f;
			c->SetDriverInput(throttle, 0.0f, brake, 0.0f);
		} else {
			c->SetDriverInput(0.0f, 0.0f, 0.0f, 1.0f);
		}
		w.bi->ActivateBody(mBody->GetID());
	}

	const char *DetailHeader() const override { return " susp0  susp1  susp2  susp3"; }

	void DetailRow(char *out, size_t n) const override {
		std::snprintf(out, n, " %6.3f %6.3f %6.3f %6.3f",
				(double)mConstraint->GetWheel(0)->GetSuspensionLength(),
				(double)mConstraint->GetWheel(1)->GetSuspensionLength(),
				(double)mConstraint->GetWheel(2)->GetSuspensionLength(),
				(double)mConstraint->GetWheel(3)->GetSuspensionLength());
	}

private:
	Body *mBody = nullptr;
	Ref<VehicleConstraint> mConstraint;
};

// ---------------------------------------------------------------------------
// plataforma B · rocker — corpos e juntas de verdade
//
//   chassi
//    ├─ HingeConstraint livre ──→ braço esquerdo
//    │                             ├─ Hinge + motor → roda diant. esq
//    │                             └─ Hinge + motor → roda tras. esq
//    └─ HingeConstraint livre ──→ braço direito
//                                  ├─ Hinge + motor → roda diant. dir
//                                  └─ Hinge + motor → roda tras. dir
//
// Sem mola nenhuma: quem absorve o degrau é a GEOMETRIA. É esse o princípio do
// rocker-bogie, e é o que não cabe num modelo de corpo único.
// ---------------------------------------------------------------------------

class RockerRig final : public Rig {
public:
	explicit RockerRig(bool bogie) { mParams.bogie = bogie; }

	const char *Name() const override { return mParams.bogie ? "bogie" : "rocker"; }
	const Body *Chassis() const override { return mParts.chassis; }

	void Build(World &w, RVec3Arg origin) override {
		// A montagem em si vive em src/rocker_rig.h, compartilhada com o nó do
		// Godot — o que aparece no vídeo é exatamente o que foi medido aqui.
		mParts = BuildRocker(*w.system, *w.bi, w.group_filter, origin, mParams);
	}

	void Drive(World &w, bool go) override {
		DriveRocker(mParts, *w.bi, mParams, go ? 1.0f : 0.0f, 0.0f, kTargetSpeed);
	}

	const char *DetailHeader() const override {
		return mParams.bogie ? " braco_e braco_d bogie_e bogie_d  torque"
							 : " braco_e braco_d  torque";
	}

	void DetailRow(char *out, size_t n) const override {
		float torque = 0.0f;
		for (int i = 0; i < mParts.num_wheels; ++i) {
			torque += std::abs(mParts.wheel_hinges[i]->GetTotalLambdaMotor());
		}
		const double a0 = RadiansToDegrees(mParts.arm_hinges[0]->GetCurrentAngle());
		const double a1 = RadiansToDegrees(mParts.arm_hinges[1]->GetCurrentAngle());
		if (mParams.bogie) {
			std::snprintf(out, n, "  %+6.2f  %+6.2f  %+6.2f  %+6.2f %8.1f", a0, a1,
					(double)RadiansToDegrees(mParts.bogie_hinges[0]->GetCurrentAngle()),
					(double)RadiansToDegrees(mParts.bogie_hinges[1]->GetCurrentAngle()),
					(double)torque);
		} else {
			std::snprintf(out, n, "  %+6.2f  %+6.2f %8.1f", a0, a1, (double)torque);
		}
	}

private:
	RockerParams mParams;
	RockerParts mParts;
};

// ---------------------------------------------------------------------------
// o ensaio
// ---------------------------------------------------------------------------

struct TrialResult {
	float max_tilt = 0.0f;
	float tilt_at_obstacle = 0.0f;
	float start_z = 0.0f;
	float final_z = 0.0f;
	float final_height = 0.0f;
	bool climbed = false;
	float cross_time = -1.0f; ///< s desde a partida até a roda traseira passar da face
	double step_us_min = 1e18, step_us_med = 0.0, step_us_max = 0.0;
};

static TrialResult RunTrial(Rig &rig, float step_height, int total_steps, bool verbose,
		int vsteps, int psteps, int substeps) {
	TempAllocatorImpl temp_allocator(16 * 1024 * 1024);
	JobSystemThreadPool job_system(cMaxPhysicsJobs, cMaxPhysicsBarriers,
			std::max(1u, std::thread::hardware_concurrency() - 1));

	BPLayerInterfaceImpl bpl;
	ObjectVsBroadPhaseLayerFilterImpl obvbp;
	ObjectLayerPairFilterImpl obvob;

	PhysicsSystem physics_system;
	physics_system.Init(1024, 0, 1024, 1024, bpl, obvbp, obvob);

	// Os botões de custo do solver. Ficam expostos porque a razão de massa deste
	// tipo de montagem (chassi pesado pendurado em braços leves) é justamente o
	// caso em que o solver iterativo precisa de mais insistência.
	PhysicsSettings settings = physics_system.GetPhysicsSettings();
	settings.mNumVelocitySteps = vsteps;
	settings.mNumPositionSteps = psteps;
	physics_system.SetPhysicsSettings(settings);

	World w;
	w.system = &physics_system;
	w.bi = &physics_system.GetBodyInterface();
	w.group_filter = MakeRockerGroupFilter(16);

	// --- chão ---------------------------------------------------------------
	{
		BodyCreationSettings floor(new BoxShape(Vec3(100.0f, 1.0f, 100.0f)),
				RVec3(0.0_r, -1.0_r, 0.0_r), Quat::sIdentity(),
				EMotionType::Static, Layers::NON_MOVING);
		floor.mFriction = kGroundFriction;
		Body *b = w.bi->CreateBody(floor);
		w.bi->AddBody(b->GetID(), EActivation::DontActivate);
	}

	// --- o degrau -----------------------------------------------------------
	const float obstacle_z = 6.0f;
	if (step_height > 0.0f) {
		BodyCreationSettings step(
				new BoxShape(Vec3(20.0f, 0.5f * step_height, 4.0f)),
				RVec3(0.0_r, Real(0.5f * step_height), Real(obstacle_z + 4.0f)),
				Quat::sIdentity(), EMotionType::Static, Layers::NON_MOVING);
		step.mFriction = kGroundFriction;
		Body *b = w.bi->CreateBody(step);
		w.bi->AddBody(b->GetID(), EActivation::DontActivate);
	}

	// --- a plataforma -------------------------------------------------------
	// Nasce um pouco acima do chão, com o MESMO valor para as duas montagens:
	// se a queda inicial fosse diferente, ela já criaria diferença de inclinação.
	rig.Build(w, RVec3(0.0_r, Real(kSpawnHeight), 0.0_r));

	physics_system.OptimizeBroadPhase();

	TrialResult r;
	r.start_z = (float)rig.Chassis()->GetPosition().GetZ();

	std::vector<double> timings;
	timings.reserve(total_steps);

	char detail[128];

	if (verbose) {
		std::printf("\n  passo |   z    | altura | incl.° |%s\n", rig.DetailHeader());
		std::printf("  ------+--------+--------+--------+%s\n",
				"---------------------------");
	}

	for (int step = 1; step <= total_steps; ++step) {
		const bool go = step > kSettleSteps;
		rig.Drive(w, go);

		auto t0 = std::chrono::steady_clock::now();
		// Sub-passos: o mesmo quadro dividido em N updates menores. É o botão
		// principal de fidelidade, e o que aproxima do passo curto do GDChrono.
		for (int sub = 0; sub < substeps; ++sub) {
			physics_system.Update(kDeltaTime / substeps, 1, &temp_allocator, &job_system);
		}
		auto t1 = std::chrono::steady_clock::now();
		timings.push_back(std::chrono::duration<double, std::micro>(t1 - t0).count());

		const float tilt = rig.TiltDegrees();
		const float z = (float)rig.Chassis()->GetPosition().GetZ();

		// Só conta inclinação depois de assentar e enquanto está dirigindo. E só
		// até a roda dianteira chegar perto da ponta final da laje: descer dela
		// do outro lado é outra manobra, e com o ensaio longo da varredura a
		// queda contaminava a inclinação máxima.
		if (go && z < obstacle_z + 6.0f) {
			r.max_tilt = std::max(r.max_tilt, tilt);
			if (std::abs(z - obstacle_z) < 0.5f) {
				r.tilt_at_obstacle = std::max(r.tilt_at_obstacle, tilt);
			}
		}

		// A travessia termina quando a roda TRASEIRA passa da face do degrau —
		// o mesmo critério de "subiu". Tempo acima dos ~5,1 s de andar livre é
		// o tempo que a montagem passou brigando com a face.
		if (go && r.cross_time < 0.0f && step_height > 0.0f
				&& z > obstacle_z + kAxleZ + kWheelRadius) {
			r.cross_time = (step - kSettleSteps) * kDeltaTime;
		}

		if (verbose && step % 30 == 0) {
			rig.DetailRow(detail, sizeof(detail));
			std::printf("  %5d | %6.2f | %6.3f | %6.2f |%s\n", step, (double)z,
					(double)rig.Chassis()->GetPosition().GetY(), (double)tilt, detail);
		}
	}

	r.final_z = (float)rig.Chassis()->GetPosition().GetZ();
	r.final_height = (float)rig.Chassis()->GetPosition().GetY();
	// Subiu = a roda TRASEIRA passou da face do degrau. Só o chassi passar
	// não basta: no rocker-bogie a frente pode estar em cima com a traseira
	// ainda presa embaixo.
	r.climbed = step_height > 0.0f && r.final_z > obstacle_z + kAxleZ + kWheelRadius;

	std::sort(timings.begin(), timings.end());
	r.step_us_min = timings.front();
	r.step_us_med = timings[timings.size() / 2];
	r.step_us_max = timings.back();

	return r;
}

// ---------------------------------------------------------------------------

int main(int argc, char **argv) {
	const char *rig_name = "both";
	float step_height = 0.20f;
	int total_steps = 420; // 7 s
	bool verbose = true;
	int vsteps = 10; // padrão do Jolt
	int psteps = 2;  // padrão do Jolt
	int substeps = 1;
	bool sweep = false;

	for (int i = 1; i < argc; ++i) {
		if (std::strncmp(argv[i], "--rig=", 6) == 0) {
			rig_name = argv[i] + 6;
		} else if (std::strncmp(argv[i], "--step-height=", 14) == 0) {
			step_height = (float)std::atof(argv[i] + 14);
		} else if (std::strncmp(argv[i], "--steps=", 8) == 0) {
			total_steps = std::atoi(argv[i] + 8);
		} else if (std::strncmp(argv[i], "--vsteps=", 9) == 0) {
			vsteps = std::atoi(argv[i] + 9);
		} else if (std::strncmp(argv[i], "--psteps=", 9) == 0) {
			psteps = std::atoi(argv[i] + 9);
		} else if (std::strncmp(argv[i], "--substeps=", 11) == 0) {
			substeps = std::atoi(argv[i] + 11);
		} else if (std::strcmp(argv[i], "--quiet") == 0) {
			verbose = false;
		} else if (std::strcmp(argv[i], "--sweep") == 0) {
			sweep = true;
		}
	}

	RegisterDefaultAllocator();
	Trace = TraceImpl;
	JPH_IF_ENABLE_ASSERTS(AssertFailed = AssertFailedImpl;)
	Factory::sInstance = new Factory();
	RegisterTypes();

	auto wants = [rig_name](const char *name) {
		if (std::strcmp(rig_name, "all") == 0) {
			return true;
		}
		if (std::strcmp(rig_name, "both") == 0) {
			return std::strcmp(name, "bogie") != 0;
		}
		return std::strcmp(rig_name, name) == 0;
	};

	if (sweep) {
		// A varredura responde de uma vez até onde cada montagem sobe. Roda
		// sempre as três, calada, e com mais tempo de manobra: quem sobe devagar
		// não pode ser contado como quem não sobe.
		const int sweep_steps = std::max(total_steps, 720); // 12 s
		std::printf("=== varredura de degrau · %d passos · solver %d vel · %d pos · %d sub-passo(s) ===\n",
				sweep_steps, vsteps, psteps, substeps);
		std::printf("    subiu = a roda traseira passou da face · tempo de travessia (andar livre: %.1f s) · inclinação máxima\n\n",
				(double)((kAxleZ + kWheelRadius + 6.0f) / kTargetSpeed));
		std::printf("degrau  |        lumped         |        rocker         |        bogie\n");
		std::printf("--------+-----------------------+-----------------------+-----------------------\n");
		for (int hi = 10; hi <= 50; hi += 5) {
			const float h = hi / 100.0f;
			LumpedRig lumped;
			RockerRig rocker(false);
			RockerRig bogie(true);
			Rig *rigs[] = { &lumped, &rocker, &bogie };
			std::printf("%.2f m ", (double)h);
			for (Rig *rig : rigs) {
				TrialResult r = RunTrial(*rig, h, sweep_steps, false, vsteps, psteps, substeps);
				if (r.climbed) {
					std::printf(" | sim %5.1f s  %6.2f° ", (double)r.cross_time, (double)r.max_tilt);
				} else {
					std::printf(" | NAO    —     %6.2f° ", (double)r.max_tilt);
				}
			}
			std::printf("\n");
			std::fflush(stdout);
		}
	} else {
		std::printf("=== banco de ensaio · degrau de %.2f m · %d passos ===\n",
				(double)step_height, total_steps);
		std::printf("    atrito chao/roda %.2f · velocidade-alvo %.1f m/s · massa total %.0f kg\n",
				(double)kGroundFriction, (double)kTargetSpeed, (double)kTotalMass);
		std::printf("    solver: %d vel · %d pos · %d sub-passo(s) por quadro\n",
				vsteps, psteps, substeps);

		struct Row {
			const char *name;
			TrialResult r;
		};
		std::vector<Row> rows;

		if (wants("lumped")) {
			std::printf("\n--- lumped · VehicleConstraint, um corpo -------------------\n");
			LumpedRig rig;
			rows.push_back({"lumped", RunTrial(rig, step_height, total_steps, verbose, vsteps, psteps, substeps)});
		}
		if (wants("rocker")) {
			std::printf("\n--- rocker · 7 corpos, 6 juntas ----------------------------\n");
			RockerRig rig(false);
			rows.push_back({"rocker", RunTrial(rig, step_height, total_steps, verbose, vsteps, psteps, substeps)});
		}
		if (wants("bogie")) {
			std::printf("\n--- bogie · 11 corpos, 10 juntas ---------------------------\n");
			RockerRig rig(true);
			rows.push_back({"bogie", RunTrial(rig, step_height, total_steps, verbose, vsteps, psteps, substeps)});
		}

		std::printf("\n=== resumo ===\n");
		std::printf("plataforma | incl.max | incl.@degrau | z final | alt.final | subiu | us/quadro (min/med/max)\n");
		std::printf("-----------+----------+--------------+---------+-----------+-------+------------------------\n");
		for (const Row &row : rows) {
			std::printf("%-10s | %7.2f° | %11.2f° | %7.2f | %9.3f | %-5s | %6.1f %6.1f %7.1f\n",
					row.name, (double)row.r.max_tilt, (double)row.r.tilt_at_obstacle,
					(double)row.r.final_z, (double)row.r.final_height,
					row.r.climbed ? "sim" : "NAO",
					row.r.step_us_min, row.r.step_us_med, row.r.step_us_max);
		}
	}

	UnregisterTypes();
	delete Factory::sInstance;
	Factory::sInstance = nullptr;
	return 0;
}
