-- Create admin user with proper bcrypt hash
-- Hash was generated: admin123 -> $2b$12$...

INSERT INTO usuarios (email, password_hash, nombre, apellido_paterno, curp, nacionalidad_id, telefono_principal, rol_id, activo)
VALUES (
    'admin@dentalwhite.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.bpMcXVTQhPOlKy',
    'Administrador',
    'Sistema',
    'SIBA850101HNENSLS09',
    1,
    '4771234567',
    1,
    true
) ON CONFLICT (email) DO UPDATE SET nombre = 'Administrador';

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

SELECT 'Admin user created' as result;