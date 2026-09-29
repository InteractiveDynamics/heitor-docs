extends Node3D

# As três montagens lado a lado, contra o mesmo degrau: a VehicleConstraint (um
# corpo só), o rocker de quatro rodas e o rocker-bogie de seis. Cada uma roda no
# seu próprio PhysicsSystem; o que elas têm em comum é a manobra — 1 s parado
# para assentar e depois 1,5 m/s em reta, igual ao banco de ensaio.
#
# Teclas:  espaço  parte / pausa
#          R       recomeça
#          + / -   degrau 5 cm mais alto / mais baixo (recomeça)
#          C       troca a câmera (geral · lateral de cada montagem)
#
# Linha de comando (depois de "--"):
#   --step=0.40   altura do degrau
#   --cam=2       câmera inicial
#   --auto        parte sozinho e fecha depois de --secs segundos (para gravar)
#   --secs=12
#
#   --record=DIR  grava cada quadro em DIR/00000.png, a 1280×720 (implica --auto)
#
#   godot --path demo comparativo.tscn -- --step=0.40 --auto
#   godot --path demo --fixed-fps 60 comparativo.tscn -- --step=0.40 --record=/tmp/q
#   ffmpeg -framerate 60 -i /tmp/q/%05d.png -pix_fmt yuv420p video.mp4
#
# Por que não o --write-movie do Godot: com o gerenciador de janelas em mosaico
# a janela nasce do tamanho que o mosaico quiser, e o Movie Maker perdeu o HUD.
# Gravar de um SubViewport de tamanho fixo não depende da janela. O --fixed-fps
# desliga o relógio real, então cada quadro é exatamente um passo de física.

const TARGET_SPEED := 1.5
const SETTLE := 1.0
# A laje começa em z = 6 e termina em z = 14. A inclinação só conta enquanto a
# plataforma está subindo, como no banco de ensaio.
const OBSTACLE_Z := 6.0
const CROSSED_Z := OBSTACLE_Z + 1.4 + 0.3 # roda traseira passou da face

var step_height := 0.40
var auto := false
var secs := 12.0
var cam_mode := 0
var record_dir := ""
var frame := 0

var t := 0.0
var going := false
var lanes: Array[Dictionary] = []

@onready var hud: Label = $Overlay/Hud
@onready var camera: Camera3D = $Camera3D


func _enter_tree() -> void:
	# O degrau precisa estar decidido ANTES do _ready dos filhos, que é quando
	# cada nó monta o seu mundo do Jolt. _enter_tree desce da raiz para as
	# folhas, então aqui ainda dá tempo.
	for arg in OS.get_cmdline_user_args():
		if arg.begins_with("--step="):
			step_height = float(arg.substr(7))
		elif arg.begins_with("--cam="):
			cam_mode = int(arg.substr(6))
		elif arg.begins_with("--secs="):
			secs = float(arg.substr(7))
		elif arg == "--auto":
			auto = true
		elif arg.begins_with("--record="):
			record_dir = arg.substr(9)
			auto = true
	# O +/- recomeça a cena com outro degrau; ele vence a linha de comando.
	if Engine.has_meta("comparativo_step"):
		step_height = Engine.get_meta("comparativo_step")

	for path in ["Lumped", "Rocker", "Bogie"]:
		var n: Node3D = get_node(path)
		n.read_input = false
		n.step_height = step_height

	var step: MeshInstance3D = get_node("Step")
	var mesh := BoxMesh.new()
	mesh.size = Vector3(18, max(step_height, 0.001), 8)
	step.mesh = mesh
	step.position = Vector3(0, 0.5 * step_height, 10)
	step.visible = step_height > 0.0


func _ready() -> void:
	lanes = [
		{ "name": "laranja · lumped · 1 corpo", "node": $Lumped },
		{ "name": "âmbar · rocker · 7 corpos", "node": $Rocker },
		{ "name": "ciano · bogie · 11 corpos", "node": $Bogie },
	]
	for i in lanes.size():
		lanes[i]["max_tilt"] = 0.0
		lanes[i]["crossed_at"] = -1.0
		# Cada montagem numa camada visual própria. A câmera lateral enxerga só
		# a da vez: a pista do meio fica atrás de uma das outras de qualquer lado
		# que se olhe.
		for mesh in (lanes[i]["node"] as Node).find_children("*", "MeshInstance3D", true, false):
			(mesh as MeshInstance3D).layers = 1 << (i + 1)
	going = auto
	if record_dir != "":
		_setup_recording()
	_place_camera()


