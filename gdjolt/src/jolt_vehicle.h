#ifndef GDJOLT_JOLT_VEHICLE_H
#define GDJOLT_JOLT_VEHICLE_H

#include <godot_cpp/classes/node3d.hpp>

#ifdef GDJOLT_HAS_JOLT

#include <Jolt/Jolt.h>

#include <Jolt/Core/JobSystemThreadPool.h>
#include <Jolt/Core/TempAllocator.h>
#include <Jolt/Physics/PhysicsSystem.h>
#include <Jolt/Physics/Vehicle/VehicleConstraint.h>

#include "jolt_layers.h"

#include <memory>

namespace gdjolt {

// O nó que junta as duas metades: roda um PhysicsSystem do Jolt PRÓPRIO — não o
// módulo embutido no motor — e escreve o resultado nas transforms da cena. O
// Godot aqui é renderizador e input; quem simula é o Jolt.
//
// O veículo é um ÚNICO corpo rígido: as quatro rodas não são corpos, são dados
// dentro da VehicleConstraint. É o modelo lumped descrito em "Um corpo só,
// quatro bengalas".
//
// Se existirem filhos Node3D chamados Wheel0..Wheel3, eles recebem a transform
// de cada roda a cada passo.
class JoltVehicle : public godot::Node3D {
	GDCLASS(JoltVehicle, godot::Node3D)

public:
	JoltVehicle();
	~JoltVehicle() override;

	void _ready() override;
	void _physics_process(double delta) override;

	// Entrada do motorista. Separada da leitura de teclado de propósito: assim a
	// verificação headless dirige o veículo sem depender de input real.
	void set_driver_input(double forward, double right, double brake, double hand_brake);

	// Telemetria — o mesmo que o vehicle_probe imprime, exposto ao GDScript.
	double get_suspension_length(int wheel) const;
	double get_suspension_impulse(int wheel) const;
	double get_lateral_impulse(int wheel) const;
	bool has_wheel_contact(int wheel) const;
	double get_chassis_tilt() const; ///< graus em relação à vertical
	double get_forward_speed() const; ///< m/s ao longo do eixo do veículo

	void set_vehicle_mass(double p_mass);
	double get_vehicle_mass() const;
	void set_step_height(double p_height);
	double get_step_height() const;
	void set_four_wheel_drive(bool p_awd);
	bool get_four_wheel_drive() const;
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

	JPH::Body *car_body = nullptr;
	JPH::Body *floor_body = nullptr;
	JPH::Body *step_body = nullptr;
	JPH::Ref<JPH::VehicleConstraint> constraint;

	double vehicle_mass = 1500.0;
	bool read_input = true;
	// Os dois abaixo existem para a cena comparativa: mesmo degrau e mesma
	// tração do banco de ensaio, senão o vídeo compara coisas diferentes.
	double step_height = 0.0;
	bool four_wheel_drive = false;

	float in_forward = 0.0f;
	float in_right = 0.0f;
	float in_brake = 0.0f;
	float in_hand_brake = 1.0f;
};

} // namespace gdjolt

#else // !GDJOLT_HAS_JOLT

namespace gdjolt {

// Sem a libJolt.a o nó ainda existe, mas só avisa. Mantém a extensão
// carregável na etapa 1, quando ainda não há física.
class JoltVehicle : public godot::Node3D {
	GDCLASS(JoltVehicle, godot::Node3D)

public:
	void _ready() override;

protected:
	static void _bind_methods() {}
};

} // namespace gdjolt

#endif // GDJOLT_HAS_JOLT

#endif // GDJOLT_JOLT_VEHICLE_H
