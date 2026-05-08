-- Fix admin user with correct CURP length
UPDATE usuarios SET curp = 'SIBA850101HNENSLS0' WHERE email = 'admin@dentalwhite.com';

-- Create admin employee
INSERT INTO empleados (usuario_id, sucursal_id, numero_empleado, cedula_profesional, fecha_contratacion, puesto, activo)
VALUES (
    (SELECT id FROM usuarios WHERE email = 'admin@dentalwhite.com'),
    1,
    'EMP001',
    'CEDULA12345',
    CURRENT_DATE,
    'Administrador General',
    true
) ON CONFLICT (usuario_id) DO NOTHING;

-- Create some sample patients
INSERT INTO pacientes (usuario_id, tipo_paciente_id, sucursal_id, fecha_nacimiento, direccion, ciudad)
VALUES 
    ((SELECT id FROM usuarios WHERE email = 'admin@dentalwhite.com'), 1, 1, '1990-01-15', 'Calle Principal 123, Pénjamo', 'Pénjamo')
ON CONFLICT (usuario_id) DO NOTHING;

SELECT 'Admin and employee created' as result;