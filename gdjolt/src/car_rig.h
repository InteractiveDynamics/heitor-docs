#ifndef GDJOLT_CAR_RIG_H
#define GDJOLT_CAR_RIG_H

// O carro com rodas de verdade: cinco corpos, quatro juntas.
//
//   chassi
//    ├─ SixDOFConstraint ──→ roda diant. esq   (curso vertical com mola, giro com motor, esterço)
//    ├─ SixDOFConstraint ──→ roda tras. esq    (curso vertical com mola, giro com motor)
//    ├─ SixDOFConstraint ──→ roda diant. dir   (idem dianteira)
//    └─ SixDOFConstraint ──→ roda tras. dir    (idem traseira)
//
// É o caminho que o professor preferiu para a colisão roda–chão: a roda é um
// corpo com colisor cilíndrico, e quem encosta no degrau é ela, não um raio. A
// suspensão sai da junta — a translação vertical fica livre dentro do curso e
// um motor de POSIÇÃO faz o papel da mola.
//
// A montagem é a do lumped (VehicleConstraint) com as rodas promovidas a corpo:
// mesma caixa de chassi com o centro de massa na face de baixo, mesma pegada,
// mesmo ponto de fixação, mesmo curso (0,3 a 0,5 m) e mesma massa total. Assim
// a comparação mede o contato roda–chão, não geometria.
//
// Baseado em Samples/Tests/Vehicle/VehicleSixDOFTest.cpp do Jolt. Compartilhado
// entre o banco de ensaio (tools/vehicle_probe.cpp) e o nó do Godot
// (src/jolt_car.cpp), pelo mesmo motivo do rocker_rig.h.

#include <Jolt/Jolt.h>

#include <Jolt/Physics/Body/BodyCreationSettings.h>
#include <Jolt/Physics/Collision/GroupFilterTable.h>
#include <Jolt/Physics/Collision/Shape/BoxShape.h>
#include <Jolt/Physics/Collision/Shape/CylinderShape.h>
#include <Jolt/Physics/Collision/Shape/OffsetCenterOfMassShape.h>
#include <Jolt/Physics/Constraints/SixDOFConstraint.h>
#include <Jolt/Physics/PhysicsSystem.h>

#include "jolt_layers.h"

#include <cmath>

namespace gdjolt {

/// Os eixos da SixDOF: o enum mora dentro de SixDOFConstraintSettings.
using Axis = JPH::SixDOFConstraintSettings::EAxis;

constexpr int kCarWheels = 4;

struct CarParams {
	float wheel_radius = 0.3f;
	float wheel_width = 0.2f;
	float half_length = 2.0f; // meia distância entre eixos + folga
	float half_width = 0.9f;  // meia bitola
	float half_height = 0.2f;
	float total_mass = 1500.0f;
	float wheel_mass = 50.0f; // o mesmo das rodas do rocker

	// Suspensão, nos números do lumped: fixação a 0,9 da meia altura abaixo do
	// centro da caixa, comprimento de 0,3 (batente) a 0,5 m (roda solta).
	float susp_min = 0.3f;
	float susp_max = 0.5f;

	// A mola é definida pelo QUARTO DE CARRO: massa suspensa por roda, 1,5 Hz e
	// amortecimento 0,5. A VehicleConstraint usa os mesmos 1,5 Hz e 0,5, mas
	// contra a massa efetiva do chassi no ponto de contato, que é menor — por
	// isso o lumped afunda 13,7 cm parado e este carro, pela conta, 11,0 cm.
	float spring_hz = 1.5f;
	float spring_damping = 0.5f;

	float motor_torque = 3.0e4f; // N·m no eixo, o mesmo do rocker
	float max_steer_deg = 30.0f; // esterço das dianteiras

	// O atrito PADRÃO de corpo no Jolt é 0.2 (BodyCreationSettings.h:107) —
	// baixo demais: a roda acionada por motor patina em vez de subir o degrau.
	float friction = 1.0f;

