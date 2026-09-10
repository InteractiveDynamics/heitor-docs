#include "register_types.h"

#include "jolt_probe.h"
#include "jolt_rocker.h"
#include "jolt_vehicle.h"

#include <gdextension_interface.h>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/core/defs.hpp>
#include <godot_cpp/godot.hpp>

using namespace godot;

void initialize_gdjolt_module(ModuleInitializationLevel p_level) {
	if (p_level != MODULE_INITIALIZATION_LEVEL_SCENE) {
		return;
	}

	GDREGISTER_CLASS(gdjolt::JoltProbe);
	GDREGISTER_CLASS(gdjolt::JoltVehicle);
	GDREGISTER_CLASS(gdjolt::JoltRocker);
}

void uninitialize_gdjolt_module(ModuleInitializationLevel p_level) {
	if (p_level != MODULE_INITIALIZATION_LEVEL_SCENE) {
		return;
	}
}

extern "C" {
// Ponto de entrada declarado no arquivo .gdextension: é por aqui que o Godot
// encontra a biblioteca. O nome tem que bater com `entry_symbol` lá.
GDExtensionBool GDE_EXPORT gdjolt_library_init(
		GDExtensionInterfaceGetProcAddress p_get_proc_address,
		const GDExtensionClassLibraryPtr p_library,
		GDExtensionInitialization *r_initialization) {
	GDExtensionBinding::InitObject init_obj(p_get_proc_address, p_library, r_initialization);

	init_obj.register_initializer(initialize_gdjolt_module);
	init_obj.register_terminator(uninitialize_gdjolt_module);
	init_obj.set_minimum_library_initialization_level(MODULE_INITIALIZATION_LEVEL_SCENE);

	return init_obj.init();
}
}
