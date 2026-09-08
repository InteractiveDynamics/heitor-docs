extends SceneTree

# Verificação sem interface gráfica: confirma que a extensão carregou, que a
# classe foi registrada, que a propriedade chegou no ClassDB e que o
# _physics_process em C++ é mesmo chamado pelo loop do Godot.
#
#   godot --headless --path demo --script verify.gd

var probe: Node = null
var checks_failed := 0


func check(ok: bool, label: String) -> void:
	print(("  ok   " if ok else "  FALHA") + " · " + label)
	if not ok:
		checks_failed += 1


func _initialize() -> void:
	print("=== verificação da ponte gdjolt ===")

	check(ClassDB.class_exists("JoltProbe"), "a classe JoltProbe está registrada")
	if not ClassDB.class_exists("JoltProbe"):
		print("A extensão não carregou. Nada mais faz sentido conferir.")
		quit(1)
		return

	check(ClassDB.get_parent_class("JoltProbe") == "Node3D", "herda de Node3D")

	var props := ClassDB.class_get_property_list("JoltProbe", true)
	var names: Array = []
	for p in props:
		names.append(p["name"])
	check(names.has("report_every"), "a propriedade report_every está exposta")

	probe = ClassDB.instantiate("JoltProbe")
	check(probe != null, "instancia sem erro")

	probe.report_every = 5
	check(probe.report_every == 5, "a propriedade lê e escreve pelo GDScript")

	root.add_child(probe)


func _physics_process(_delta: float) -> bool:
	# Deixa alguns passos correrem e checa se o C++ contou todos eles.
	if probe != null and probe.get_steps() >= 10:
		check(probe.get_steps() >= 10, "_physics_process em C++ roda no loop do Godot")
		check(probe.get_elapsed() > 0.0, "o tempo acumulado avança")

		print("=== %d verificação(ões) falharam ===" % checks_failed)
		quit(1 if checks_failed > 0 else 0)
		return true
	return false
