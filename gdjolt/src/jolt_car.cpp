#include "jolt_car.h"

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/classes/input.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

using namespace godot;

#ifdef GDJOLT_HAS_JOLT

#include "jolt_runtime.h"
#include "rocker_rig.h" // MakeRockerGroupFilter

#include <algorithm>
#include <cmath>
#include <thread>

JPH_SUPPRESS_WARNINGS

using namespace JPH;
using namespace JPH::literals;

namespace gdjolt {

namespace {

Transform3D to_godot(RMat44Arg m) {
	Vec3 x = m.GetAxisX(), y = m.GetAxisY(), z = m.GetAxisZ();
	RVec3 t = m.GetTranslation();
	return Transform3D(
			Basis(Vector3(x.GetX(), x.GetY(), x.GetZ()),
					Vector3(y.GetX(), y.GetY(), y.GetZ()),
					Vector3(z.GetX(), z.GetY(), z.GetZ())),
			Vector3((float)t.GetX(), (float)t.GetY(), (float)t.GetZ()));
}

void place(Node *parent, const char *name, const Body *body) {
	Node *child = parent->find_child(name, false, false);
	Node3D *node = Object::cast_to<Node3D>(child);
	if (node != nullptr && body != nullptr) {
		node->set_global_transform(to_godot(body->GetWorldTransform()));
	}
}

} // namespace

JoltCar::JoltCar() {}

JoltCar::~JoltCar() {
	teardown_world();
}

void JoltCar::_ready() {
	if (Engine::get_singleton()->is_editor_hint()) {
		return;
	}
	build_world();
	UtilityFunctions::print(godot::String::utf8("[JoltCar] carro com rodas de verdade no ar — 5 corpos, 4 juntas, mola de "),
			(int)std::lround(params.Stiffness()), godot::String::utf8(" N/m, "),
			substeps, godot::String::utf8(" sub-passo(s) por quadro."));
}

void JoltCar::build_world() {
	if (physics_system) {
		return;
	}

	JoltAcquire();

	temp_allocator = std::make_unique<TempAllocatorImpl>(16 * 1024 * 1024);
	job_system = std::make_unique<JobSystemThreadPool>(
			cMaxPhysicsJobs, cMaxPhysicsBarriers,
			(int)std::max(1u, std::thread::hardware_concurrency() - 1));

	physics_system = std::make_unique<PhysicsSystem>();
	physics_system->Init(1024, 0, 1024, 1024,
			broad_phase_layer_interface, object_vs_broadphase_filter, object_vs_object_filter);

	BodyInterface &bi = physics_system->GetBodyInterface();

	// --- chão ---------------------------------------------------------------
	{
		BodyCreationSettings floor(new BoxShape(Vec3(100.0f, 1.0f, 100.0f)),
				RVec3(0.0_r, -1.0_r, 0.0_r), Quat::sIdentity(),
				EMotionType::Static, Layers::NON_MOVING);
		floor.mFriction = params.friction;
		floor_body = bi.CreateBody(floor);
		bi.AddBody(floor_body->GetID(), EActivation::DontActivate);
	}

	// --- o degrau -----------------------------------------------------------
	// Mesma geometria do banco de ensaio: uma laje que começa em z = 6.
	if (step_height > 0.0) {
		const float h = (float)step_height;
		BodyCreationSettings step(new BoxShape(Vec3(20.0f, 0.5f * h, 4.0f)),
				RVec3(0.0_r, Real(0.5f * h), Real(10.0f)), Quat::sIdentity(),
				EMotionType::Static, Layers::NON_MOVING);
		step.mFriction = params.friction;
		step_body = bi.CreateBody(step);
		bi.AddBody(step_body->GetID(), EActivation::DontActivate);
	}

	// --- o carro ------------------------------------------------------------
	// A roda nasce com a suspensão toda estendida. Se o nó estiver baixo demais
	// para isso, sobe o chassi até a roda nascer encostando no chão, como o
	// banco de ensaio faz.
	group_filter = MakeRockerGroupFilter(1 + kCarWheels);
	Vector3 origin = get_global_transform().origin;
	const float wheel_y = origin.y + params.AttachY() - params.susp_max;
	const float lift = std::max(0.0f, params.wheel_radius - wheel_y);
	parts = BuildCar(*physics_system, bi, group_filter,
			RVec3(origin.x, origin.y + lift, origin.z), params);

	physics_system->OptimizeBroadPhase();
}

void JoltCar::teardown_world() {
	if (!physics_system) {
		return;
	}

	DestroyCar(*physics_system, parts);

	BodyInterface &bi = physics_system->GetBodyInterface();
	for (Body *b : { floor_body, step_body }) {
		if (b != nullptr) {
			bi.RemoveBody(b->GetID());
			bi.DestroyBody(b->GetID());
		}
	}
	floor_body = nullptr;
	step_body = nullptr;
	group_filter = nullptr;

	physics_system.reset();
	job_system.reset();
	temp_allocator.reset();

	JoltRelease();
}

void JoltCar::_physics_process(double delta) {
	if (Engine::get_singleton()->is_editor_hint() || !physics_system) {
		return;
	}

	if (read_input) {
		Input *input = Input::get_singleton();
		in_forward = (float)input->get_axis("ui_down", "ui_up");
		in_turn = (float)input->get_axis("ui_left", "ui_right");
	}

	DriveCar(parts, physics_system->GetBodyInterface(), params,
			in_forward, in_turn, (float)target_speed);

	const float step = (float)std::min(delta, 1.0 / 30.0) / substeps;
	for (int i = 0; i < substeps; ++i) {
		physics_system->Update(step, 1, temp_allocator.get(), job_system.get());
	}

	push_transforms();
}

void JoltCar::push_transforms() {
	place(this, "Chassis", parts.chassis);
	for (int i = 0; i < kCarWheels; ++i) {
		place(this, vformat("Wheel%d", i).utf8().get_data(), parts.wheels[i]);
	}
}

void JoltCar::set_driver_input(double forward, double turn) {
	in_forward = (float)forward;
	in_turn = (float)turn;
}

double JoltCar::get_chassis_tilt() const {
	if (parts.chassis == nullptr) {
		return 0.0;
	}
	Vec3 up = parts.chassis->GetRotation().RotateAxisY();
	float c = std::min(1.0f, std::max(-1.0f, up.Dot(Vec3::sAxisY())));
	return RadiansToDegrees(std::acos(c));
}

double JoltCar::get_chassis_z() const {
	return parts.chassis == nullptr ? 0.0 : parts.chassis->GetPosition().GetZ();
}

double JoltCar::get_compression(int wheel) const {
	if (wheel < 0 || wheel >= kCarWheels || parts.chassis == nullptr) {
		return 0.0;
	}
	return parts.Compression(wheel);
}

double JoltCar::get_motor_torque(int wheel) const {
	if (wheel < 0 || wheel >= kCarWheels || parts.joints[wheel] == nullptr) {
		return 0.0;
	}
	return parts.joints[wheel]->GetTotalLambdaMotorRotation().GetX();
}

void JoltCar::set_substeps(int p_substeps) { substeps = p_substeps < 1 ? 1 : p_substeps; }
int JoltCar::get_substeps() const { return substeps; }
void JoltCar::set_target_speed(double p_speed) { target_speed = p_speed; }
double JoltCar::get_target_speed() const { return target_speed; }
void JoltCar::set_step_height(double p_height) { step_height = p_height < 0.0 ? 0.0 : p_height; }
double JoltCar::get_step_height() const { return step_height; }
void JoltCar::set_read_input(bool p_read) { read_input = p_read; }
bool JoltCar::get_read_input() const { return read_input; }
void JoltCar::set_max_steer_deg(double p_deg) {
	// Com 0 as dianteiras ficam com o giro em Y travado, como no banco de
	// ensaio. A junta é montada no _ready, então só vale antes dele.
	if (physics_system) {
		UtilityFunctions::push_warning(godot::String::utf8("[JoltCar] max_steer_deg só vale antes do _ready."));
		return;
	}
	params.max_steer_deg = (float)std::max(0.0, p_deg);
}
double JoltCar::get_max_steer_deg() const { return params.max_steer_deg; }

void JoltCar::_bind_methods() {
	ClassDB::bind_method(D_METHOD("set_driver_input", "forward", "turn"), &JoltCar::set_driver_input);

	ClassDB::bind_method(D_METHOD("get_chassis_tilt"), &JoltCar::get_chassis_tilt);
	ClassDB::bind_method(D_METHOD("get_chassis_z"), &JoltCar::get_chassis_z);
	ClassDB::bind_method(D_METHOD("get_compression", "wheel"), &JoltCar::get_compression);
	ClassDB::bind_method(D_METHOD("get_motor_torque", "wheel"), &JoltCar::get_motor_torque);

	ClassDB::bind_method(D_METHOD("set_substeps", "substeps"), &JoltCar::set_substeps);
	ClassDB::bind_method(D_METHOD("get_substeps"), &JoltCar::get_substeps);
	ADD_PROPERTY(PropertyInfo(Variant::INT, "substeps", PROPERTY_HINT_RANGE, "1,16,1"),
			"set_substeps", "get_substeps");

	ClassDB::bind_method(D_METHOD("set_target_speed", "speed"), &JoltCar::set_target_speed);
	ClassDB::bind_method(D_METHOD("get_target_speed"), &JoltCar::get_target_speed);
	ADD_PROPERTY(PropertyInfo(Variant::FLOAT, "target_speed", PROPERTY_HINT_RANGE, "0.1,10,0.1"),
			"set_target_speed", "get_target_speed");

	ClassDB::bind_method(D_METHOD("set_step_height", "height"), &JoltCar::set_step_height);
	ClassDB::bind_method(D_METHOD("get_step_height"), &JoltCar::get_step_height);
	ADD_PROPERTY(PropertyInfo(Variant::FLOAT, "step_height", PROPERTY_HINT_RANGE, "0,1,0.01"),
			"set_step_height", "get_step_height");

	ClassDB::bind_method(D_METHOD("set_read_input", "read"), &JoltCar::set_read_input);
	ClassDB::bind_method(D_METHOD("get_read_input"), &JoltCar::get_read_input);
	ADD_PROPERTY(PropertyInfo(Variant::BOOL, "read_input"), "set_read_input", "get_read_input");

	ClassDB::bind_method(D_METHOD("set_max_steer_deg", "deg"), &JoltCar::set_max_steer_deg);
	ClassDB::bind_method(D_METHOD("get_max_steer_deg"), &JoltCar::get_max_steer_deg);
	ADD_PROPERTY(PropertyInfo(Variant::FLOAT, "max_steer_deg", PROPERTY_HINT_RANGE, "0,45,1"),
			"set_max_steer_deg", "get_max_steer_deg");
}

} // namespace gdjolt

#else // !GDJOLT_HAS_JOLT

namespace gdjolt {

void JoltCar::_ready() {
	UtilityFunctions::push_warning(godot::String::utf8(
			"[JoltCar] extensão compilada sem a libJolt.a — nó inerte."));
}

} // namespace gdjolt

#endif // GDJOLT_HAS_JOLT