func _setup_recording() -> void:
	# O mesmo World3D, visto por um viewport de tamanho fixo. Câmera e HUD
	# mudam para dentro dele; a janela continua mostrando o que sobrar.
	var sv := SubViewport.new()
	sv.size = Vector2i(1280, 720)
	sv.world_3d = get_viewport().world_3d
	sv.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	add_child(sv)
	camera.reparent(sv, false)
	camera.current = true
	$Overlay.reparent(sv, false)
	DirAccess.make_dir_recursive_absolute(record_dir)
	RenderingServer.frame_post_draw.connect(func() -> void:
		sv.get_texture().get_image().save_png("%s/%05d.png" % [record_dir, frame])
		frame += 1)


func _unhandled_input(event: InputEvent) -> void:
	if not (event is InputEventKey and event.pressed and not event.echo):
		return
	# Gravando, o teclado não manda em nada: a janela aparece na frente e rouba
	# o foco, e um espaço digitado em outro lugar pausava a gravação.
	if record_dir != "":
		return
	match event.keycode:
		KEY_SPACE:
			going = not going
		KEY_R:
			_restart(step_height)
		KEY_EQUAL, KEY_PLUS, KEY_KP_ADD:
			_restart(step_height + 0.05)
		KEY_MINUS, KEY_KP_SUBTRACT:
			_restart(max(0.0, step_height - 0.05))
		KEY_C:
			cam_mode = (cam_mode + 1) % 4
			_place_camera()


func _restart(h: float) -> void:
	Engine.set_meta("comparativo_step", snappedf(h, 0.01))
	get_tree().reload_current_scene()


func _chassis_z(lane: Dictionary) -> float:
	var n: Node3D = lane["node"]
	return n.global_position.z if n.is_class("JoltVehicle") else n.get_chassis_z()


func _physics_process(delta: float) -> void:
	if going:
		t += delta
	var drive := going and t > SETTLE

	# Lumped: acelerador proporcional, a mesma lei do banco de ensaio. O motor do
	# WheeledVehicleController sairia a 19 m/s com o pé embaixo.
	var lumped: Node3D = $Lumped
	if drive:
		var err: float = TARGET_SPEED - lumped.get_forward_speed()
		var brake: float = min(1.0, -err - 0.5) if err < -0.5 else 0.0
		lumped.set_driver_input(clamp(err, 0.0, 1.0), 0.0, brake, 0.0)
	else:
		lumped.set_driver_input(0.0, 0.0, 0.0, 1.0)

	# Articuladas: motor no eixo com velocidade-alvo, de novo como no ensaio.
	for n in [$Rocker, $Bogie]:
		n.target_speed = TARGET_SPEED
		n.set_driver_input(1.0 if drive else 0.0, 0.0)

	for lane in lanes:
		var z := _chassis_z(lane)
		if drive and z < OBSTACLE_Z + 6.0:
			lane["max_tilt"] = max(lane["max_tilt"], lane["node"].get_chassis_tilt())
		if drive and lane["crossed_at"] < 0.0 and z > CROSSED_Z:
			lane["crossed_at"] = t - SETTLE

	_update_hud()
	if cam_mode > 0:
		_place_camera()

	if auto and t > secs:
		# O placar final vai para o terminal também: é o que confere a cena
		# contra o banco de ensaio sem precisar olhar o vídeo.
		print(hud.text)
		get_tree().quit()


func _update_hud() -> void:
	var lines := PackedStringArray()
	lines.append("degrau %.2f m · roda de raio 0,30 m · 1,5 m/s · t = %.1f s" % [step_height, max(0.0, t - SETTLE)])
	lines.append("")
	for lane in lanes:
		var status := "subindo…"
		if lane["crossed_at"] >= 0.0:
			status = "passou em %.1f s" % lane["crossed_at"]
		elif t - SETTLE > 9.0:
			status = "não passou"
		lines.append("%-26s  incl. %5.2f°  (máx %5.2f°)  %s" % [
			lane["name"], lane["node"].get_chassis_tilt(), lane["max_tilt"], status,
		])
	if not auto:
		lines.append("")
		lines.append("espaço parte · R recomeça · +/- degrau · C câmera")
	hud.text = "\n".join(lines)


func _place_camera() -> void:
	if cam_mode == 0 or lanes.is_empty():
		# Vista geral de três quartos: as três pistas e a face do degrau.
		camera.cull_mask = 0xFFFFF
		camera.look_at_from_position(Vector3(10, 4.5, -1), Vector3(-1, 0, 7))
		return
	# Vista lateral acompanhando uma montagem: é onde a inclinação do chassi
	# aparece de verdade.
	camera.cull_mask = 1 | (1 << cam_mode)
	var lane: Dictionary = lanes[cam_mode - 1]
	var x: float = (lane["node"] as Node3D).global_position.x
	var z := _chassis_z(lane)
	camera.look_at_from_position(Vector3(x + 9, 1.6, z), Vector3(x, 0.4, z))
