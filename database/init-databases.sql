-- ============================================
-- DENTAL WHITE - Inicialización de Bases de Datos
-- Arquitectura de Microservicios
-- ============================================

-- Crear bases de datos para cada microservicio
CREATE DATABASE dental_auth;
CREATE DATABASE dental_users;
CREATE DATABASE dental_patients;
CREATE DATABASE dental_appointments;
CREATE DATABASE dental_consultations;
CREATE DATABASE dental_prescriptions;
CREATE DATABASE dental_clinical_history;

-- Conectar a cada base de datos y crear extensiones necesarias

\c dental_auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dental_users;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dental_patients;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dental_appointments;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dental_consultations;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dental_prescriptions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dental_clinical_history;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Volver a la base de datos principal
\c dental_white;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Catálogos compartidos en la base de datos principal (dental_white)

-- Tabla: cat_tipos_paciente
CREATE TABLE IF NOT EXISTS cat_tipos_paciente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: cat_sucursales
CREATE TABLE IF NOT EXISTS cat_sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: cat_nacionalidades
CREATE TABLE IF NOT EXISTS cat_nacionalidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo_iso VARCHAR(3),
    activo BOOLEAN DEFAULT true
);

-- Tabla: cat_roles
CREATE TABLE IF NOT EXISTS cat_roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSONB,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: cat_especialidades
CREATE TABLE IF NOT EXISTS cat_especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: cat_servicios
CREATE TABLE IF NOT EXISTS cat_servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10, 2),
    duracion_minutos INTEGER,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: cat_medios_contacto
CREATE TABLE IF NOT EXISTS cat_medios_contacto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

-- Tabla: cat_estados_cita
CREATE TABLE IF NOT EXISTS cat_estados_cita (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7),
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

-- Tabla: cat_tipos_antecedentes
CREATE TABLE IF NOT EXISTS cat_tipos_antecedentes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(50),
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

-- Insertar datos iniciales en catálogos

-- cat_tipos_paciente
INSERT INTO cat_tipos_paciente (nombre, descripcion) VALUES
('General', 'Paciente sin características especiales'),
('VIP', 'Paciente VIP con atención preferencial'),
('Corporativo', 'Paciente de convenio corporativo'),
('Familiar', 'Familiar de empleado con descuento');

-- cat_sucursales
INSERT INTO cat_sucursales (nombre, direccion, telefono, email) VALUES
('Pénjamo', 'Calle Principal #123, Pénjamo, Guanajuato', '4771234567', 'penjamo@dentalwhite.com'),
('Valle de Santiago', 'Av. Central #456, Valle de Santiago, Guanajuato', '4569876543', 'valle@dentalwhite.com'),
('Abasolo', 'Blvd. Norte #789, Abasolo, Guanajuato', '4291357924', 'abasolo@dentalwhite.com');

-- cat_nacionalidades
INSERT INTO cat_nacionalidades (nombre, codigo_iso) VALUES
('Mexicana', 'MEX'),
('Estadounidense', 'USA'),
('Canadiense', 'CAN'),
('Guatemalteca', 'GTM'),
('Otra', 'OTH');

-- cat_roles
INSERT INTO cat_roles (nombre, descripcion, permisos) VALUES
('SUPERADMIN', 'Super Administrador con acceso total', '{"all": true}'::jsonb),
('ADMIN', 'Administrador de sucursal', '{"users": ["read", "create", "update"], "patients": ["all"], "appointments": ["all"]}'::jsonb),
('DENTISTA', 'Odontólogo', '{"patients": ["read"], "appointments": ["read", "update"], "consultations": ["all"]}'::jsonb),
('RECEPCIONISTA', 'Personal de recepción', '{"patients": ["read", "create", "update"], "appointments": ["all"]}'::jsonb),
('ASISTENTE', 'Asistente dental', '{"patients": ["read"], "appointments": ["read"], "consultations": ["read"]}'::jsonb);

