#ifndef GDJOLT_JOLT_CAR_H
#define GDJOLT_JOLT_CAR_H

#include <godot_cpp/classes/node3d.hpp>

#ifdef GDJOLT_HAS_JOLT

#include <Jolt/Jolt.h>

#include <Jolt/Core/JobSystemThreadPool.h>
#include <Jolt/Core/TempAllocator.h>
#include <Jolt/Physics/PhysicsSystem.h>

#include "car_rig.h"
#include "jolt_layers.h"

#include <memory>

namespace gdjolt {

// O carro com rodas de verdade dentro do Godot: chassi e quatro rodas que são
// corpos, presas por SixDOFConstraint com mola no curso vertical. É o JoltVehicle
// (VehicleConstraint, roda que é dado) com as rodas promovidas a corpo.
//
// A montagem vem de car_rig.h, o mesmo header que o banco de ensaio usa.
//
// Se existirem filhos Node3D chamados Chassis e Wheel0..3, eles recebem a
// transform da peça correspondente a cada passo. Roda i: lado i / 2, dianteira
// quando i é par.
class JoltCar : public godot::Node3D {
	GDCLASS(JoltCar, godot::Node3D)

public:
	JoltCar();
	~JoltCar() override;

	void _ready() override;
	void _physics_process(double delta) override;

	void set_driver_input(double forward, double turn);

	// Telemetria — os mesmos números que o vehicle_probe imprime.
	double get_chassis_tilt() const;          ///< graus em relação à vertical
	double get_chassis_z() const;
	double get_compression(int wheel) const;  ///< m, 0 = roda solta
	double get_motor_torque(int wheel) const;

	void set_substeps(int p_substeps);
	int get_substeps() const;
	void set_target_speed(double p_speed);
	double get_target_speed() const;
	void set_step_height(double p_height);
	double get_step_height() const;
	void set_read_input(bool p_read);
	bool get_read_input() const;
	void set_max_steer_deg(double p_deg);
	double get_max_steer_deg() const;

protected:
	static void _bind_methods();

private:
	void build_world();
	void teardown_world();
	void push_transforms();

	std::unique_ptr<JPH::TempAllocatorImpl> temp_allocator;
	std::unique_ptr<JPH::JobSystemThreadPool> job_system;
	std::unique_ptr<JPH::PhysicsSystem> physics_system;

	BPLayerInterfaceImpl broad_phase_layer_interface;
	ObjectVsBroadPhaseLayerFilterImpl object_vs_broadphase_filter;
	ObjectLayerPairFilterImpl object_vs_object_filter;

	JPH::Ref<JPH::GroupFilterTable> group_filter;
	JPH::Body *floor_body = nullptr;
	JPH::Body *step_body = nullptr;

	CarParams params;
	CarParts parts;

	// O mesmo do JoltRocker e do banco de ensaio.
	int substeps = 4;
	double target_speed = 1.5;
	double step_height = 0.2;
	bool read_input = true;

	float in_forward = 0.0f;
	float in_turn = 0.0f;
};

} // namespace gdjolt

#else // !GDJOLT_HAS_JOLT

namespace gdjolt {

class JoltCar : public godot::Node3D {
	GDCLASS(JoltCar, godot::Node3D)

public:
	void _ready() override;

protected:
	static void _bind_methods() {}
};

} // namespace gdjolt

#endif // GDJOLT_HAS_JOLT

#endif // GDJOLT_JOLT_CAR_H
