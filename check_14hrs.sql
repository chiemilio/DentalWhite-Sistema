SELECT c.id, c.fecha_cita, c.hora, c.paciente_id, c.estado_cita_id, e.nombre as estado, p.monto_total, p.monto_pagado
FROM citas c
JOIN cat_estados_cita e ON c.estado_cita_id = e.id
LEFT JOIN pagos p ON c.id = p.cita_id
WHERE c.fecha_cita = '2026-05-11'
ORDER BY c.hora;