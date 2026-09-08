// Etapa 2 · Jolt puro, sem o Godot no caminho.
//
// Sobe um PhysicsSystem, cria um chão estático e um veículo de quatro rodas com
// VehicleConstraint + WheeledVehicleController + VehicleCollisionTesterRay, e
// imprime a telemetria por roda passo a passo.
//
// O ponto de isolar isto num binário de terminal: se mais adiante a extensão
// der problema, este programa diz se o Jolt sozinho estava certo. É também onde
// dá pra ver de perto o que a doc "Um corpo só, quatro bengalas" descreveu —
// a suspensão comprimindo até o equilíbrio e o clamp μ·N no impulso lateral.
//
// Baseado em HelloWorld/HelloWorld.cpp e em
// Samples/Tests/Vehicle/VehicleConstraintTest.cpp do repositório do Jolt.

#include <Jolt/Jolt.h>

#include <Jolt/Core/Factory.h>
#include <Jolt/Core/JobSystemThreadPool.h>
#include <Jolt/Core/TempAllocator.h>
#include <Jolt/Physics/Body/BodyCreationSettings.h>
#include <Jolt/Physics/Collision/Shape/BoxShape.h>
#include <Jolt/Physics/Collision/Shape/OffsetCenterOfMassShape.h>
#include <Jolt/Physics/PhysicsSettings.h>
#include <Jolt/Physics/PhysicsSystem.h>
#include <Jolt/Physics/Vehicle/VehicleCollisionTester.h>
#include <Jolt/Physics/Vehicle/VehicleConstraint.h>
#include <Jolt/Physics/Vehicle/WheeledVehicleController.h>
#include <Jolt/RegisterTypes.h>

#include "../src/jolt_layers.h"

#include <cstdarg>
#include <cstdio>
#include <iostream>
#include <thread>

JPH_SUPPRESS_WARNINGS

using namespace JPH;
using namespace JPH::literals;
using namespace gdjolt;

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

// Dimensões do veículo — as mesmas proporções do sample, para que a telemetria
// seja comparável com o que se vê rodando o VehicleConstraintTest.
static constexpr float kWheelRadius = 0.3f;
static constexpr float kWheelWidth = 0.1f;
static constexpr float kHalfLength = 2.0f;
static constexpr float kHalfWidth = 0.9f;
static constexpr float kHalfHeight = 0.2f;
static constexpr float kVehicleMass = 1500.0f;

static constexpr float kSuspensionMin = 0.3f;
static constexpr float kSuspensionMax = 0.5f;
static constexpr float kSuspensionFreq = 1.5f;
static constexpr float kSuspensionDamping = 0.5f;

static WheelSettingsWV *MakeWheel(Vec3Arg inPosition, float inMaxSteerAngle, float inHandBrakeTorque) {
	WheelSettingsWV *w = new WheelSettingsWV;
	w->mPosition = inPosition;
	w->mRadius = kWheelRadius;
	w->mWidth = kWheelWidth;
	w->mSuspensionMinLength = kSuspensionMin;
	w->mSuspensionMaxLength = kSuspensionMax;
	w->mSuspensionSpring.mFrequency = kSuspensionFreq;
	w->mSuspensionSpring.mDamping = kSuspensionDamping;
	w->mMaxSteerAngle = inMaxSteerAngle;
	w->mMaxHandBrakeTorque = inHandBrakeTorque;
	return w;
}