	float AxleZ() const { return half_length - 2.0f * wheel_radius; }
	float AttachY() const { return -0.9f * half_height; }
	float Travel() const { return susp_max - susp_min; }
	float SprungMassPerWheel() const { return (total_mass - kCarWheels * wheel_mass) / kCarWheels; }
	float Omega() const { return 2.0f * JPH::JPH_PI * spring_hz; }
	/// k = m·ω², em N/m.
	float Stiffness() const { return SprungMassPerWheel() * Omega() * Omega(); }
	/// c = 2·ζ·√(k·m), em N·s/m.
	float Damping() const { return 2.0f * spring_damping * std::sqrt(Stiffness() * SprungMassPerWheel()); }
	/// Quanto a mola deve afundar parada: m·g/k = g/ω².
	float StaticSag() const { return 9.81f / (Omega() * Omega()); }
};

struct CarParts {
	JPH::Body *chassis = nullptr;
	JPH::Body *wheels[kCarWheels] = {};
	JPH::Ref<JPH::SixDOFConstraint> joints[kCarWheels];
	/// Centro de cada roda com a suspensão toda estendida, no espaço do chassi.
	JPH::Vec3 mount_local[kCarWheels];

	/// Roda i: lado = i / 2 (0 = +x), ponta = i % 2 (0 = dianteira).
	static bool IsFront(int wheel) { return wheel % 2 == 0; }
	static int Side(int wheel) { return wheel / 2; }

