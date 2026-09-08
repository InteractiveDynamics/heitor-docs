extends SceneTree

# Verificação headless da etapa 4: prova que o mundo do Jolt avança DENTRO do
# loop de física do Godot, e que a telemetria que o vehicle_probe imprime no
# terminal também chega ao GDScript pela ponte.
#
#   godot --headless --path demo --script verify_vehicle.gd

var vehicle: Node3D = null
var steps := 0
var start_y := 0.0
var checks_failed := 0


func check(ok: bool, label: String) -> void:
	print(("  ok   " if ok else "  FALHA") + " · " + label)
	if not ok:
		checks_failed += 1


func _initialize() -> void:
	print("=== verificação do JoltVehicle ===")

	check(ClassDB.class_exists("JoltVehicle"), "a classe JoltVehicle está registrada")
	if not ClassDB.class_exists("JoltVehicle"):
		quit(1)
		return

	vehicle = ClassDB.instantiate("JoltVehicle")
	vehicle.read_input = false  # dirigimos por código, sem teclado
	vehicle.position = Vector3(0, 2, 0)
	root.add_child(vehicle)
	start_y = vehicle.position.y


func _physics_process(_delta: float) -> bool:
	steps += 1

	# Primeiro segundo com freio de mão: o veículo cai e assenta.
	# Depois, acelera — é aí que a transferência de peso aparece.
	if steps <= 60:
		vehicle.set_driver_input(0.0, 0.0, 0.0, 1.0)
	else:
		vehicle.set_driver_input(1.0, 0.0, 0.0, 0.0)

	if steps < 180:
		return false

	var y := vehicle.position.y
	print("  altura inicial %.3f → final %.3f" % [start_y, y])

	check(y < start_y, "o corpo caiu — o mundo do Jolt avança no loop do Godot")
	check(y > 0.3, "a suspensão segurou o corpo, não atravessou o chão")

	var contatos := 0
	var impulso_total := 0.0
	for i in range(4):
		if vehicle.has_wheel_contact(i):
			contatos += 1
		impulso_total += vehicle.get_suspension_impulse(i)
		print("  roda %d · susp %.4f · imp %.1f · contato %s" % [
			i,
			vehicle.get_suspension_length(i),
			vehicle.get_suspension_impulse(i),
			"sim" if vehicle.has_wheel_contact(i) else "NAO",
		])

	check(contatos == 4, "as quatro rodas acharam o chão pelo raycast")

	# Em regime, o impulso de suspensão somado tem que sustentar o peso:
	# m * g * dt. É o mesmo número que o vehicle_probe mostra no terminal.
	var esperado: float = vehicle.vehicle_mass * 9.81 / 60.0
	var erro: float = abs(impulso_total - esperado) / esperado
	print("  impulso somado %.1f vs m*g*dt %.1f (erro %.1f%%)" % [
		impulso_total, esperado, erro * 100.0,
	])
	check(erro < 0.15, "o impulso de suspensão sustenta o peso do veículo")

	print("=== %d verificação(ões) falharam ===" % checks_failed)
	quit(1 if checks_failed > 0 else 0)
	return true