int main() {
	RegisterDefaultAllocator();

	Trace = TraceImpl;
	JPH_IF_ENABLE_ASSERTS(AssertFailed = AssertFailedImpl;)

	Factory::sInstance = new Factory();
	RegisterTypes();

	TempAllocatorImpl temp_allocator(10 * 1024 * 1024);
	JobSystemThreadPool job_system(cMaxPhysicsJobs, cMaxPhysicsBarriers,
			std::thread::hardware_concurrency() - 1);

	const uint cMaxBodies = 1024;
	const uint cNumBodyMutexes = 0;
	const uint cMaxBodyPairs = 1024;
	const uint cMaxContactConstraints = 1024;

	BPLayerInterfaceImpl broad_phase_layer_interface;
	ObjectVsBroadPhaseLayerFilterImpl object_vs_broadphase_layer_filter;
	ObjectLayerPairFilterImpl object_vs_object_layer_filter;

	PhysicsSystem physics_system;
	physics_system.Init(cMaxBodies, cNumBodyMutexes, cMaxBodyPairs, cMaxContactConstraints,
			broad_phase_layer_interface, object_vs_broadphase_layer_filter,
			object_vs_object_layer_filter);

	BodyInterface &body_interface = physics_system.GetBodyInterface();

	// --- chão ---------------------------------------------------------------
	BodyCreationSettings floor_settings(new BoxShape(Vec3(100.0f, 1.0f, 100.0f)),
			RVec3(0.0_r, -1.0_r, 0.0_r), Quat::sIdentity(),
			EMotionType::Static, Layers::NON_MOVING);
	Body *floor = body_interface.CreateBody(floor_settings);
	body_interface.AddBody(floor->GetID(), EActivation::DontActivate);

	// --- corpo do veículo ---------------------------------------------------
	// Um corpo rígido SÓ. As rodas não são corpos: são dados dentro da constraint.
	RefConst<Shape> car_shape = OffsetCenterOfMassShapeSettings(
			Vec3(0, -kHalfHeight, 0),
			new BoxShape(Vec3(kHalfWidth, kHalfHeight, kHalfLength)))
									.Create()
									.Get();

	BodyCreationSettings car_settings(car_shape, RVec3(0.0_r, 2.0_r, 0.0_r),
			Quat::sIdentity(), EMotionType::Dynamic, Layers::MOVING);
	car_settings.mOverrideMassProperties = EOverrideMassProperties::CalculateInertia;
	car_settings.mMassPropertiesOverride.mMass = kVehicleMass;

	Body *car_body = body_interface.CreateBody(car_settings);
	body_interface.AddBody(car_body->GetID(), EActivation::Activate);

	// --- a constraint -------------------------------------------------------
	VehicleConstraintSettings vehicle;

	const float front_z = kHalfLength - 2.0f * kWheelRadius;
	const float rear_z = -kHalfLength + 2.0f * kWheelRadius;
	const float wheel_y = -0.9f * kHalfHeight;
	const float max_steer = DegreesToRadians(30.0f);
	const float hand_brake = 4000.0f;

	vehicle.mWheels = {
		MakeWheel(Vec3(kHalfWidth, wheel_y, front_z), max_steer, 0.0f), // 0 · diant. esq.
		MakeWheel(Vec3(-kHalfWidth, wheel_y, front_z), max_steer, 0.0f), // 1 · diant. dir.
		MakeWheel(Vec3(kHalfWidth, wheel_y, rear_z), 0.0f, hand_brake), // 2 · tras. esq.
		MakeWheel(Vec3(-kHalfWidth, wheel_y, rear_z), 0.0f, hand_brake), // 3 · tras. dir.
	};

	WheeledVehicleControllerSettings *controller = new WheeledVehicleControllerSettings;
	controller->mDifferentials.resize(1);
	controller->mDifferentials[0].mLeftWheel = 0;
	controller->mDifferentials[0].mRightWheel = 1;
	vehicle.mController = controller;

	VehicleConstraint *constraint = new VehicleConstraint(*car_body, vehicle);
	constraint->SetVehicleCollisionTester(new VehicleCollisionTesterRay(Layers::MOVING));

	// A constraint entra DUAS vezes no sistema: como restrição (resolvida pelo
	// solver) e como step listener (é aí que o raycast acontece, antes do solver).
	physics_system.AddConstraint(constraint);
	physics_system.AddStepListener(constraint);

	physics_system.OptimizeBroadPhase();

	// --- o laço -------------------------------------------------------------
	const float delta_time = 1.0f / 60.0f;
	const int collision_steps = 1;
	const int total_steps = 180; // 3 segundos
	const int report_every = 15;

	WheeledVehicleController *wvc = static_cast<WheeledVehicleController *>(constraint->GetController());

	std::printf("passo | altura |  vel  | roda |  susp  | imp.susp | imp.lat | contato\n");
	std::printf("------+--------+-------+------+--------+----------+---------+--------\n");

	for (int step = 1; step <= total_steps; ++step) {
		// Depois de um segundo, acelera pra frente: a partir daí o impulso
		// longitudinal e o lateral deixam de ser zero.
		wvc->SetDriverInput(step > 60 ? 1.0f : 0.0f, 0.0f, 0.0f, step > 60 ? 0.0f : 1.0f);
		body_interface.ActivateBody(car_body->GetID());

		physics_system.Update(delta_time, collision_steps, &temp_allocator, &job_system);

		if (step % report_every != 0) {
			continue;
		}

		RVec3 pos = car_body->GetPosition();
		Vec3 vel = car_body->GetLinearVelocity();

		for (uint i = 0; i < constraint->GetWheels().size(); ++i) {
			const Wheel *w = constraint->GetWheel(i);
			const bool has_contact = w->HasContact();

			if (i == 0) {
				std::printf("%5d | %6.3f | %5.2f |", step, (double)pos.GetY(), (double)vel.Length());
			} else {
				std::printf("      |        |       |");
			}

			std::printf("  %d   | %6.4f | %8.1f | %7.1f | %s\n",
					i,
					(double)w->GetSuspensionLength(),
					(double)w->GetSuspensionLambda(),
					(double)w->GetLateralLambda(),
					has_contact ? "sim" : "NAO");
		}
		std::printf("------+--------+-------+------+--------+----------+---------+--------\n");
	}

	// --- limpeza ------------------------------------------------------------
	physics_system.RemoveStepListener(constraint);
	physics_system.RemoveConstraint(constraint);
	body_interface.RemoveBody(car_body->GetID());
	body_interface.DestroyBody(car_body->GetID());
	body_interface.RemoveBody(floor->GetID());
	body_interface.DestroyBody(floor->GetID());

	UnregisterTypes();
	delete Factory::sInstance;
	Factory::sInstance = nullptr;

	return 0;
}
