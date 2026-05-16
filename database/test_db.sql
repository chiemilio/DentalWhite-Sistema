-- ============================================
-- Test: Verificar estructura de tablas
-- ============================================

-- 1. Tabla usuarios
SELECT 'usuarios' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- 2. Tabla pacientes
SELECT 'pacientes' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pacientes'
ORDER BY ordinal_position;

-- 3. Tabla empleados
SELECT 'empleados' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'empleados'
ORDER BY ordinal_position;

-- 4. Tabla citas
SELECT 'citas' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'citas'
ORDER BY ordinal_position;

-- 5. Tabla consultas
SELECT 'consultas' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'consultas'
ORDER BY ordinal_position;

-- 6. Tabla recetas
SELECT 'recetas' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'recetas'
ORDER BY ordinal_position;

-- ============================================
-- Test: Verificar datos existentes
-- ============================================

-- Usuarios
SELECT id, nombre, email, rol_id FROM usuarios LIMIT 5;

-- Pacientes
SELECT id, usuario_id, numero_expediente, fecha_nacimiento, sexo, ocupacion FROM pacientes LIMIT 5;

-- Empleados
SELECT id, usuario_id, puesto, especialidad_principal FROM empleados LIMIT 5;

-- Citas
SELECT id, paciente_id, empleado_id, fecha, hora, estado_cita_id FROM citas LIMIT 5;

-- Estados de cita
SELECT * FROM cat_estados_cita;

-- Servicios
SELECT * FROM cat_servicios;
