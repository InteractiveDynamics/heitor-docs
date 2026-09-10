#ifndef GDJOLT_JOLT_RUNTIME_H
#define GDJOLT_JOLT_RUNTIME_H

// RegisterTypes/Factory são globais do Jolt: valem para o processo inteiro, não
// para um nó. Com mais de um nó de física na cena — um JoltVehicle e um
// JoltRocker, por exemplo — registrar duas vezes quebra.
//
// A contagem mora aqui, num inline compartilhado, porque uma cópia por arquivo
// .cpp daria a cada um o seu próprio contador e o problema voltaria em silêncio.

#include <Jolt/Jolt.h>

#include <Jolt/Core/Factory.h>
#include <Jolt/RegisterTypes.h>

namespace gdjolt {

inline int &JoltUserCount() {
	static int count = 0;
	return count;
}

inline void JoltAcquire() {
	if (JoltUserCount()++ > 0) {
		return;
	}
	JPH::RegisterDefaultAllocator();
	JPH::Factory::sInstance = new JPH::Factory();
	JPH::RegisterTypes();
}

inline void JoltRelease() {
	if (--JoltUserCount() > 0) {
		return;
	}
	JPH::UnregisterTypes();
	delete JPH::Factory::sInstance;
	JPH::Factory::sInstance = nullptr;
}

} // namespace gdjolt

#endif // GDJOLT_JOLT_RUNTIME_H