	/// Quanto a roda subiu em relação ao chassi desde a extensão total (m).
	/// 0 é roda solta; Travel() é o batente.
	float Compression(int wheel) const {
		JPH::Vec3 local = JPH::Vec3(chassis->GetWorldTransform().InversedRotationTranslation()
				* wheels[wheel]->GetCenterOfMassPosition());
		return local.GetY() - mount_local[wheel].GetY();
	}
};

/// Monta o carro com o chassi em `origin`. A roda nasce com a suspensão toda
/// estendida; quem chama escolhe uma altura em que ela não nasça dentro do chão.
/// `filter` precisa de ao menos 5 sub-grupos com as colisões internas desabilitadas.
inline CarParts BuildCar(JPH::PhysicsSystem &sys, JPH::BodyInterface &bi,
		JPH::GroupFilterTable *filter, JPH::RVec3Arg origin, const CarParams &p) {
	using namespace JPH;

	CarParts out;
	const float chassis_mass = p.total_mass - kCarWheels * p.wheel_mass;

	// O mesmo chassi do lumped: centro de massa baixado até a face de baixo.
	RefConst<Shape> chassis_shape = OffsetCenterOfMassShapeSettings(
			Vec3(0, -p.half_height, 0),
			new BoxShape(Vec3(p.half_width, p.half_height, p.half_length)))
											.Create()
											.Get();
	{
		BodyCreationSettings bcs(chassis_shape, origin, Quat::sIdentity(), EMotionType::Dynamic, Layers::MOVING);
		bcs.mOverrideMassProperties = EOverrideMassProperties::CalculateInertia;
		bcs.mMassPropertiesOverride.mMass = chassis_mass;
		bcs.mFriction = p.friction;
		bcs.mCollisionGroup = CollisionGroup(filter, 0, 0);
		out.chassis = bi.CreateBody(bcs);
		bi.AddBody(out.chassis->GetID(), EActivation::Activate);
	}

	RefConst<Shape> wheel_shape = new CylinderShape(0.5f * p.wheel_width, p.wheel_radius);
	// O cilindro do Jolt nasce com o eixo em Y; deitar em X faz dele uma roda.
	const Quat lay_down = Quat::sRotation(Vec3::sAxisZ(), 0.5f * JPH_PI);
	const float max_steer = DegreesToRadians(p.max_steer_deg);

	for (int i = 0; i < kCarWheels; ++i) {
		const float x = CarParts::Side(i) == 0 ? p.half_width : -p.half_width;
		const float z = CarParts::IsFront(i) ? p.AxleZ() : -p.AxleZ();
		out.mount_local[i] = Vec3(x, p.AttachY() - p.susp_max, z);
		const RVec3 wheel_pos = origin + out.mount_local[i];

		BodyCreationSettings bcs(wheel_shape, wheel_pos, lay_down, EMotionType::Dynamic, Layers::MOVING);
		bcs.mOverrideMassProperties = EOverrideMassProperties::CalculateInertia;
		bcs.mMassPropertiesOverride.mMass = p.wheel_mass;
		bcs.mFriction = p.friction;
		// Roda e chassi se sobrepõem por construção (a roda fica na borda da
		// caixa, como no lumped). Sem o filtro o solver briga contra a junta.
		bcs.mCollisionGroup = CollisionGroup(filter, 0, (CollisionGroup::SubGroupID)(1 + i));
		out.wheels[i] = bi.CreateBody(bcs);
		bi.AddBody(out.wheels[i]->GetID(), EActivation::Activate);

		SixDOFConstraintSettings s;
		s.mSpace = EConstraintSpace::WorldSpace;
		s.mPosition1 = s.mPosition2 = wheel_pos;
		s.mAxisX1 = s.mAxisX2 = Vec3::sAxisX(); // eixo da roda
		s.mAxisY1 = s.mAxisY2 = Vec3::sAxisY(); // curso da suspensão

		// A suspensão: só a translação vertical, de 0 (roda solta) até o batente.
		s.MakeFixedAxis(Axis::TranslationX);
		s.MakeFixedAxis(Axis::TranslationZ);
		s.SetLimitedAxis(Axis::TranslationY, 0.0f, p.Travel());
		// A mola é o motor de posição com alvo em 0. Rigidez e amortecimento em
		// unidades físicas, para não depender da massa efetiva que o solver vê.
		s.mMotorSettings[Axis::TranslationY] = MotorSettings(
				ESpringMode::StiffnessAndDamping, p.Stiffness(), p.Damping());

		// O giro da roda: livre, com motor de velocidade no eixo.
		s.MakeFreeAxis(Axis::RotationX);
		s.mMotorSettings[Axis::RotationX] = MotorSettings(2.0f, 1.0f, 0.0f, p.motor_torque);

		// Esterço só nas dianteiras. Os motores agem no espaço da roda, que gira
		// em X; por isso o esterço precisa dirigir Y e Z juntos (comentário do
		// próprio VehicleSixDOFTest).
		const bool steers = CarParts::IsFront(i) && max_steer > 0.0f;
		if (steers) {
			s.SetLimitedAxis(Axis::RotationY, -max_steer, max_steer);
			s.mMotorSettings[Axis::RotationY] = s.mMotorSettings[Axis::RotationZ]
					= MotorSettings(10.0f, 1.0f, 0.0f, 1.0e6f);
		} else {
			s.MakeFixedAxis(Axis::RotationY);
		}
		s.MakeFixedAxis(Axis::RotationZ);

		auto *c = static_cast<SixDOFConstraint *>(s.Create(*out.chassis, *out.wheels[i]));
		sys.AddConstraint(c);
		out.joints[i] = c;

		c->SetTargetPositionCS(Vec3::sZero());
		c->SetMotorState(Axis::TranslationY, EMotorState::Position);
		if (steers) {
			c->SetTargetOrientationCS(Quat::sIdentity());
			c->SetMotorState(Axis::RotationY, EMotorState::Position);
			c->SetMotorState(Axis::RotationZ, EMotorState::Position);
		}
	}

	return out;
}

/// Tração nas quatro pelo eixo, esterço nas dianteiras.
/// `forward` e `turn` em [-1, 1]; `speed` é a velocidade-alvo em m/s.
inline void DriveCar(CarParts &parts, JPH::BodyInterface &bi, const CarParams &p,
		float forward, float turn, float speed) {
	using namespace JPH;

	const bool moving = forward != 0.0f;
	// v = ω·r, então ω = v/r.
	const float omega = forward * speed / p.wheel_radius;
	// turn > 0 vira para -x, o mesmo sentido do skid-steer do rocker.
	const Quat steer = Quat::sRotation(Vec3::sAxisY(), -turn * DegreesToRadians(p.max_steer_deg));

	for (int i = 0; i < kCarWheels; ++i) {
		SixDOFConstraint *c = parts.joints[i];
		if (CarParts::IsFront(i) && p.max_steer_deg > 0.0f) {
			c->SetTargetOrientationCS(steer);
		}
		c->SetMotorState(Axis::RotationX, moving ? EMotorState::Velocity : EMotorState::Off);
		c->SetTargetAngularVelocityCS(Vec3(moving ? omega : 0.0f, 0, 0));
	}

	bi.ActivateBody(parts.chassis->GetID());
	for (Body *w : parts.wheels) {
		bi.ActivateBody(w->GetID());
	}
}

/// Remove do mundo as juntas e os corpos do carro.
inline void DestroyCar(JPH::PhysicsSystem &sys, CarParts &parts) {
	for (auto &c : parts.joints) {
		if (c != nullptr) {
			sys.RemoveConstraint(c);
			c = nullptr;
		}
	}
	JPH::BodyInterface &bi = sys.GetBodyInterface();
	auto kill = [&bi](JPH::Body *&b) {
		if (b != nullptr) {
			bi.RemoveBody(b->GetID());
			bi.DestroyBody(b->GetID());
			b = nullptr;
		}
	};
	for (JPH::Body *&b : parts.wheels) {
		kill(b);
	}
	kill(parts.chassis);
	parts = CarParts();
}

} // namespace gdjolt

#endif // GDJOLT_CAR_RIG_H
