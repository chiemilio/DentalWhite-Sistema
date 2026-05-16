-- Check payments and their associated appointments
SELECT p.id as payment_id, p.cita_id, p.monto_pagado, c.estado_cita_id, e.nombre as estado_cita, c.fecha_cita, c.hora
FROM pagos p
JOIN citas c ON p.cita_id = c.id
JOIN cat_estados_cita e ON c.estado_cita_id = e.id
ORDER BY c.fecha_cita DESC, c.hora DESC;