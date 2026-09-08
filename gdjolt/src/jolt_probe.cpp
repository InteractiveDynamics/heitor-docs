#include "jolt_probe.h"

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

using namespace godot;

namespace gdjolt {

JoltProbe::JoltProbe() {}

JoltProbe::~JoltProbe() {}

void JoltProbe::_ready() {
	// Roda no editor também; sem esta guarda o log polui a saída do editor.
	if (Engine::get_singleton()->is_editor_hint()) {
		return;
	}
	UtilityFunctions::print(String::utf8("[JoltProbe] pronto — a ponte C++ está viva."));
}

void JoltProbe::_physics_process(double delta) {
	if (Engine::get_singleton()->is_editor_hint()) {
		return;
	}

	steps += 1;
	elapsed += delta;

	if (report_every > 0 && steps % report_every == 0) {
		UtilityFunctions::print(
				String::utf8("[JoltProbe] passo "), steps,
				String::utf8(" · delta "), delta,
				String::utf8(" · tempo "), elapsed);
	}
}

void JoltProbe::set_report_every(int p_frames) {
	report_every = p_frames < 0 ? 0 : p_frames;
}

int JoltProbe::get_report_every() const {
	return report_every;
}

int JoltProbe::get_steps() const {
	return steps;
}

double JoltProbe::get_elapsed() const {
	return elapsed;
}

void JoltProbe::_bind_methods() {
	ClassDB::bind_method(D_METHOD("set_report_every", "frames"), &JoltProbe::set_report_every);
	ClassDB::bind_method(D_METHOD("get_report_every"), &JoltProbe::get_report_every);
	ADD_PROPERTY(
			PropertyInfo(Variant::INT, "report_every", PROPERTY_HINT_RANGE, "0,600,1"),
			"set_report_every", "get_report_every");

	ClassDB::bind_method(D_METHOD("get_steps"), &JoltProbe::get_steps);
	ClassDB::bind_method(D_METHOD("get_elapsed"), &JoltProbe::get_elapsed);
}

} // namespace gdjolt
