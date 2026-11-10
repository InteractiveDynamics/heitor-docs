extends SceneTree

# Verificação headless do carro com rodas de verdade.
# Confere que os cinco corpos e as quatro juntas com mola funcionam dentro do
# loop do Godot, e reproduz o que o banco de ensaio mede no terminal: a mola
# parada afunda o que a conta da frequência manda, e o carro sobe o degrau.
#
#   godot --headless --path demo --script verify_car.gd

# g/ω² com 1,5 Hz — o mesmo número que o vehicle_probe imprime como "afunda".
const EXPECTED_SAG := 0.110
const TRAVEL := 0.2

var car: Node3D = null
var steps := 0
var sag_at_rest := 0.0
var max_tilt := 0.0
var max_comp := 0.0
var min_comp := 1.0
var checks_failed := 0


func check(ok: bool, label: String) -> void:
	print(("  ok   " if ok else "  FALHA") + " · " + label)
	if not ok:
		checks_failed += 1


func _initialize() -> void:
	print("=== verificação do JoltCar ===")

	check(ClassDB.class_exists("JoltCar"), "a classe JoltCar está registrada")
	if not ClassDB.class_exists("JoltCar"):
		quit(1)
		return

	car = ClassDB.instantiate("JoltCar")
	car.read_input = false
	car.max_steer_deg = 0.0 # como no banco de ensaio
	car.substeps = 4
	car.step_height = 0.2
	car.position = Vector3(0, 0.75, 0)
	root.add_child(car)

	for n in ["Chassis", "Wheel0", "Wheel1", "Wheel2", "Wheel3"]:
		var marker := Node3D.new()
		marker.name = n
		car.add_child(marker)


func _physics_process(_delta: float) -> bool:
	steps += 1

	# 1 s parado para assentar, depois acelera — a mesma manobra do terminal.
	if steps <= 60:
		car.set_driver_input(0.0, 0.0)
		if steps == 60:
			for i in 4:
				sag_at_rest += car.get_compression(i) / 4.0
	else:
		car.set_driver_input(1.0, 0.0)
		if car.get_chassis_z() < 12.0:
			max_tilt = max(max_tilt, car.get_chassis_tilt())
	for i in 4:
		max_comp = max(max_comp, car.get_compression(i))
		min_comp = min(min_comp, car.get_compression(i))

	if steps < 420:
		return false

	print("  afundamento parado %.3f m (conta: %.3f m)" % [sag_at_rest, EXPECTED_SAG])
	print("  curso usado        %.3f a %.3f m" % [min_comp, max_comp])
	print("  inclinação máxima  %.2f°" % max_tilt)
	print("  z final do chassi  %.2f" % car.get_chassis_z())

	check(abs(sag_at_rest - EXPECTED_SAG) < 0.01, "a mola parada afunda o que a frequência manda (±1 cm)")
	check(min_comp > -0.01 and max_comp < TRAVEL + 0.01, "a roda fica dentro do curso de 0,2 m")
	check(max_tilt < 7.0, "o chassi inclina o que o degrau impõe, sem capotar (< 7°)")
	check(car.get_chassis_z() > 1.4 + 6.0 + 0.3, "o carro subiu — a roda traseira passou da face do degrau")

	print("=== %d verificação(ões) falharam ===" % checks_failed)
	quit(1 if checks_failed > 0 else 0)
	return true