-- cat_especialidades
INSERT INTO cat_especialidades (nombre, descripcion) VALUES
('Odontología General', 'Práctica general de odontología'),
('Ortodoncia', 'Especialidad en corrección de dientes y mandíbulas'),
('Endodoncia', 'Tratamiento de conductos radiculares'),
('Periodoncia', 'Tratamiento de encías y estructuras de soporte'),
('Odontopediatría', 'Odontología pediátrica'),
('Cirugía Oral', 'Cirugía maxilofacial y extracciones'),
('Prostodoncia', 'Prótesis dentales y restauración'),
('Estética Dental', 'Blanqueamiento y estética');

-- cat_servicios
INSERT INTO cat_servicios (nombre, descripcion, precio_base, duracion_minutos) VALUES
('Consulta General', 'Consulta odontológica general', 500.00, 30),
('Limpieza Dental', 'Profilaxis y limpieza profesional', 800.00, 45),
('Extracción Simple', 'Extracción de pieza dental simple', 1200.00, 30),
('Extracción Compleja', 'Extracción quirúrgica', 2500.00, 60),
('Resina', 'Restauración con resina', 1000.00, 45),
('Endodoncia', 'Tratamiento de conductos', 3500.00, 90),
('Corona', 'Corona dental', 5000.00, 60),
('Blanqueamiento', 'Blanqueamiento dental', 3000.00, 60),
('Ortodoncia - Consulta', 'Consulta de ortodoncia', 500.00, 45),
('Brackets', 'Colocación de brackets', 15000.00, 120);

-- cat_medios_contacto
INSERT INTO cat_medios_contacto (nombre, descripcion) VALUES
('Teléfono', 'Contacto telefónico'),
('WhatsApp', 'Mensajería WhatsApp'),
('Email', 'Correo electrónico'),
('Redes Sociales', 'Facebook, Instagram, etc.'),
('Visita Directa', 'Visita sin cita previa');

-- cat_estados_cita
INSERT INTO cat_estados_cita (nombre, color, descripcion) VALUES
('Programada', '#3B82F6', 'Cita programada'),
('Confirmada', '#10B981', 'Cita confirmada por el paciente'),
('En Curso', '#F59E0B', 'Cita en progreso'),
('Completada', '#6366F1', 'Cita finalizada'),
('Cancelada', '#EF4444', 'Cita cancelada'),
('No Asistió', '#9CA3AF', 'Paciente no asistió'),
('Reagendada', '#8B5CF6', 'Cita reprogramada');

-- cat_tipos_antecedentes
INSERT INTO cat_tipos_antecedentes (nombre, categoria, descripcion) VALUES
('Diabetes', 'Patológicos', 'Diabetes mellitus tipo 1 o 2'),
('Hipertensión', 'Patológicos', 'Presión arterial alta'),
('Cardiopatías', 'Patológicos', 'Enfermedades del corazón'),
('Asma', 'Patológicos', 'Asma bronquial'),
('Alergias Medicamentosas', 'Alérgicos', 'Alergias a medicamentos'),
('Tabaquismo', 'No Patológicos', 'Fumador activo'),
('Alcoholismo', 'No Patológicos', 'Consumo de alcohol'),
('Embarazo', 'Gineco-obstétricos', 'Paciente embarazada'),
('Cirugías Previas', 'Quirúrgicos', 'Antecedentes de cirugías'),
('VIH/SIDA', 'Patológicos', 'Virus de inmunodeficiencia humana');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_sucursales_activo ON cat_sucursales(activo);
CREATE INDEX idx_roles_nombre ON cat_roles(nombre);
CREATE INDEX idx_especialidades_activo ON cat_especialidades(activo);
CREATE INDEX idx_servicios_activo ON cat_servicios(activo);
CREATE INDEX idx_estados_cita_nombre ON cat_estados_cita(nombre);

-- Triggers para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cat_tipos_paciente_updated_at BEFORE UPDATE ON cat_tipos_paciente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cat_sucursales_updated_at BEFORE UPDATE ON cat_sucursales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de confirmación
SELECT 'Bases de datos y catálogos inicializados correctamente' AS mensaje;
