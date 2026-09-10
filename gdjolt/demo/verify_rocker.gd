extends SceneTree

# Verificação headless da plataforma articulada.
# Confere que os sete corpos e as seis juntas funcionam dentro do loop do Godot,
# e reproduz o número que o banco de ensaio mede no terminal: o chassi passa o
# degrau praticamente sem inclinar.
#
#   godot --headless --path demo --script verify_rocker.gd

var rocker: Node3D = null
var steps := 0
var max_tilt := 0.0
var tilt_at_step := 0.0
var start_y := 0.0
var checks_failed := 0


func check(ok: bool, label: String) -> void:
	print(("  ok   " if ok else "  FALHA") + " · " + label)
	if not ok:
		checks_failed += 1


func _initialize() -> void:
	print("=== verificação do JoltRocker ===")

	check(ClassDB.class_exists("JoltRocker"), "a classe JoltRocker está registrada")
	if not ClassDB.class_exists("JoltRocker"):
		quit(1)
		return

	rocker = ClassDB.instantiate("JoltRocker")
	rocker.read_input = false
	rocker.substeps = 4
	rocker.step_height = 0.2
	rocker.position = Vector3(0, 0.75, 0)
	root.add_child(rocker)
	start_y = 0.75

	# Os filhos são os fantoches: o nó escreve a transform de cada peça neles.
	# Criá-los aqui também testa o push_transforms.
	for n in ["Chassis", "Arm0", "Arm1", "Wheel0", "Wheel1", "Wheel2", "Wheel3"]:
		var marker := Node3D.new()
		marker.name = n
		rocker.add_child(marker)


func _physics_process(_delta: float) -> bool:
	steps += 1

	# 1 s parado para assentar, depois acelera — a mesma manobra do terminal.
	if steps <= 60:
		rocker.set_driver_input(0.0, 0.0)
	else:
		rocker.set_driver_input(1.0, 0.0)
		var t: float = rocker.get_chassis_tilt()
		max_tilt = max(max_tilt, t)
		var z: float = rocker.get_node("Chassis").global_position.z if rocker.has_node("Chassis") else 0.0
		if abs(z - 6.0) < 0.5:
			tilt_at_step = max(tilt_at_step, t)

	if steps < 420:
		return false

	print("  inclinação máxima  %.2f°" % max_tilt)
	print("  braço esq %.2f° · braço dir %.2f°" % [
		rocker.get_arm_angle(0), rocker.get_arm_angle(1),
	])

	check(max_tilt < 3.0, "o chassi atravessa o degrau praticamente nivelado (< 3°)")
	check(abs(rocker.get_arm_angle(0)) < 31.0, "o braço esquerdo respeita o curso de 30°")
	check(abs(rocker.get_arm_angle(1)) < 31.0, "o braço direito respeita o curso de 30°")

	var moved := false
	if rocker.has_node("Chassis"):
		moved = rocker.get_node("Chassis").global_position.z > 2.0
		print("  z final do chassi  %.2f" % rocker.get_node("Chassis").global_position.z)
	check(moved, "a plataforma andou — os motores nos eixos movem o conjunto")

	print("=== %d verificação(ões) falharam ===" % checks_failed)
	quit(1 if checks_failed > 0 else 0)
	return true
