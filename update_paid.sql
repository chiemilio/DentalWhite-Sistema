-- Update appointments with full payment to "Completada" (estado 4)
UPDATE citas c
SET estado_cita_id = 4
FROM pagos p
WHERE c.id = p.cita_id 
AND p.monto_pagado >= p.monto_total;

-- Verify the change
SELECT c.id, c.fecha_cita, c.hora, c.estado_cita_id, e.nombre as estado
FROM citas c
JOIN cat_estados_cita e ON c.estado_cita_id = e.id
WHERE c.fecha_cita = '2026-05-11'
ORDER BY c.hora;