INSERT INTO empleados (usuario_id, numero_empleado, puesto, activo, fecha_creacion) 
VALUES 
(26, 'EMP026', 'Dentista General', true, NOW()),
(27, 'EMP027', 'Recepcionista', true, NOW()),
(28, 'EMP028', 'Ortodoncista', true, NOW()),
(29, 'EMP029', 'Endodoncista', true, NOW()),
(30, 'EMP030', 'Asistente Dental', true, NOW())
ON CONFLICT (usuario_id) DO NOTHING;