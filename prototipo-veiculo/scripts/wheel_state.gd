class_name WheelState
extends RefCounted

# O que a roda "sabe de si mesma" antes de consultar o solo.
var global_position: Vector3
var basis: Basis          # orientacao da roda (de onde tiramos forward/lateral)
var linear_velocity: Vector3
var angular_velocity: Vector3
var mass: float
var compressao_anterior: float = 0.0