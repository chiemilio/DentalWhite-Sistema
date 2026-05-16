-- Update all appointments with NULL fecha_cita to today's date
UPDATE citas SET fecha_cita = CURRENT_DATE WHERE fecha_cita IS NULL;

-- Verify
SELECT c.id, c.fecha_cita, c.hora, c.paciente_id, c.estado_cita_id, e.nombre as estado
FROM citas c
JOIN cat_estados_cita e ON c.estado_cita_id = e.id
WHERE c.fecha_cita = CURRENT_DATE
ORDER BY c.hora;