-- ============================================
-- DENTAL WHITE - Esquema PostgreSQL
-- Sistema de Gestión Dental
-- VERSION: 2.0 - Todo en Español con Catálogos
-- ============================================

-- Eliminar tablas existentes (en orden inverso de dependencias)
DROP TABLE IF EXISTS historial_citas CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS expedientes_medicos CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS dias_bloqueados CASCADE;
DROP TABLE IF EXISTS horarios_bloqueados CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS empleados CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS centros_trabajo CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Catálogos
DROP TABLE IF EXISTS cat_roles CASCADE;
DROP TABLE IF EXISTS cat_estados_cita CASCADE;
DROP TABLE IF EXISTS cat_tipos_pago CASCADE;
DROP TABLE IF EXISTS cat_metodos_pago CASCADE;
DROP TABLE IF EXISTS cat_estados_empleado CASCADE;
DROP TABLE IF EXISTS cat_tipos_paciente CASCADE;
DROP TABLE IF EXISTS cat_sexos CASCADE;
DROP TABLE IF EXISTS cat_estados_fisicos CASCADE;

-- ============================================
-- CATÁLOGOS
-- ============================================

-- Catálogo de Roles
CREATE TABLE cat_roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_roles (nombre_rol, descripcion) VALUES
('paciente', 'Usuario paciente con acceso limitado a su información'),
('recepcionista', 'Personal de recepción con acceso a gestión de citas'),
('medico', 'Médico con acceso completo a expedientes y citas'),
('administrador', 'Administrador con acceso total al sistema');

