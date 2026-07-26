extends RigidBody3D

@onready var rays = [$RayFL, $RayFR, $RayBL, $RayBR]

@export var rigidez_mola: float = 80.0
@export var amortecimento: float = 8.0
@export var coef_atrito: float = 1.2
@export var forca_motor: float = 25.0
@export var angulo_max_esterco: float = 25.0
@export var debug_ativo: bool = false

var compressao_anterior: Array[float] = [0.0, 0.0, 0.0, 0.0]
var rodas_dianteiras = [0, 1]

func _physics_process(delta):
	var input_acelerar = Input.get_axis("ui_down", "ui_up")
	var input_esterco = Input.get_axis("ui_left", "ui_right")

	var params = {
		"rigidez_mola": rigidez_mola,
		"amortecimento": amortecimento,
		"coef_atrito": coef_atrito,
		"forca_motor": forca_motor,
	}

	for i in rays.size():
		var ray = rays[i]

		if i in rodas_dianteiras:
			ray.rotation.y = deg_to_rad(-input_esterco * angulo_max_esterco)

		var state = WheelState.new()
		state.global_position = global_position
		state.basis = global_transform.basis
		state.linear_velocity = linear_velocity
		state.angular_velocity = angular_velocity
		state.mass = mass
		state.compressao_anterior = compressao_anterior[i]

		var contato = GroundContact.query_wheel_contact(ray, state, input_acelerar, params, delta)

		if not contato.in_contact:
			compressao_anterior[i] = 0.0
			continue

		compressao_anterior[i] = contato.compressao
		var braco = contato.point - global_position
		apply_force(contato.force, braco)

		if debug_ativo:
			print(ray.name, " sinkage=", contato.sinkage, " forca=", "%.1f" % contato.force.length())
