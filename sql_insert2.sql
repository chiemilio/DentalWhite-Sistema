-- Check current max id
SELECT MAX(id) FROM empleados;

-- Insert employees for new users (IDs start from 5)
INSERT INTO empleados (id, usuario_id, numero_empleado, puesto, activo, fecha_creacion) 
VALUES 
(5, 26, 'EMP026', 'Dentista General', true, NOW()),
(6, 27, 'EMP027', 'Recepcionista', true, NOW()),
(7, 28, 'EMP028', 'Ortodoncista', true, NOW()),
(8, 29, 'EMP029', 'Endodoncista', true, NOW()),
(9, 30, 'EMP030', 'Asistente Dental', true, NOW())
ON CONFLICT (id) DO NOTHING;