#ifndef GDJOLT_ROCKER_RIG_H
#define GDJOLT_ROCKER_RIG_H

// A montagem articulada, num lugar só.
//
//   chassi
//    ├─ HingeConstraint com curso ──→ braço esquerdo
//    │                                 ├─ Hinge + motor → roda diant. esq
//    │                                 └─ Hinge + motor → roda tras. esq
//    └─ HingeConstraint com curso ──→ braço direito
//                                      ├─ Hinge + motor → roda diant. dir
//                                      └─ Hinge + motor → roda tras. dir
//
// Sete corpos, seis juntas. Sem mola nenhuma: quem absorve o degrau é a
// GEOMETRIA — que é o princípio do rocker-bogie e o que não cabe num modelo de
// corpo único como a VehicleConstraint.
//
// Este header é compartilhado de propósito entre o banco de ensaio
// (tools/vehicle_probe.cpp) e o nó do Godot (src/jolt_rocker.cpp): o que aparece
// no vídeo tem que ser exatamente o que foi medido no terminal, e a única forma
// de garantir isso é não ter duas cópias da montagem.

#include <Jolt/Jolt.h>

#include <Jolt/Physics/Body/BodyCreationSettings.h>
#include <Jolt/Physics/Collision/GroupFilterTable.h>
#include <Jolt/Physics/Collision/Shape/BoxShape.h>
#include <Jolt/Physics/Collision/Shape/CylinderShape.h>
#include <Jolt/Physics/Constraints/HingeConstraint.h>
#include <Jolt/Physics/PhysicsSystem.h>

#include "jolt_layers.h"

namespace gdjolt {

struct RockerParams {
	float wheel_radius = 0.3f;
	float wheel_width = 0.2f;
	float half_length = 2.0f; // meia distância entre eixos + folga
	float half_width = 0.9f;  // meia bitola
	float half_height = 0.2f;
	float total_mass = 1500.0f;

	float arm_mass = 50.0f;
	float wheel_mass = 50.0f;
	float arm_half_w = 0.06f;
	float arm_y = -0.35f; // braço abaixo do chassi

	float arm_limit_deg = 30.0f;  // curso do braço
	float motor_torque = 3.0e4f;  // N·m no eixo da roda

	// O atrito PADRÃO de corpo no Jolt é 0.2 (BodyCreationSettings.h:107) —
	// baixo demais: a roda acionada por motor patina em vez de subir o degrau.
	// É parâmetro do experimento, não detalhe de implementação.
	float friction = 1.0f;