-- Catálogo de Estados de Cita
CREATE TABLE cat_estados_cita (
    id_estado_cita SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    color VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_estados_cita (nombre_estado, descripcion, color) VALUES
('agendada', 'Cita agendada pendiente de confirmación', '#FFA500'),
('confirmada', 'Cita confirmada por el paciente', '#4CAF50'),
('completada', 'Cita realizada y completada', '#2196F3'),
('cancelada', 'Cita cancelada', '#F44336'),
('no_asistio', 'Paciente no asistió a la cita', '#9E9E9E');

-- Catálogo de Tipos de Pago
CREATE TABLE cat_tipos_pago (
    id_tipo_pago SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_tipos_pago (nombre_tipo, descripcion) VALUES
('completo', 'Pago completo del servicio'),
('a_cuotas', 'Pago dividido en varias cuotas');

-- Catálogo de Métodos de Pago
CREATE TABLE cat_metodos_pago (
    id_metodo_pago SERIAL PRIMARY KEY,
    nombre_metodo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_metodos_pago (nombre_metodo, descripcion) VALUES
('efectivo', 'Pago en efectivo'),
('tarjeta', 'Pago con tarjeta de crédito o débito'),
('transferencia', 'Transferencia bancaria'),
('otro', 'Otro método de pago');

-- Catálogo de Estados de Empleado
CREATE TABLE cat_estados_empleado (
    id_estado_empleado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_estados_empleado (nombre_estado, descripcion) VALUES
('activo', 'Empleado activo trabajando'),
('inactivo', 'Empleado inactivo temporalmente'),
('permiso', 'Empleado en período de permiso');

-- Catálogo de Tipos de Paciente
CREATE TABLE cat_tipos_paciente (
    id_tipo_paciente SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_tipos_paciente (nombre_tipo, descripcion) VALUES
('primera_vez', 'Paciente que visita por primera vez'),
('regular', 'Paciente con visitas recurrentes'),
('pediatrico', 'Paciente pediátrico (menor de edad)');

-- Catálogo de Sexos
CREATE TABLE cat_sexos (
    id_sexo SERIAL PRIMARY KEY,
    nombre_sexo VARCHAR(20) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_sexos (nombre_sexo) VALUES
('Masculino'),
('Femenino'),
('Otro');

-- Catálogo de Estados Físicos/Dentales
CREATE TABLE cat_estados_fisicos (
    id_estado_fisico SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(20) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cat_estados_fisicos (nombre_estado, descripcion) VALUES
('bueno', 'Estado bueno'),
('regular', 'Estado regular'),
('malo', 'Estado malo o deficiente');

-- ============================================
-- TABLA: usuarios
-- Gestión de autenticación y acceso
-- ============================================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    correo_electronico VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    id_rol INTEGER NOT NULL REFERENCES cat_roles(id_rol),
    nombre_completo VARCHAR(255) NOT NULL,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP
);

CREATE INDEX idx_usuarios_correo ON usuarios(correo_electronico);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);

-- ============================================
-- TABLA: centros_trabajo
-- Sucursales de la clínica
-- ============================================
CREATE TABLE centros_trabajo (
    id_centro SERIAL PRIMARY KEY,
    nombre_centro VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    correo_electronico VARCHAR(255),
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_centros_nombre ON centros_trabajo(nombre_centro);

-- ============================================
-- TABLA: servicios
-- Servicios odontológicos por sucursal
-- ============================================
CREATE TABLE servicios (
    id_servicio SERIAL PRIMARY KEY,
    nombre_servicio VARCHAR(255) NOT NULL,
    descripcion TEXT,
    sucursal VARCHAR(100) NOT NULL,
    duracion_minutos INTEGER DEFAULT 60,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_servicios_sucursal ON servicios(sucursal);
CREATE INDEX idx_servicios_activo ON servicios(esta_activo);

-- ============================================
-- TABLA: empleados
-- Empleados de la clínica
-- ============================================
CREATE TABLE empleados (
    id_empleado SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    codigo_empleado VARCHAR(50) UNIQUE,
    especialidad VARCHAR(255),
    id_centro INTEGER REFERENCES centros_trabajo(id_centro),
    fecha_contratacion DATE NOT NULL,
    id_estado INTEGER DEFAULT 1 REFERENCES cat_estados_empleado(id_estado_empleado),
    telefono VARCHAR(20),
    contacto_emergencia VARCHAR(255),
    telefono_emergencia VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_empleados_usuario ON empleados(id_usuario);
CREATE INDEX idx_empleados_centro ON empleados(id_centro);
CREATE INDEX idx_empleados_estado ON empleados(id_estado);

-- ============================================
-- TABLA: pacientes
-- Pacientes de la clínica
-- ============================================
CREATE TABLE pacientes (
    id_paciente SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    codigo_paciente VARCHAR(50) UNIQUE,
    nombre_completo VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    edad INTEGER,
    id_sexo INTEGER REFERENCES cat_sexos(id_sexo),
    direccion TEXT,
    colonia VARCHAR(255),
    delegacion VARCHAR(255),
    municipio VARCHAR(255),
    codigo_postal VARCHAR(10),
    tutor VARCHAR(255),
    ocupacion VARCHAR(255),
    id_tipo_paciente INTEGER DEFAULT 1 REFERENCES cat_tipos_paciente(id_tipo_paciente),
    es_nuevo BOOLEAN DEFAULT TRUE,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pacientes_usuario ON pacientes(id_usuario);
CREATE INDEX idx_pacientes_correo ON pacientes(correo_electronico);
CREATE INDEX idx_pacientes_telefono ON pacientes(telefono);
CREATE INDEX idx_pacientes_nombre ON pacientes(nombre_completo);
CREATE INDEX idx_pacientes_codigo ON pacientes(codigo_paciente);

-- ============================================
-- TABLA: citas
-- Citas médicas
-- ============================================
CREATE TABLE citas (
    id_cita SERIAL PRIMARY KEY,
    codigo_cita VARCHAR(50) UNIQUE,
    id_paciente INTEGER NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    id_servicio INTEGER NOT NULL REFERENCES servicios(id_servicio),
    id_centro INTEGER NOT NULL REFERENCES centros_trabajo(id_centro),
    id_medico INTEGER REFERENCES empleados(id_empleado),
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    id_estado INTEGER DEFAULT 1 REFERENCES cat_estados_cita(id_estado_cita),

    -- Información de pago
    precio_servicio DECIMAL(10, 2),
    monto_pagado DECIMAL(10, 2) DEFAULT 0,
    id_tipo_pago INTEGER REFERENCES cat_tipos_pago(id_tipo_pago),
    numero_pagos INTEGER DEFAULT 1,
    pago_actual INTEGER DEFAULT 1,

    -- Notas y observaciones
    notas TEXT,
    motivo_cancelacion TEXT,

    -- Confirmaciones enviadas
    correo_enviado BOOLEAN DEFAULT FALSE,
    whatsapp_enviado BOOLEAN DEFAULT FALSE,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    fecha_completada TIMESTAMP,
    fecha_cancelacion TIMESTAMP
);

CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_medico ON citas(id_medico);
CREATE INDEX idx_citas_fecha ON citas(fecha_cita);
CREATE INDEX idx_citas_estado ON citas(id_estado);
CREATE INDEX idx_citas_centro ON citas(id_centro);
CREATE INDEX idx_citas_fecha_hora ON citas(fecha_cita, hora_cita);

-- ============================================
-- TABLA: pagos
-- Registro de pagos
-- ============================================
CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL REFERENCES citas(id_cita) ON DELETE CASCADE,
    id_paciente INTEGER NOT NULL REFERENCES pacientes(id_paciente),
    numero_pago INTEGER NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE DEFAULT CURRENT_DATE,
    id_metodo_pago INTEGER REFERENCES cat_metodos_pago(id_metodo_pago),
    numero_recibo VARCHAR(100),
    notas TEXT,
    id_creador INTEGER REFERENCES empleados(id_empleado),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pagos_cita ON pagos(id_cita);
CREATE INDEX idx_pagos_paciente ON pagos(id_paciente);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);

-- ============================================
-- TABLA: expedientes_medicos
-- Expedientes médicos digitales
-- ============================================
CREATE TABLE expedientes_medicos (
    id_expediente SERIAL PRIMARY KEY,
    id_paciente INTEGER UNIQUE NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    numero_expediente VARCHAR(50) UNIQUE,

    -- Información personal
    direccion TEXT,
    telefono VARCHAR(20),
    ocupacion VARCHAR(255),
    edad INTEGER,
    referencia VARCHAR(255),
    id_sexo INTEGER REFERENCES cat_sexos(id_sexo),
    colonia VARCHAR(255),
    delegacion VARCHAR(255),
    codigo_postal VARCHAR(10),
    tutor VARCHAR(255),

    -- Información del médico
    id_medico_asignado INTEGER REFERENCES empleados(id_empleado),

    -- Historia Clínica
    id_estado_fisico INTEGER REFERENCES cat_estados_fisicos(id_estado_fisico),
    id_estado_dental INTEGER REFERENCES cat_estados_fisicos(id_estado_fisico),

    -- Antecedentes Patológicos (JSON)
    antecedentes_patologicos JSONB DEFAULT '{}',

    -- Antecedentes No Patológicos (JSON)
    antecedentes_no_patologicos JSONB DEFAULT '{}',

    -- Hábitos
    frecuencia_habito VARCHAR(100),
    duracion_habito VARCHAR(100),
    intensidad_habito VARCHAR(100),
    recibio_atencion_medica BOOLEAN DEFAULT FALSE,
    motivo_atencion_medica TEXT,

    -- Examen de la Cara (JSON)
    examen_cara JSONB DEFAULT '{}',

    -- Línea de Holdaway (JSON)
    linea_holdaway JSONB DEFAULT '{}',

    -- Examen Bucal (JSON)
    examen_bucal JSONB DEFAULT '{}',

    -- Examen Radiográfico (JSON)
    examen_radiografico JSONB DEFAULT '{}',

    -- Firmas (Base64)
    firma_paciente TEXT,
    firma_tutor_legal TEXT,

    -- Observaciones
    observaciones TEXT,

    -- Fechas
    fecha_inicio DATE,
    fecha_fin DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expedientes_paciente ON expedientes_medicos(id_paciente);
CREATE INDEX idx_expedientes_medico ON expedientes_medicos(id_medico_asignado);

-- ============================================
-- TABLA: historial_citas
-- Historial de citas en expedientes
-- ============================================
CREATE TABLE historial_citas (
    id_historial SERIAL PRIMARY KEY,
    id_expediente INTEGER NOT NULL REFERENCES expedientes_medicos(id_expediente) ON DELETE CASCADE,
    numero_cita INTEGER NOT NULL,
    fecha_cita DATE NOT NULL,
    actividad TEXT NOT NULL,
    nombre_medico VARCHAR(255) NOT NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historial_expediente ON historial_citas(id_expediente);
CREATE INDEX idx_historial_fecha ON historial_citas(fecha_cita);

-- ============================================
-- TABLA: dias_bloqueados
-- Días bloqueados para citas
-- ============================================
CREATE TABLE dias_bloqueados (
    id_bloqueo SERIAL PRIMARY KEY,
    fecha_bloqueada DATE NOT NULL,
    id_centro INTEGER REFERENCES centros_trabajo(id_centro),
    motivo VARCHAR(255),
    es_festivo BOOLEAN DEFAULT FALSE,
    id_bloqueador INTEGER REFERENCES empleados(id_empleado),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dias_bloqueados_fecha ON dias_bloqueados(fecha_bloqueada);
CREATE INDEX idx_dias_bloqueados_centro ON dias_bloqueados(id_centro);

-- ============================================
-- TABLA: horarios_bloqueados
-- Horarios bloqueados para citas
-- ============================================
CREATE TABLE horarios_bloqueados (
    id_horario_bloqueado SERIAL PRIMARY KEY,
    fecha_bloqueada DATE NOT NULL,
    hora_bloqueada TIME NOT NULL,
    id_centro INTEGER REFERENCES centros_trabajo(id_centro),
    motivo VARCHAR(255),
    id_bloqueador INTEGER REFERENCES empleados(id_empleado),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_horarios_bloqueados_fecha_hora ON horarios_bloqueados(fecha_bloqueada, hora_bloqueada);
CREATE INDEX idx_horarios_bloqueados_centro ON horarios_bloqueados(id_centro);

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Insertar sucursales
INSERT INTO centros_trabajo (nombre_centro, direccion, telefono, correo_electronico) VALUES
('Pénjamo', 'Calle primero de mayo #9, Pénjamo Gto', '4611234567', 'penjamo@dentalwhite.com'),
('Valle de Santiago', 'Centro, Valle de Santiago Gto', '4619876543', 'valle@dentalwhite.com'),
('Abasolo', 'Abasolo Gto', '4615551234', 'abasolo@dentalwhite.com');

-- Insertar servicios por sucursal
-- Servicios de Pénjamo
INSERT INTO servicios (nombre_servicio, descripcion, sucursal, duracion_minutos) VALUES
('Limpieza Dental', 'Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales', 'Pénjamo', 60),
('Ortodoncia', 'Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal.', 'Pénjamo', 90),
('Endodoncia', 'Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material.', 'Pénjamo', 120),
('Extracción', 'Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia.', 'Pénjamo', 45),
('Blanqueamiento', 'Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas.', 'Pénjamo', 90),
('Prótesis Dentales', 'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', 'Pénjamo', 120),
('Revisión General', 'Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor.', 'Pénjamo', 30);

-- Servicios de Valle de Santiago
INSERT INTO servicios (nombre_servicio, descripcion, sucursal, duracion_minutos) VALUES
('Prótesis Dentales', 'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', 'Valle de Santiago', 120),
('Implantes Dentales', 'Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental.', 'Valle de Santiago', 180),
('Cirugía Maxilofacial', 'Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial.', 'Valle de Santiago', 150),
('Periodoncia', 'Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis.', 'Valle de Santiago', 90);

-- Servicios de Abasolo
INSERT INTO servicios (nombre_servicio, descripcion, sucursal, duracion_minutos) VALUES
('Odontopediatría', 'Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad.', 'Abasolo', 60),
('Diseño de Sonrisa', 'Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental.', 'Abasolo', 120),
('Coronas y Puentes', 'Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa.', 'Abasolo', 120),
('Rehabilitación Oral', 'Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca.', 'Abasolo', 150);

-- Insertar usuarios de ejemplo
-- Contraseña para todos: "Password123" (debe ser hasheada en producción)
INSERT INTO usuarios (correo_electronico, contrasena_hash, id_rol, nombre_completo) VALUES
('admin@dentalwhite.com', '$2a$10$example_hash_admin', 4, 'Administrador Principal'),
('recepcion@dentalwhite.com', '$2a$10$example_hash_reception', 2, 'María González'),
('doctor@dentalwhite.com', '$2a$10$example_hash_doctor', 3, 'Dr. Carlos Méndez'),
('laura.sanchez@dentalwhite.com', '$2a$10$example_hash_doctor2', 3, 'Dra. Laura Sánchez'),
('paciente@example.com', '$2a$10$example_hash_patient', 1, 'Juan Pérez');

-- Insertar empleados
INSERT INTO empleados (id_usuario, codigo_empleado, especialidad, id_centro, fecha_contratacion, telefono) VALUES
(1, 'ADMIN001', NULL, 1, '2025-01-01', '5500000000'),
(2, 'RECEP001', NULL, 1, '2025-03-01', '5511111111'),
(3, 'DOC001', 'Odontología General', 1, '2025-02-01', '5522222222'),
(4, 'DOC002', 'Endodoncia', 2, '2025-04-01', '5533333333');

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (codigo_paciente, nombre_completo, correo_electronico, telefono, edad, id_sexo, direccion, colonia, delegacion, municipio, ocupacion, id_tipo_paciente, es_nuevo, fecha_registro, id_usuario) VALUES
('PAT001', 'Juan Pérez', 'paciente@example.com', '5512345678', 32, 1, 'Calle Principal 123', 'Centro', 'Cuauhtémoc', 'Cuauhtémoc', 'Ingeniero', 2, FALSE, '2026-01-15', 5),
('PAT002', 'María López', 'maria.lopez@example.com', '5523456789', 28, 2, 'Av. Reforma 456', 'Polanco', 'Miguel Hidalgo', 'Miguel Hidalgo', 'Diseñadora', 2, FALSE, '2026-01-20', NULL),
('PAT003', 'Ana Rodríguez', 'ana.rodriguez@example.com', '5534567890', 45, 2, 'Calle Norte 789', 'Del Valle', 'Benito Juárez', 'Benito Juárez', 'Abogada', 1, FALSE, '2026-02-01', NULL),
('PAT004', 'Carlos Martínez', 'carlos.martinez@example.com', '5545678901', 12, 1, 'Calle Sur 321', 'Coyoacán', 'Coyoacán', 'Coyoacán', 'Estudiante', 3, FALSE, '2026-02-05', NULL);

-- Insertar citas de ejemplo
INSERT INTO citas (codigo_cita, id_paciente, id_servicio, id_centro, id_medico, fecha_cita, hora_cita, id_estado, precio_servicio, monto_pagado, id_tipo_pago) VALUES
('APT001', 1, 1, 1, 3, '2026-03-20', '10:00', 1, 500.00, 500.00, 1),
('APT002', 2, 7, 1, 3, '2026-03-20', '11:00', 2, 300.00, 300.00, 1),
('APT003', 3, 3, 1, 3, '2026-03-21', '14:00', 1, 1500.00, 500.00, 2),
('APT004', 4, 2, 1, 3, '2026-03-21', '09:00', 2, 15000.00, 5000.00, 2);

UPDATE citas SET numero_pagos = 3, pago_actual = 1 WHERE id_cita = 3;
UPDATE citas SET numero_pagos = 3, pago_actual = 1 WHERE id_cita = 4;

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar fecha_actualizacion
CREATE TRIGGER trg_usuarios_actualizacion BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_centros_actualizacion BEFORE UPDATE ON centros_trabajo
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_servicios_actualizacion BEFORE UPDATE ON servicios
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_empleados_actualizacion BEFORE UPDATE ON empleados
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_pacientes_actualizacion BEFORE UPDATE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_citas_actualizacion BEFORE UPDATE ON citas
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_expedientes_actualizacion BEFORE UPDATE ON expedientes_medicos
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de citas con información completa
CREATE OR REPLACE VIEW vista_citas_completas AS
SELECT
    c.id_cita,
    c.codigo_cita,
    c.fecha_cita,
    c.hora_cita,
    ec.nombre_estado AS estado,
    ec.color AS color_estado,
    p.nombre_completo AS nombre_paciente,
    p.telefono AS telefono_paciente,
    p.correo_electronico AS correo_paciente,
    s.nombre_servicio,
    s.duracion_minutos,
    ct.nombre_centro,
    ct.direccion AS direccion_centro,
    e.codigo_empleado AS codigo_medico,
    u.nombre_completo AS nombre_medico,
    c.precio_servicio,
    c.monto_pagado,
    tp.nombre_tipo AS tipo_pago,
    c.numero_pagos,
    c.pago_actual,
    c.notas,
    c.fecha_creacion,
    c.fecha_confirmacion,
    c.fecha_completada
FROM citas c
JOIN pacientes p ON c.id_paciente = p.id_paciente
JOIN servicios s ON c.id_servicio = s.id_servicio
JOIN centros_trabajo ct ON c.id_centro = ct.id_centro
JOIN cat_estados_cita ec ON c.id_estado = ec.id_estado_cita
LEFT JOIN cat_tipos_pago tp ON c.id_tipo_pago = tp.id_tipo_pago
LEFT JOIN empleados e ON c.id_medico = e.id_empleado
LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario;

-- Vista de pacientes con información de usuario
CREATE OR REPLACE VIEW vista_pacientes_completos AS
SELECT
    p.*,
    s.nombre_sexo,
    tp.nombre_tipo AS tipo_paciente,
    u.correo_electronico AS correo_usuario,
    u.esta_activo AS usuario_activo,
    COUNT(DISTINCT c.id_cita) AS total_citas,
    MAX(c.fecha_cita) AS fecha_ultima_cita
FROM pacientes p
LEFT JOIN cat_sexos s ON p.id_sexo = s.id_sexo
LEFT JOIN cat_tipos_paciente tp ON p.id_tipo_paciente = tp.id_tipo_paciente
LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
LEFT JOIN citas c ON p.id_paciente = c.id_paciente
GROUP BY p.id_paciente, s.nombre_sexo, tp.nombre_tipo, u.correo_electronico, u.esta_activo;

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

COMMENT ON TABLE usuarios IS 'Usuarios del sistema con autenticación';
COMMENT ON TABLE centros_trabajo IS 'Sucursales de Dental White';
COMMENT ON TABLE servicios IS 'Servicios odontológicos por sucursal';
COMMENT ON TABLE empleados IS 'Empleados de la clínica';
COMMENT ON TABLE pacientes IS 'Pacientes registrados';
COMMENT ON TABLE citas IS 'Citas médicas agendadas';
COMMENT ON TABLE pagos IS 'Registro de pagos realizados';
COMMENT ON TABLE expedientes_medicos IS 'Expedientes médicos digitales';
COMMENT ON TABLE dias_bloqueados IS 'Días bloqueados para agendar citas';
COMMENT ON TABLE horarios_bloqueados IS 'Horarios específicos bloqueados';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
