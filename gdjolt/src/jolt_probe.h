#ifndef GDJOLT_JOLT_PROBE_H
#define GDJOLT_JOLT_PROBE_H

#include <godot_cpp/classes/node3d.hpp>

namespace gdjolt {

// Nó mínimo, sem física nenhuma. Existe só pra provar que a ponte funciona:
// que o Godot carrega a extensão, registra a classe, mostra a propriedade no
// Inspector e chama o nosso C++ a cada passo de física.
class JoltProbe : public godot::Node3D {
	GDCLASS(JoltProbe, godot::Node3D)

public:
	JoltProbe();
	~JoltProbe() override;

	void _ready() override;
	void _physics_process(double delta) override;

	void set_report_every(int p_frames);
	int get_report_every() const;

	int get_steps() const;
	double get_elapsed() const;

protected:
	static void _bind_methods();

private:
	// De quantos em quantos passos imprimir. 0 desliga o log.
	int report_every = 60;

	int steps = 0;
	double elapsed = 0.0;
};

} // namespace gdjolt

#endif // GDJOLT_JOLT_PROBE_H