	float AxleZ() const { return half_length - 2.0f * wheel_radius; }
};

struct RockerParts {
	JPH::Body *chassis = nullptr;
	JPH::Body *arms[2] = {};
	JPH::Body *wheels[4] = {};
	JPH::Ref<JPH::HingeConstraint> arm_hinges[2];
	JPH::Ref<JPH::HingeConstraint> wheel_hinges[4];
};

namespace detail {

inline JPH::Body *MakeRockerBody(JPH::BodyInterface &bi, const JPH::Shape *shape,
		JPH::RVec3Arg pos, JPH::QuatArg rot, float mass, float friction,
		JPH::GroupFilterTable *filter, int sub_group) {
	JPH::BodyCreationSettings bcs(shape, pos, rot, JPH::EMotionType::Dynamic, Layers::MOVING);
	bcs.mOverrideMassProperties = JPH::EOverrideMassProperties::CalculateInertia;
	bcs.mMassPropertiesOverride.mMass = mass;
	bcs.mFriction = friction;
	// Peças ligadas por junta se tocam por construção. Sem este filtro o solver
	// briga contra a própria junta.
	bcs.mCollisionGroup = JPH::CollisionGroup(filter, 0, (JPH::CollisionGroup::SubGroupID)sub_group);

	JPH::Body *b = bi.CreateBody(bcs);
	bi.AddBody(b->GetID(), JPH::EActivation::Activate);
	return b;
}

inline JPH::HingeConstraint *MakeRockerHinge(JPH::PhysicsSystem &sys, JPH::Body &a, JPH::Body &b,
		JPH::RVec3Arg point, bool motor, float limit_deg, float motor_torque) {
	JPH::HingeConstraintSettings s;
	s.mSpace = JPH::EConstraintSpace::WorldSpace;
	s.mPoint1 = s.mPoint2 = point;
	s.mHingeAxis1 = s.mHingeAxis2 = JPH::Vec3::sAxisX();
	s.mNormalAxis1 = s.mNormalAxis2 = JPH::Vec3::sAxisZ();
	if (limit_deg > 0.0f) {
		// Curso do braço. Suspensão de verdade tem batente; sem ele o braço dá a
		// volta e a montagem perde o sentido.
		s.mLimitsMin = -JPH::DegreesToRadians(limit_deg);
		s.mLimitsMax = JPH::DegreesToRadians(limit_deg);
	}
	if (motor) {
		// (frequência, amortecimento, limite de força, limite de torque)
		s.mMotorSettings = JPH::MotorSettings(2.0f, 1.0f, 0.0f, motor_torque);
	}

	auto *c = static_cast<JPH::HingeConstraint *>(s.Create(a, b));
	sys.AddConstraint(c);
	return c;
}

} // namespace detail

/// Monta a plataforma articulada em `origin`. `filter` precisa ter ao menos 7
/// sub-grupos com todas as colisões internas desabilitadas.
inline RockerParts BuildRocker(JPH::PhysicsSystem &sys, JPH::BodyInterface &bi,
		JPH::GroupFilterTable *filter, JPH::RVec3Arg origin, const RockerParams &p) {
	using namespace JPH;

	RockerParts out;

	// A massa total tem que bater com a da plataforma de comparação, senão o
	// ensaio mistura mecanismo com inércia.
	const float chassis_mass = p.total_mass - 2 * p.arm_mass - 4 * p.wheel_mass;
	const float axle_z = p.AxleZ();

	int sub_group = 0;

	out.chassis = detail::MakeRockerBody(bi,
			new BoxShape(Vec3(p.half_width, p.half_height, p.half_length)),
			origin, Quat::sIdentity(), chassis_mass, p.friction, filter, sub_group++);

	RefConst<Shape> arm_shape = new BoxShape(Vec3(p.arm_half_w, p.arm_half_w, axle_z));
	RefConst<Shape> wheel_shape = new CylinderShape(0.5f * p.wheel_width, p.wheel_radius);

	for (int side = 0; side < 2; ++side) {
		const float sx = (side == 0) ? 1.0f : -1.0f;
		const float arm_x = sx * (p.half_width + p.arm_half_w);

		RVec3 arm_pos = origin + RVec3(Real(arm_x), Real(p.arm_y), Real(0));
		out.arms[side] = detail::MakeRockerBody(bi, arm_shape, arm_pos, Quat::sIdentity(),
				p.arm_mass, p.friction, filter, sub_group++);

		// O pivô fica na ALTURA DO CENTRO DE MASSA do chassi, não na altura do
		// braço. Com ele abaixo do CM, os dois pivôs coaxiais em X deixam o
		// chassi virar pêndulo invertido e a inclinação cresce sozinha — custou
		// 10° de inclinação fantasma na primeira versão do ensaio.
		RVec3 pivot = origin + RVec3(Real(arm_x), Real(0), Real(0));
		out.arm_hinges[side] = detail::MakeRockerHinge(sys, *out.chassis, *out.arms[side],
				pivot, /*motor=*/false, p.arm_limit_deg, 0.0f);

		for (int end = 0; end < 2; ++end) {
			const float z = (end == 0) ? axle_z : -axle_z;
			const int wi = side * 2 + end;

			RVec3 wheel_pos = origin + RVec3(Real(arm_x), Real(p.arm_y), Real(z));

			// O cilindro do Jolt nasce com o eixo em Y; deitar em X faz dele uma
			// roda que gira em torno do próprio eixo.
			Quat lay_down = Quat::sRotation(Vec3::sAxisZ(), 0.5f * JPH_PI);

			out.wheels[wi] = detail::MakeRockerBody(bi, wheel_shape, wheel_pos, lay_down,
					p.wheel_mass, p.friction, filter, sub_group++);

			out.wheel_hinges[wi] = detail::MakeRockerHinge(sys, *out.arms[side], *out.wheels[wi],
					wheel_pos, /*motor=*/true, 0.0f, p.motor_torque);
		}
	}

	return out;
}

/// Aciona as quatro rodas pelo EIXO, não por força no corpo.
/// `forward` e `turn` em [-1, 1]; `speed` é a velocidade-alvo em m/s.
inline void DriveRocker(RockerParts &parts, JPH::BodyInterface &bi, const RockerParams &p,
		float forward, float turn, float speed) {
	using namespace JPH;

	const bool moving = forward != 0.0f || turn != 0.0f;

	for (int i = 0; i < 4; ++i) {
		const bool left = i < 2;
		// Skid-steer: os dois lados giram a velocidades diferentes para curvar.
		// É como um rover de verdade esterça, já que não há direção nas rodas.
		const float side_scale = forward + (left ? turn : -turn);
		// v = ω·r, então ω = v/r.
		const float omega = side_scale * speed / p.wheel_radius;

		parts.wheel_hinges[i]->SetMotorState(moving ? EMotorState::Velocity : EMotorState::Off);
		parts.wheel_hinges[i]->SetTargetAngularVelocity(moving ? omega : 0.0f);
	}

	bi.ActivateBody(parts.chassis->GetID());
	for (int i = 0; i < 2; ++i) {
		bi.ActivateBody(parts.arms[i]->GetID());
	}
	for (int i = 0; i < 4; ++i) {
		bi.ActivateBody(parts.wheels[i]->GetID());
	}
}

/// Preenche um filtro de grupo desabilitando toda colisão interna da plataforma.
inline JPH::Ref<JPH::GroupFilterTable> MakeRockerGroupFilter(int num_sub_groups = 8) {
	JPH::Ref<JPH::GroupFilterTable> f = new JPH::GroupFilterTable(num_sub_groups);
	for (JPH::CollisionGroup::SubGroupID i = 0; i < (JPH::CollisionGroup::SubGroupID)num_sub_groups; ++i) {
		for (JPH::CollisionGroup::SubGroupID j = i + 1; j < (JPH::CollisionGroup::SubGroupID)num_sub_groups; ++j) {
			f->DisableCollision(i, j);
		}
	}
	return f;
}

} // namespace gdjolt

#endif // GDJOLT_ROCKER_RIG_H
