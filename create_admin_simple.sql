-- Create admin user
INSERT INTO usuarios (email, password_hash, nombre, apellido_paterno, nacionalidad_id, telefono_principal, rol_id, activo)
VALUES (
    'admin@dentalwhite.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.bpMcXVTQhPOlKy',
    'Administrador',
    'Sistema',
    1,
    '4771234567',
    1,
    true
);

-- Get the admin user id and create employee
INSERT INTO empleados (usuario_id, sucursal_id, numero_empleado, puesto, activo)
SELECT id, 1, 'EMP001', 'Administrador General', true
FROM usuarios WHERE email = 'admin@dentalwhite.com'
ON CONFLICT (usuario_id) DO NOTHING;

SELECT 'Admin created' as result;
SELECT id, email, nombre FROM usuarios;