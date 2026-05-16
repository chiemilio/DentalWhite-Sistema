-- ============================================
-- Migración de campos nuevos para Dental White
-- Agrega campos faltantes a las tablas existentes
-- ============================================

-- ============================================
-- USUARIOS: agregar last_login
-- ============================================
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- ============================================
-- PACIENTES: agregar sexo, ocupacion, firma_digitalizada
-- ============================================
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS sexo VARCHAR(15);
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS ocupacion VARCHAR(100);
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS firma_digitalizada TEXT;

-- ============================================
-- EMPLEADOS: agregar especialidad_principal, biografia_resumen, foto_perfil_url
-- ============================================
ALTER TABLE empleados ADD COLUMN IF NOT EXISTS especialidad_principal VARCHAR(100);
ALTER TABLE empleados ADD COLUMN IF NOT EXISTS biografia_resumen TEXT;
ALTER TABLE empleados ADD COLUMN IF NOT EXISTS foto_perfil_url TEXT;

-- ============================================
-- CITAS: agregar aliases fecha_cita, hora_cita
-- ============================================
ALTER TABLE citas ADD COLUMN IF NOT EXISTS fecha_cita DATE;
ALTER TABLE citas ADD COLUMN IF NOT EXISTS hora_cita TIME;

-- ============================================
-- CONSULTA: asegurar campos de signos vitales
-- ============================================
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS peso DECIMAL(5,2);
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS talla DECIMAL(5,2);
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS temperatura DECIMAL(4,2);
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS presion_sistolica INTEGER;
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS presion_diastolica INTEGER;
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS pulso INTEGER;
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS glucosa DECIMAL(5,2);

-- ============================================
-- RECETAS: asegurar campos de signos vitales
-- ============================================
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS peso DECIMAL(5,2);
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS presion VARCHAR(20);
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS pulso INTEGER;
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS glucosa DECIMAL(5,2);

-- ============================================
-- Mensaje de confirmación
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Migración de campos nuevos completada correctamente';
END $$;
