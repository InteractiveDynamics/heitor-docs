#include "jolt_vehicle.h"

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/classes/input.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

using namespace godot;

#ifdef GDJOLT_HAS_JOLT

#include <Jolt/Core/Factory.h>
#include <Jolt/Physics/Body/BodyCreationSettings.h>
#include <Jolt/Physics/Collision/Shape/BoxShape.h>
#include <Jolt/Physics/Collision/Shape/OffsetCenterOfMassShape.h>
#include <Jolt/Physics/Vehicle/VehicleCollisionTester.h>
#include <Jolt/Physics/Vehicle/WheeledVehicleController.h>
#include <Jolt/RegisterTypes.h>

#include <thread>

JPH_SUPPRESS_WARNINGS

using namespace JPH;
using namespace JPH::literals;

namespace gdjolt {

namespace {

// RegisterTypes/Factory são globais do Jolt: valem para o processo, não para o
// nó. Vários JoltVehicle na cena não podem registrar duas vezes, e o último a
// sair é quem desfaz.
int g_jolt_users = 0;

void jolt_acquire() {
	if (g_jolt_users++ > 0) {
		return;
	}
	RegisterDefaultAllocator();
	Factory::sInstance = new Factory();
	RegisterTypes();
}

void jolt_release() {
	if (--g_jolt_users > 0) {
		return;
	}
	UnregisterTypes();
	delete Factory::sInstance;
	Factory::sInstance = nullptr;
}

constexpr float kWheelRadius = 0.3f;
constexpr float kWheelWidth = 0.1f;
constexpr float kHalfLength = 2.0f;
constexpr float kHalfWidth = 0.9f;
constexpr float kHalfHeight = 0.2f;

WheelSettingsWV *make_wheel(Vec3Arg position, float max_steer, float hand_brake) {
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

Transform3D to_godot(RMat44Arg m) {
	Vec3 x = m.GetAxisX(), y = m.GetAxisY(), z = m.GetAxisZ();
	RVec3 t = m.GetTranslation();
	return Transform3D(
			Basis(Vector3(x.GetX(), x.GetY(), x.GetZ()),
					Vector3(y.GetX(), y.GetY(), y.GetZ()),
					Vector3(z.GetX(), z.GetY(), z.GetZ())),
			Vector3((float)t.GetX(), (float)t.GetY(), (float)t.GetZ()));
}

} // namespace

JoltVehicle::JoltVehicle() {}

JoltVehicle::~JoltVehicle() {
	teardown_world();
}

void JoltVehicle::_ready() {
	if (Engine::get_singleton()->is_editor_hint()) {
		return;
	}
	build_world();
	UtilityFunctions::print(godot::String::utf8("[JoltVehicle] mundo do Jolt no ar — "), (int)vehicle_mass, " kg, 4 rodas.");
}

void JoltVehicle::build_world() {
	if (physics_system) {
		return;
	}

	jolt_acquire();

	temp_allocator = std::make_unique<TempAllocatorImpl>(10 * 1024 * 1024);
	job_system = std::make_unique<JobSystemThreadPool>(
			cMaxPhysicsJobs, cMaxPhysicsBarriers,
			(int)std::max(1u, std::thread::hardware_concurrency() - 1));

	physics_system = std::make_unique<PhysicsSystem>();
	physics_system->Init(1024, 0, 1024, 1024,
			broad_phase_layer_interface, object_vs_broadphase_filter, object_vs_object_filter);

	BodyInterface &bi = physics_system->GetBodyInterface();

	BodyCreationSettings floor_settings(new BoxShape(Vec3(100.0f, 1.0f, 100.0f)),
			RVec3(0.0_r, -1.0_r, 0.0_r), Quat::sIdentity(),
			EMotionType::Static, Layers::NON_MOVING);
	floor_body = bi.CreateBody(floor_settings);
	bi.AddBody(floor_body->GetID(), EActivation::DontActivate);

	// O corpo nasce onde o nó está na cena.
	Vector3 origin = get_global_transform().origin;

	RefConst<Shape> car_shape = OffsetCenterOfMassShapeSettings(
			Vec3(0, -kHalfHeight, 0),
			new BoxShape(Vec3(kHalfWidth, kHalfHeight, kHalfLength)))
										.Create()
										.Get();

	BodyCreationSettings car_settings(car_shape,
			RVec3(origin.x, origin.y, origin.z), Quat::sIdentity(),
			EMotionType::Dynamic, Layers::MOVING);
	car_settings.mOverrideMassProperties = EOverrideMassProperties::CalculateInertia;
	car_settings.mMassPropertiesOverride.mMass = (float)vehicle_mass;

	car_body = bi.CreateBody(car_settings);
	bi.AddBody(car_body->GetID(), EActivation::Activate);

	VehicleConstraintSettings vehicle;
	const float front_z = kHalfLength - 2.0f * kWheelRadius;
	const float rear_z = -kHalfLength + 2.0f * kWheelRadius;
	const float wheel_y = -0.9f * kHalfHeight;
	const float max_steer = DegreesToRadians(30.0f);

	vehicle.mWheels = {
		make_wheel(Vec3(kHalfWidth, wheel_y, front_z), max_steer, 0.0f),
		make_wheel(Vec3(-kHalfWidth, wheel_y, front_z), max_steer, 0.0f),
		make_wheel(Vec3(kHalfWidth, wheel_y, rear_z), 0.0f, 4000.0f),
		make_wheel(Vec3(-kHalfWidth, wheel_y, rear_z), 0.0f, 4000.0f),
	};

	WheeledVehicleControllerSettings *controller = new WheeledVehicleControllerSettings;
	controller->mDifferentials.resize(1);
	controller->mDifferentials[0].mLeftWheel = 0;
	controller->mDifferentials[0].mRightWheel = 1;
	vehicle.mController = controller;

	constraint = new VehicleConstraint(*car_body, vehicle);
	constraint->SetVehicleCollisionTester(new VehicleCollisionTesterRay(Layers::MOVING));

	physics_system->AddConstraint(constraint);
	physics_system->AddStepListener(constraint);
	physics_system->OptimizeBroadPhase();
}

void JoltVehicle::teardown_world() {
	if (!physics_system) {
		return;
	}

	physics_system->RemoveStepListener(constraint);
	physics_system->RemoveConstraint(constraint);
	constraint = nullptr;

	BodyInterface &bi = physics_system->GetBodyInterface();
	for (Body *b : { car_body, floor_body }) {
		if (b != nullptr) {
			bi.RemoveBody(b->GetID());
			bi.DestroyBody(b->GetID());
		}
	}
	car_body = nullptr;
	floor_body = nullptr;

	physics_system.reset();
	job_system.reset();
	temp_allocator.reset();

	jolt_release();
}

void JoltVehicle::_physics_process(double delta) {
	if (Engine::get_singleton()->is_editor_hint() || !physics_system) {
		return;
	}

	if (read_input) {
		Input *input = Input::get_singleton();
		in_forward = (float)input->get_axis("ui_down", "ui_up");
		in_right = (float)input->get_axis("ui_left", "ui_right");
		in_hand_brake = input->is_action_pressed("ui_accept") ? 1.0f : 0.0f;
	}

	WheeledVehicleController *wvc = static_cast<WheeledVehicleController *>(constraint->GetController());
	wvc->SetDriverInput(in_forward, in_right, in_brake, in_hand_brake);
	physics_system->GetBodyInterface().ActivateBody(car_body->GetID());

	// O passo do Godot já é fixo (physics_ticks_per_second). O clamp só protege
	// contra um stall do processo virar um salto grande demais pro solver.
	const float step = (float)std::min(delta, 1.0 / 30.0);
	physics_system->Update(step, 1, temp_allocator.get(), job_system.get());

	push_transforms();
}

void JoltVehicle::push_transforms() {
	set_global_transform(to_godot(car_body->GetWorldTransform()));

	for (uint i = 0; i < constraint->GetWheels().size(); ++i) {
		Node *child = find_child(vformat("Wheel%d", i), false, false);
		Node3D *wheel_node = Object::cast_to<Node3D>(child);
		if (wheel_node == nullptr) {
			continue;
		}
		// Right = X, Up = Y: a roda gira em torno do próprio eixo X.
		Mat44 local = constraint->GetWheelLocalTransform(i, Vec3::sAxisX(), Vec3::sAxisY());
		wheel_node->set_transform(to_godot(RMat44(local)));
	}
}

void JoltVehicle::set_driver_input(double forward, double right, double brake, double hand_brake) {
	in_forward = (float)forward;
	in_right = (float)right;
	in_brake = (float)brake;
	in_hand_brake = (float)hand_brake;
}

double JoltVehicle::get_suspension_length(int wheel) const {
	if (!constraint || wheel < 0 || wheel >= (int)constraint->GetWheels().size()) {
		return 0.0;
	}
	return constraint->GetWheel(wheel)->GetSuspensionLength();
}

double JoltVehicle::get_suspension_impulse(int wheel) const {
	if (!constraint || wheel < 0 || wheel >= (int)constraint->GetWheels().size()) {
		return 0.0;
	}
	return constraint->GetWheel(wheel)->GetSuspensionLambda();
}

double JoltVehicle::get_lateral_impulse(int wheel) const {
	if (!constraint || wheel < 0 || wheel >= (int)constraint->GetWheels().size()) {
		return 0.0;
	}
	return constraint->GetWheel(wheel)->GetLateralLambda();
}

bool JoltVehicle::has_wheel_contact(int wheel) const {
	if (!constraint || wheel < 0 || wheel >= (int)constraint->GetWheels().size()) {
		return false;
	}
	return constraint->GetWheel(wheel)->HasContact();
}

void JoltVehicle::set_vehicle_mass(double p_mass) {
	vehicle_mass = p_mass > 1.0 ? p_mass : 1.0;
}

double JoltVehicle::get_vehicle_mass() const {
	return vehicle_mass;
}

void JoltVehicle::set_read_input(bool p_read) {
	read_input = p_read;
}

bool JoltVehicle::get_read_input() const {
	return read_input;
}

void JoltVehicle::_bind_methods() {
	ClassDB::bind_method(D_METHOD("set_driver_input", "forward", "right", "brake", "hand_brake"),
			&JoltVehicle::set_driver_input);

	ClassDB::bind_method(D_METHOD("get_suspension_length", "wheel"), &JoltVehicle::get_suspension_length);
	ClassDB::bind_method(D_METHOD("get_suspension_impulse", "wheel"), &JoltVehicle::get_suspension_impulse);
	ClassDB::bind_method(D_METHOD("get_lateral_impulse", "wheel"), &JoltVehicle::get_lateral_impulse);
	ClassDB::bind_method(D_METHOD("has_wheel_contact", "wheel"), &JoltVehicle::has_wheel_contact);

	ClassDB::bind_method(D_METHOD("set_vehicle_mass", "mass"), &JoltVehicle::set_vehicle_mass);
	ClassDB::bind_method(D_METHOD("get_vehicle_mass"), &JoltVehicle::get_vehicle_mass);
	ADD_PROPERTY(PropertyInfo(Variant::FLOAT, "vehicle_mass", PROPERTY_HINT_RANGE, "1,10000,1"),
			"set_vehicle_mass", "get_vehicle_mass");

	ClassDB::bind_method(D_METHOD("set_read_input", "read"), &JoltVehicle::set_read_input);
	ClassDB::bind_method(D_METHOD("get_read_input"), &JoltVehicle::get_read_input);
	ADD_PROPERTY(PropertyInfo(Variant::BOOL, "read_input"), "set_read_input", "get_read_input");
}

} // namespace gdjolt

#else // !GDJOLT_HAS_JOLT

namespace gdjolt {

void JoltVehicle::_ready() {
	UtilityFunctions::push_warning(godot::String::utf8(
			"[JoltVehicle] extensão compilada sem a libJolt.a — nó inerte. "
			"Compile o Jolt e rode o scons de novo."));
}

} // namespace gdjolt

#endif // GDJOLT_HAS_JOLT
