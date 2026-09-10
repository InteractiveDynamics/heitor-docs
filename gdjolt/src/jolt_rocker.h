#ifndef GDJOLT_JOLT_ROCKER_H
#define GDJOLT_JOLT_ROCKER_H

#include <godot_cpp/classes/node3d.hpp>

#ifdef GDJOLT_HAS_JOLT

#include <Jolt/Jolt.h>

#include <Jolt/Core/JobSystemThreadPool.h>
#include <Jolt/Core/TempAllocator.h>
#include <Jolt/Physics/PhysicsSystem.h>

#include "jolt_layers.h"
#include "rocker_rig.h"

#include <memory>

namespace gdjolt {

// A plataforma ARTICULADA dentro do Godot: sete corpos rígidos ligados por seis
// juntas, com motor no eixo de cada roda. É o contraste direto com o
// JoltVehicle, que é a VehicleConstraint — um corpo só, sem articulação.
//
// A montagem vem de rocker_rig.h, o mesmo header que o banco de ensaio no
// terminal usa. Isso é deliberado: o que se vê aqui é o que foi medido lá.
//
// Se existirem filhos Node3D chamados Chassis, Arm0, Arm1 e Wheel0..3, eles
// recebem a transform da peça correspondente a cada passo.
class JoltRocker : public godot::Node3D {
	GDCLASS(JoltRocker, godot::Node3D)

public:
	JoltRocker();
	~JoltRocker() override;

	void _ready() override;
	void _physics_process(double delta) override;

	void set_driver_input(double forward, double turn);

	// Telemetria — os mesmos números que o vehicle_probe imprime.
	double get_chassis_tilt() const;   ///< graus em relação à vertical
	double get_arm_angle(int side) const; ///< graus, articulação de cada braço
	double get_motor_torque(int wheel) const;

	void set_substeps(int p_substeps);
	int get_substeps() const;
	void set_target_speed(double p_speed);
	double get_target_speed() const;
	void set_step_height(double p_height);
	double get_step_height() const;
	void set_read_input(bool p_read);
	bool get_read_input() const;

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

	RockerParams params;
	RockerParts parts;

	// 4 sub-passos é onde a curva medida no terminal para de melhorar: com o
	// padrão (1), a razão de massa entre chassi e braços deixa o solver 12 cm
	// abaixo da altura geométrica correta.
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

class JoltRocker : public godot::Node3D {
	GDCLASS(JoltRocker, godot::Node3D)

public:
	void _ready() override;

protected:
	static void _bind_methods() {}
};

} // namespace gdjolt

#endif // GDJOLT_HAS_JOLT

#endif // GDJOLT_JOLT_ROCKER_H
