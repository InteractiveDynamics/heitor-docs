#include "jolt_rocker.h"

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/classes/input.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

using namespace godot;

#ifdef GDJOLT_HAS_JOLT

#include "jolt_runtime.h"

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

JoltRocker::JoltRocker() {}

JoltRocker::~JoltRocker() {
	teardown_world();
}

void JoltRocker::_ready() {
	if (Engine::get_singleton()->is_editor_hint()) {
		return;
	}
	build_world();
	UtilityFunctions::print(godot::String::utf8("[JoltRocker] plataforma articulada no ar — "),
			params.NumBodies(), godot::String::utf8(" corpos, "),
			params.NumBodies() - 1, godot::String::utf8(" juntas, "),
			substeps, godot::String::utf8(" sub-passo(s) por quadro."));
}

void JoltRocker::build_world() {
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

	// --- a plataforma -------------------------------------------------------
	group_filter = MakeRockerGroupFilter(params.NumBodies());
	Vector3 origin = get_global_transform().origin;
	parts = BuildRocker(*physics_system, bi, group_filter,
			RVec3(origin.x, origin.y, origin.z), params);

	physics_system->OptimizeBroadPhase();
}

void JoltRocker::teardown_world() {
	if (!physics_system) {
		return;
	}

	DestroyRocker(*physics_system, parts);

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

void JoltRocker::_physics_process(double delta) {
	if (Engine::get_singleton()->is_editor_hint() || !physics_system) {
		return;
	}

	if (read_input) {
		Input *input = Input::get_singleton();
		in_forward = (float)input->get_axis("ui_down", "ui_up");
		in_turn = (float)input->get_axis("ui_left", "ui_right");
	}

	DriveRocker(parts, physics_system->GetBodyInterface(), params,
			in_forward, in_turn, (float)target_speed);

	// O quadro é dividido em sub-passos. Com um passo só, a razão de massa entre
	// o chassi e os braços deixa o solver sem convergir e o chassi afunda.
	const float step = (float)std::min(delta, 1.0 / 30.0) / substeps;
	for (int i = 0; i < substeps; ++i) {
		physics_system->Update(step, 1, temp_allocator.get(), job_system.get());
	}

	push_transforms();
}

void JoltRocker::push_transforms() {
	// O nó em si não se move: ele é o suporte. Quem se move são os filhos, e
	// cada um segue a sua própria peça de física.
	place(this, "Chassis", parts.chassis);
	place(this, "Arm0", parts.arms[0]);
	place(this, "Arm1", parts.arms[1]);
	place(this, "Bogie0", parts.bogies[0]);
	place(this, "Bogie1", parts.bogies[1]);
	for (int i = 0; i < parts.num_wheels; ++i) {
		place(this, vformat("Wheel%d", i).utf8().get_data(), parts.wheels[i]);
	}
}

void JoltRocker::set_driver_input(double forward, double turn) {
	in_forward = (float)forward;
	in_turn = (float)turn;
}

double JoltRocker::get_chassis_tilt() const {
	if (parts.chassis == nullptr) {
		return 0.0;
	}
	Vec3 up = parts.chassis->GetRotation().RotateAxisY();
	float c = std::min(1.0f, std::max(-1.0f, up.Dot(Vec3::sAxisY())));
	return RadiansToDegrees(std::acos(c));
}

double JoltRocker::get_arm_angle(int side) const {
	if (side < 0 || side > 1 || parts.arm_hinges[side] == nullptr) {
		return 0.0;
	}
	return RadiansToDegrees(parts.arm_hinges[side]->GetCurrentAngle());
}

double JoltRocker::get_bogie_angle(int side) const {
	if (side < 0 || side > 1 || parts.bogie_hinges[side] == nullptr) {
		return 0.0;
	}
	return RadiansToDegrees(parts.bogie_hinges[side]->GetCurrentAngle());
}

double JoltRocker::get_chassis_z() const {
	return parts.chassis == nullptr ? 0.0 : parts.chassis->GetPosition().GetZ();
}

double JoltRocker::get_motor_torque(int wheel) const {
	if (wheel < 0 || wheel >= parts.num_wheels || parts.wheel_hinges[wheel] == nullptr) {
		return 0.0;
	}
	return parts.wheel_hinges[wheel]->GetTotalLambdaMotor();
}

void JoltRocker::set_substeps(int p_substeps) { substeps = p_substeps < 1 ? 1 : p_substeps; }
int JoltRocker::get_substeps() const { return substeps; }
void JoltRocker::set_target_speed(double p_speed) { target_speed = p_speed; }
double JoltRocker::get_target_speed() const { return target_speed; }
void JoltRocker::set_step_height(double p_height) { step_height = p_height < 0.0 ? 0.0 : p_height; }
double JoltRocker::get_step_height() const { return step_height; }
void JoltRocker::set_bogie(bool p_bogie) {
	// A montagem é decidida na construção do mundo. Trocar depois exigiria
	// desmontar e remontar tudo, e nenhum uso precisa disso.
	if (physics_system) {
		UtilityFunctions::push_warning("[JoltRocker] bogie só vale antes do _ready.");
		return;
	}
	params.bogie = p_bogie;
}
bool JoltRocker::get_bogie() const { return params.bogie; }
void JoltRocker::set_read_input(bool p_read) { read_input = p_read; }
bool JoltRocker::get_read_input() const { return read_input; }

void JoltRocker::_bind_methods() {
	ClassDB::bind_method(D_METHOD("set_driver_input", "forward", "turn"), &JoltRocker::set_driver_input);

	ClassDB::bind_method(D_METHOD("get_chassis_tilt"), &JoltRocker::get_chassis_tilt);
	ClassDB::bind_method(D_METHOD("get_arm_angle", "side"), &JoltRocker::get_arm_angle);
	ClassDB::bind_method(D_METHOD("get_bogie_angle", "side"), &JoltRocker::get_bogie_angle);
	ClassDB::bind_method(D_METHOD("get_chassis_z"), &JoltRocker::get_chassis_z);
	ClassDB::bind_method(D_METHOD("get_motor_torque", "wheel"), &JoltRocker::get_motor_torque);

	ClassDB::bind_method(D_METHOD("set_bogie", "bogie"), &JoltRocker::set_bogie);
	ClassDB::bind_method(D_METHOD("get_bogie"), &JoltRocker::get_bogie);
	ADD_PROPERTY(PropertyInfo(Variant::BOOL, "bogie"), "set_bogie", "get_bogie");

	ClassDB::bind_method(D_METHOD("set_substeps", "substeps"), &JoltRocker::set_substeps);
	ClassDB::bind_method(D_METHOD("get_substeps"), &JoltRocker::get_substeps);
	ADD_PROPERTY(PropertyInfo(Variant::INT, "substeps", PROPERTY_HINT_RANGE, "1,16,1"),
			"set_substeps", "get_substeps");

	ClassDB::bind_method(D_METHOD("set_target_speed", "speed"), &JoltRocker::set_target_speed);
	ClassDB::bind_method(D_METHOD("get_target_speed"), &JoltRocker::get_target_speed);
	ADD_PROPERTY(PropertyInfo(Variant::FLOAT, "target_speed", PROPERTY_HINT_RANGE, "0.1,10,0.1"),
			"set_target_speed", "get_target_speed");

	ClassDB::bind_method(D_METHOD("set_step_height", "height"), &JoltRocker::set_step_height);
	ClassDB::bind_method(D_METHOD("get_step_height"), &JoltRocker::get_step_height);
	ADD_PROPERTY(PropertyInfo(Variant::FLOAT, "step_height", PROPERTY_HINT_RANGE, "0,1,0.01"),
			"set_step_height", "get_step_height");

	ClassDB::bind_method(D_METHOD("set_read_input", "read"), &JoltRocker::set_read_input);
	ClassDB::bind_method(D_METHOD("get_read_input"), &JoltRocker::get_read_input);
	ADD_PROPERTY(PropertyInfo(Variant::BOOL, "read_input"), "set_read_input", "get_read_input");
}

} // namespace gdjolt

#else // !GDJOLT_HAS_JOLT

namespace gdjolt {

void JoltRocker::_ready() {
	UtilityFunctions::push_warning(godot::String::utf8(
			"[JoltRocker] extensão compilada sem a libJolt.a — nó inerte."));
}

} // namespace gdjolt

#endif // GDJOLT_HAS_JOLT
