-- ============================================
-- DENTAL WHITE - Inicialización Completa
-- PostgreSQL 17+
-- ============================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para búsquedas de texto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar timezone
SET timezone = 'America/Mexico_City';

-- ============================================
-- CATÁLOGOS
-- ============================================

-- Catálogo de nacionalidades
CREATE TABLE IF NOT EXISTS cat_nacionalidades (
    id SERIAL PRIMARY KEY,
    codigo_iso CHAR(3) UNIQUE NOT NULL,
    gentilicio TEXT NOT NULL,
    pais TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de roles
CREATE TABLE IF NOT EXISTS cat_roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de especialidades
CREATE TABLE IF NOT EXISTS cat_especialidades (
    id SERIAL PRIMARY KEY,
    nombre_especialidad VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de tipos de paciente
CREATE TABLE IF NOT EXISTS cat_tipos_paciente (
    id SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Catálogo de servicios
CREATE TABLE IF NOT EXISTS cat_servicios (
    id SERIAL PRIMARY KEY,
    id_especialidad INT REFERENCES cat_especialidades(id),
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo_base DECIMAL(10, 2) NOT NULL,
    duracion_estimada INTERVAL NOT NULL,
    requiere_fotos BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE
);

-- Catálogo de sucursales
CREATE TABLE IF NOT EXISTS cat_sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de medios de contacto
CREATE TABLE IF NOT EXISTS cat_medios_contacto (
    id SERIAL PRIMARY KEY,
    nombre_medio VARCHAR(50) UNIQUE NOT NULL
);

-- Catálogo de estados de cita
CREATE TABLE IF NOT EXISTS cat_estados_cita (
    id SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

-- Catálogo de tipos de antecedentes
CREATE TABLE IF NOT EXISTS cat_tipos_antecedentes (
    id SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- Catálogo de horarios
CREATE TABLE IF NOT EXISTS cat_horarios (
    id SERIAL PRIMARY KEY,
    sucursal_id INT REFERENCES cat_sucursales(id),
    hora VARCHAR(5) NOT NULL,
    hora_inicio TIME NOT NULL DEFAULT '08:00:00',
    hora_fin TIME NOT NULL DEFAULT '20:00:00',
    duracion_minutos INT NOT NULL DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    curp VARCHAR(18) UNIQUE,
    rfc VARCHAR(13) UNIQUE,
    nacionalidad_id INT REFERENCES cat_nacionalidades(id),
    telefono_principal VARCHAR(20),
    telefono_secundario VARCHAR(20),
    email_secundario VARCHAR(100),
    whatsapp VARCHAR(20),
    rol_id INT NOT NULL REFERENCES cat_roles(id),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    last_login TIMESTAMP
);

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL REFERENCES usuarios(id),
    sucursal_id INT REFERENCES cat_sucursales(id),
    numero_empleado VARCHAR(20) UNIQUE,
    cedula_profesional VARCHAR(50) UNIQUE,
    fecha_contratacion DATE,
    puesto VARCHAR(100),
    salario DECIMAL(10, 2),
    especialidad_principal VARCHAR(100),
    biografia_resumen TEXT,
    foto_perfil_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL REFERENCES usuarios(id),
    tipo_paciente_id INT REFERENCES cat_tipos_paciente(id),
    sucursal_id INT REFERENCES cat_sucursales(id),
    numero_expediente VARCHAR(20) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(15),
    ocupacion VARCHAR(100),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    codigo_postal VARCHAR(10),
    telefono_emergencia VARCHAR(20),
    contacto_emergencia VARCHAR(100),
    tutor_nombre VARCHAR(200),
    tutor_telefono VARCHAR(20),
    tutor_relacion VARCHAR(50),
    firma_digitalizada TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    empleado_id INT NOT NULL REFERENCES empleados(id),
    servicio_id INT NOT NULL REFERENCES cat_servicios(id),
    sucursal_id INT NOT NULL REFERENCES cat_sucursales(id),
    estado_cita_id INT NOT NULL REFERENCES cat_estados_cita(id),
    medio_contacto_id INT REFERENCES cat_medios_contacto(id),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    fecha_cita DATE,
    hora_cita TIME,
    duracion_minutos INT DEFAULT 30,
    motivo_consulta TEXT,
    notas TEXT,
    notas_cancelacion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de bloqueos de agenda
CREATE TABLE IF NOT EXISTS bloqueos_agenda (
    id SERIAL PRIMARY KEY,
    sucursal_id INT REFERENCES cat_sucursales(id),
    empleado_id INT REFERENCES empleados(id),
    horario_id INT REFERENCES cat_horarios(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    motivo VARCHAR(255),
    descripcion TEXT,
    tipo_bloqueo VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de consultas
CREATE TABLE IF NOT EXISTS consultas (
    id SERIAL PRIMARY KEY,
    cita_id INT UNIQUE NOT NULL REFERENCES citas(id),
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    empleado_id INT NOT NULL REFERENCES empleados(id),
    reconocimiento_hallazgos TEXT,
    diagnostico TEXT,
    tratamiento_indicaciones TEXT,
    peso DECIMAL(5,2),
    talla DECIMAL(5,2),
    temperatura DECIMAL(4,2),
    presion_sistolica INTEGER,
    presion_diastolica INTEGER,
    pulso INTEGER,
    glucosa DECIMAL(5,2),
    notas_adicionales TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de recetas
CREATE TABLE IF NOT EXISTS recetas (
    id SERIAL PRIMARY KEY,
    consulta_id INT UNIQUE NOT NULL REFERENCES consultas(id),
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    empleado_id INT NOT NULL REFERENCES empleados(id),
    folio VARCHAR(50) UNIQUE NOT NULL,
    peso DECIMAL(5,2),
    presion VARCHAR(20),
    pulso INTEGER,
    glucosa DECIMAL(5,2),
    indicaciones_generales TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de medicamentos de receta
CREATE TABLE IF NOT EXISTS receta_medicamentos (
    id SERIAL PRIMARY KEY,
    receta_id INT NOT NULL REFERENCES recetas(id),
    medicamento VARCHAR(200) NOT NULL,
    presentacion VARCHAR(100),
    dosis VARCHAR(100) NOT NULL,
    duracion VARCHAR(100),
    indicaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial clínico
CREATE TABLE IF NOT EXISTS historial_clinico (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    tipo_antecedente_id INT REFERENCES cat_tipos_antecedentes(id),
    descripcion TEXT NOT NULL,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_diagnostico DATE,
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de consentimientos
CREATE TABLE IF NOT EXISTS consentimientos (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    servicio_id INT REFERENCES cat_servicios(id),
    texto_legal TEXT NOT NULL,
    firma_base64 TEXT NOT NULL,
    fecha_firma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    cita_id INT REFERENCES citas(id),
    paciente_id INT REFERENCES pacientes(id),
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(20) DEFAULT 'completado',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de especialidades por empleado
CREATE TABLE IF NOT EXISTS empleado_especialidades (
    empleado_id INT REFERENCES empleados(id),
    especialidad_id INT REFERENCES cat_especialidades(id),
    PRIMARY KEY (empleado_id, especialidad_id)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_telefono ON usuarios(telefono_principal);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_empleado ON citas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_recetas_folio ON recetas(folio);
CREATE INDEX IF NOT EXISTS idx_historial_paciente ON historial_clinico(paciente_id);

-- ============================================
-- DATOS DE SEMILLA
-- ============================================

-- Nacionalidades
INSERT INTO cat_nacionalidades (codigo_iso, gentilicio, pais) VALUES 
('MEX', 'Mexicana', 'México'),
('USA', 'Estadounidense', 'Estados Unidos'),
('CAN', 'Canadiense', 'Canadá'),
('ESP', 'Española', 'España')
ON CONFLICT DO NOTHING;

-- Roles
INSERT INTO cat_roles (nombre_rol, descripcion) VALUES 
('Admin', 'Control total del sistema'),
('Doctor', 'Acceso a expedientes y citas'),
('Recepcionista', 'Gestión de agenda y cobros'),
('Paciente', 'Acceso a su historial')
ON CONFLICT DO NOTHING;

-- Estados de cita
INSERT INTO cat_estados_cita (id, nombre_estado) VALUES 
(1, 'Programada'),
(2, 'Confirmada'),
(3, 'Cancelada'),
(4, 'Completada')
ON CONFLICT DO NOTHING;

-- Tipos de paciente
INSERT INTO cat_tipos_paciente (nombre_tipo) VALUES 
('Regular'),
('Pediátrico'),
('Primera Vez')
ON CONFLICT DO NOTHING;

-- Medios de contacto
INSERT INTO cat_medios_contacto (nombre_medio) VALUES 
('Página Web'),
('WhatsApp'),
('Teléfono'),
('Presencial')
ON CONFLICT DO NOTHING;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos dental_white inicializada correctamente';
END $$;
