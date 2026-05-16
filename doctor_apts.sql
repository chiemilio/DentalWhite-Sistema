SELECT c.id, c.fecha_cita, c.hora, c.empleado_id, c.estado_cita_id, e.nombre as estado
FROM citas c
JOIN cat_estados_cita e ON c.estado_cita_id = e.id
WHERE c.empleado_id = 1
ORDER BY c.fecha_cita DESC, c.hora DESC
LIMIT 30;