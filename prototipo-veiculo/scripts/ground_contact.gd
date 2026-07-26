class_name GroundContact
extends RefCounted

# Unica funcao que sabe calcular contato roda-solo.
# v0: implementada via raycast + mola-amortecedor + atrito com circulo de atrito.
# v1 (futuro): mesma assinatura, miolo trocado pela ExoPhysics.
static func query_wheel_contact(
	ray: RayCast3D,
	state: WheelState,
	input_acelerar: float,
	params: Dictionary,
	delta: float
) -> ContactResult:

	var result = ContactResult.new()

	if not ray.is_colliding():
		return result  # in_contact fica false, force fica zero

	var alcance_maximo = ray.target_position.length()
	var ponto_contato = ray.get_collision_point()
	var normal = ray.get_collision_normal()

	var distancia_atual = ray.global_position.distance_to(ponto_contato)
	var compressao = 1.0 - clamp(distancia_atual / alcance_maximo, 0.0, 1.0)
	var velocidade_compressao = (compressao - state.compressao_anterior) / delta

	var forca_mola = compressao * params.rigidez_mola
	var forca_amortecedor = velocidade_compressao * params.amortecimento
	var forca_suspensao = normal * (forca_mola + forca_amortecedor)

	var forward = -ray.global_transform.basis.z
	forward = (forward - normal * forward.dot(normal)).normalized()
	var lateral = forward.cross(normal).normalized()

	var braco = ponto_contato - state.global_position
	var vel_no_ponto = state.linear_velocity + state.angular_velocity.cross(braco)

	var carga_normal = forca_mola + forca_amortecedor
	var limite_atrito = carga_normal * params.coef_atrito

	var vel_lateral_escalar = vel_no_ponto.dot(lateral)
	var forca_grip_ideal = -vel_lateral_escalar * state.mass / delta
	var forca_grip_mag = clamp(forca_grip_ideal, -limite_atrito, limite_atrito)
	var forca_grip = lateral * forca_grip_mag

	var forca_tracao_mag = clamp(input_acelerar * params.forca_motor, -limite_atrito, limite_atrito)
	var forca_tracao = forward * forca_tracao_mag

	result.in_contact = true
	result.point = ponto_contato
	result.normal = normal
	result.sinkage = 0.0  # terreno rigido na v0
	result.force = forca_suspensao + forca_grip + forca_tracao
	result.compressao = compressao

	return result