class_name ContactResult
extends RefCounted

# O que o solo "responde" para uma roda.
var in_contact: bool = false
var point: Vector3 = Vector3.ZERO
var normal: Vector3 = Vector3.UP
var sinkage: float = 0.0   # v0: terreno rigido, sempre 0. ExoPhysics preenche isso depois.
var force: Vector3 = Vector3.ZERO
var compressao: float = 0.0  # para o chamador guardar como "anterior" no proximo frame