-- ============================================
-- DENTAL WHITE - Esquema PostgreSQL Completo
-- Sistema de Gestión Dental
-- VERSION: 3.0 - Estructura Completa con Catálogos
-- ============================================

-- Eliminar tablas existentes (en orden inverso de dependencias)
DROP TABLE IF EXISTS consentimientos_paciente CASCADE;
DROP TABLE IF EXISTS historial_clinico CASCADE;
DROP TABLE IF EXISTS empleado_especialidades CASCADE;
DROP TABLE IF EXISTS sucursal_especialidades CASCADE;
DROP TABLE IF EXISTS receta_medicamentos CASCADE;
DROP TABLE IF EXISTS recetas CASCADE;
DROP TABLE IF EXISTS consultas_fotos CASCADE;
DROP TABLE IF EXISTS consultas CASCADE;
DROP TABLE IF EXISTS bloqueos_agenda CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS empleados CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Eliminar catálogos
DROP TABLE IF EXISTS cat_tipos_antecedentes CASCADE;
DROP TABLE IF EXISTS cat_estados_cita CASCADE;
DROP TABLE IF EXISTS cat_medios_contacto CASCADE;
DROP TABLE IF EXISTS cat_servicios CASCADE;
DROP TABLE IF EXISTS cat_especialidades CASCADE;
DROP TABLE IF EXISTS cat_roles CASCADE;
DROP TABLE IF EXISTS cat_nacionalidades CASCADE;
DROP TABLE IF EXISTS cat_sucursales CASCADE;
DROP TABLE IF EXISTS cat_tipos_paciente CASCADE;

-- ============================================
-- CATÁLOGOS DEL SISTEMA
-- ============================================

-- ============================================
-- Catálogo de tipos de paciente
-- ============================================
CREATE TABLE cat_tipos_paciente (
    id SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cat_tipos_paciente IS 'Catálogo de tipos de pacientes: Pediátrico, Regular, Primera Vez';

-- ============================================
-- Catálogo de sucursales
-- ============================================
CREATE TABLE cat_sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono_contacto1 VARCHAR(20) NOT NULL,
    telefono_contacto2 VARCHAR(20),
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    url_google_maps TEXT,
    -- Horarios de atención
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    -- Campos para galería en página web
    foto_url TEXT,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cat_sucursales IS 'Catálogo de sucursales con información de contacto y horarios';

CREATE INDEX idx_sucursales_activa ON cat_sucursales(activa);
CREATE INDEX idx_sucursales_nombre ON cat_sucursales(nombre);

-- ============================================
-- Catálogo de nacionalidades
-- ============================================
CREATE TABLE cat_nacionalidades (
    id SERIAL PRIMARY KEY,
    codigo_iso CHAR(3) UNIQUE NOT NULL,
    gentilicio TEXT NOT NULL,
    pais TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE cat_nacionalidades IS 'Catálogo de nacionalidades con código ISO';

CREATE INDEX idx_nacionalidades_codigo ON cat_nacionalidades(codigo_iso);

-- ============================================
-- Catálogo de roles de usuario
-- ============================================
CREATE TABLE cat_roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cat_roles IS 'Catálogo de roles del sistema: Admin, Doctor, Recepcionista, Paciente';

-- ============================================
-- Catálogo de especialidades
-- ============================================
CREATE TABLE cat_especialidades (
    id SERIAL PRIMARY KEY,
    nombre_especialidad VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cat_especialidades IS 'Catálogo de especialidades odontológicas';

CREATE INDEX idx_especialidades_activa ON cat_especialidades(activa);

-- ============================================
-- Catálogo de servicios
-- ============================================
CREATE TABLE cat_servicios (
    id SERIAL PRIMARY KEY,
    id_especialidad INT NOT NULL REFERENCES cat_especialidades(id),
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo_base DECIMAL(10, 2) NOT NULL,
    duracion_estimada INTERVAL NOT NULL,
    requiere_fotos BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cat_servicios IS 'Catálogo de servicios odontológicos con costos y duración';

CREATE INDEX idx_servicios_especialidad ON cat_servicios(id_especialidad);
CREATE INDEX idx_servicios_activa ON cat_servicios(activa);

-- ============================================
-- Catálogo de medios de contacto
-- ============================================
CREATE TABLE cat_medios_contacto (
    id SERIAL PRIMARY KEY,
    nombre_medio VARCHAR(50) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE cat_medios_contacto IS 'Catálogo de medios de contacto: Web, WhatsApp, Teléfono, Presencial';

-- ============================================
-- Catálogo de estados de cita
-- ============================================
CREATE TABLE cat_estados_cita (
    id SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE cat_estados_cita IS 'Catálogo de estados de citas: Pendiente, Confirmada, Atendida, Cancelada, No asistió';

-- ============================================
-- Catálogo de tipos de antecedentes
-- ============================================
CREATE TABLE cat_tipos_antecedentes (
    id SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE cat_tipos_antecedentes IS 'Catálogo de categorías de antecedentes clínicos';

-- ============================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- ============================================

-- ============================================
-- TABLA: Usuarios
-- Gestión de autenticación y roles
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    curp CHAR(18) UNIQUE,
    rfc CHAR(13),
    id_nacionalidad INT NOT NULL REFERENCES cat_nacionalidades(id),
    id_rol INT NOT NULL REFERENCES cat_roles(id),
    email1 VARCHAR(100) UNIQUE NOT NULL,
    email2 VARCHAR(100),
    telefono1 VARCHAR(30) UNIQUE NOT NULL,
    telefono2 VARCHAR(30),
    whatsapp VARCHAR(30) NOT NULL,
    passwd_encript VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

COMMENT ON TABLE usuarios IS 'Tabla principal de usuarios del sistema';

CREATE INDEX idx_usuarios_email1 ON usuarios(email1);
CREATE INDEX idx_usuarios_telefono1 ON usuarios(telefono1);
CREATE INDEX idx_usuarios_nombre ON usuarios(nombre_completo);
CREATE INDEX idx_usuarios_whatsapp ON usuarios(whatsapp);
CREATE INDEX idx_usuarios_curp ON usuarios(curp);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);

-- ============================================
-- TABLA: Pacientes
-- ============================================
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    id_tipo_paciente INT NOT NULL REFERENCES cat_tipos_paciente(id),
    id_sucursal_frecuente INT REFERENCES cat_sucursales(id),
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(15) CHECK (sexo IN ('Masculino', 'Femenino', 'No binario', 'No informar')),
    direccion_completa TEXT,
    ocupacion VARCHAR(100),
    nombre_tutor VARCHAR(200),
    firma_digitalizada TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE pacientes IS 'Información específica de pacientes';

CREATE INDEX idx_pacientes_usuario ON pacientes(id_usuario);
CREATE INDEX idx_pacientes_tipo ON pacientes(id_tipo_paciente);
CREATE INDEX idx_pacientes_sucursal ON pacientes(id_sucursal_frecuente);
CREATE INDEX idx_pacientes_fecha_nacimiento ON pacientes(fecha_nacimiento);

-- ============================================
-- TABLA: Empleados
-- ============================================
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    id_sucursal_asignada INT NOT NULL REFERENCES cat_sucursales(id),
    cedula_profesional VARCHAR(50),
    especialidad_principal VARCHAR(100),
    biografia_resumen TEXT,
    foto_perfil_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE empleados IS 'Información de empleados (doctores, recepcionistas, etc.)';

CREATE INDEX idx_empleados_usuario ON empleados(id_usuario);
CREATE INDEX idx_empleados_sucursal ON empleados(id_sucursal_asignada);
CREATE INDEX idx_empleados_cedula ON empleados(cedula_profesional);

-- ============================================
-- TABLA: Citas
-- ============================================
CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL REFERENCES pacientes(id),
    id_doctor INT NOT NULL REFERENCES empleados(id),
    id_sucursal INT NOT NULL REFERENCES cat_sucursales(id),
    id_servicio INT NOT NULL REFERENCES cat_servicios(id),
    id_medio_contacto INT NOT NULL REFERENCES cat_medios_contacto(id),
    id_estado INT NOT NULL DEFAULT 1 REFERENCES cat_estados_cita(id),
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo_consulta TEXT,
    notas_adicionales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE citas IS 'Gestión de citas médicas';

CREATE INDEX idx_citas_fecha ON citas(fecha_cita);
CREATE INDEX idx_citas_doctor ON citas(id_doctor);
CREATE INDEX idx_citas_sucursal ON citas(id_sucursal);
CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_estado ON citas(id_estado);
CREATE INDEX idx_citas_fecha_hora ON citas(fecha_cita, hora_cita);

-- ============================================
-- TABLA: Bloqueo de agenda
-- ============================================
CREATE TABLE bloqueos_agenda (
    id SERIAL PRIMARY KEY,
    id_sucursal INT NOT NULL REFERENCES cat_sucursales(id),
    id_doctor INT REFERENCES empleados(id),
    fecha_bloqueo DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    motivo VARCHAR(255),
    es_festivo BOOLEAN DEFAULT FALSE,
    created_by INT REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE bloqueos_agenda IS 'Bloqueos de disponibilidad de agenda';

CREATE INDEX idx_bloqueos_fecha ON bloqueos_agenda(fecha_bloqueo);
CREATE INDEX idx_bloqueos_sucursal ON bloqueos_agenda(id_sucursal);
CREATE INDEX idx_bloqueos_doctor ON bloqueos_agenda(id_doctor);

-- ============================================
-- TABLA: Consultas
-- ============================================
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    id_cita INT NOT NULL UNIQUE REFERENCES citas(id),
    id_paciente INT NOT NULL REFERENCES pacientes(id),
    id_doctor INT NOT NULL REFERENCES empleados(id),
    -- Campos clínicos
    reconocimiento_hallazgos TEXT,
    diagnostico TEXT,
    tratamiento_indicaciones TEXT,
    -- Signos vitales
    peso_kg DECIMAL(5,2),
    talla_cm INT,
    temperatura_c DECIMAL(4,2),
    presion_arterial VARCHAR(20),
    pulso_bpm INT,
    glucosa_mgdl INT,
    -- Control
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE consultas IS 'Información clínica de consultas realizadas';

CREATE INDEX idx_consultas_paciente ON consultas(id_paciente);
CREATE INDEX idx_consultas_fecha ON consultas(fecha_consulta);
CREATE INDEX idx_consultas_doctor ON consultas(id_doctor);

-- ============================================
-- TABLA: Consultas fotos
-- ============================================
CREATE TABLE consultas_fotos (
    id SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
    url_foto TEXT NOT NULL,
    etiqueta_servicio VARCHAR(100),
    tipo_foto VARCHAR(20) CHECK (tipo_foto IN ('Antes', 'Durante', 'Después')),
    fecha_foto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE consultas_fotos IS 'Evidencia fotográfica de consultas';

CREATE INDEX idx_consultas_fotos_consulta ON consultas_fotos(id_consulta);

-- ============================================
-- TABLA: Recetas
-- ============================================
CREATE TABLE recetas (
    id SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL UNIQUE REFERENCES consultas(id),
    id_doctor INT NOT NULL REFERENCES empleados(id),
    id_paciente INT NOT NULL REFERENCES pacientes(id),
    folio VARCHAR(20) UNIQUE NOT NULL,
    -- Signos vitales (copia histórica)
    peso_receta DECIMAL(5,2),
    presion_receta VARCHAR(20),
    pulso_receta INT,
    glucosa_receta INT,
    -- Indicaciones
    indicaciones_generales TEXT,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE recetas IS 'Recetas médicas emitidas';

CREATE INDEX idx_recetas_folio ON recetas(folio);
CREATE INDEX idx_recetas_paciente ON recetas(id_paciente);
CREATE INDEX idx_recetas_fecha ON recetas(fecha_emision);

-- ============================================
-- TABLA: Receta medicamentos (Asociativa)
-- ============================================
CREATE TABLE receta_medicamentos (
    id SERIAL PRIMARY KEY,
    id_receta INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    nombre_medicamento VARCHAR(150) NOT NULL,
    presentacion VARCHAR(100),
    dosis VARCHAR(100) NOT NULL,
    duracion VARCHAR(100) NOT NULL
);

COMMENT ON TABLE receta_medicamentos IS 'Medicamentos prescritos en recetas';

CREATE INDEX idx_receta_medicamentos_receta ON receta_medicamentos(id_receta);

-- ============================================
-- TABLA: Sucursal especialidades (Asociativa)
-- ============================================
CREATE TABLE sucursal_especialidades (
    id_sucursal INT NOT NULL REFERENCES cat_sucursales(id) ON DELETE CASCADE,
    id_especialidad INT NOT NULL REFERENCES cat_especialidades(id) ON DELETE CASCADE,
    PRIMARY KEY (id_sucursal, id_especialidad)
);

COMMENT ON TABLE sucursal_especialidades IS 'Relación de especialidades disponibles por sucursal';

-- ============================================
-- TABLA: Empleado especialidades (Asociativa)
-- ============================================
CREATE TABLE empleado_especialidades (
    id_empleado INT NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    id_especialidad INT NOT NULL REFERENCES cat_especialidades(id) ON DELETE CASCADE,
    PRIMARY KEY (id_empleado, id_especialidad)
);

COMMENT ON TABLE empleado_especialidades IS 'Especialidades que maneja cada empleado';

-- ============================================
-- TABLA: Historial clínico
-- ============================================
CREATE TABLE historial_clinico (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    id_categoria INT NOT NULL REFERENCES cat_tipos_antecedentes(id),
    descripcion_padecimiento TEXT NOT NULL,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_diagnostico DATE,
    notas_adicionales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE historial_clinico IS 'Antecedentes médicos del paciente';

CREATE INDEX idx_historial_paciente ON historial_clinico(id_paciente);
CREATE INDEX idx_historial_categoria ON historial_clinico(id_categoria);

-- ============================================
-- TABLA: Consentimientos del paciente
-- ============================================
CREATE TABLE consentimientos_paciente (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    id_servicio INT NOT NULL REFERENCES cat_servicios(id),
    id_cita INT REFERENCES citas(id),
    texto_legal_aceptado TEXT NOT NULL,
    firma_base64 TEXT NOT NULL,
    fecha_firma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_registro VARCHAR(45)
);

COMMENT ON TABLE consentimientos_paciente IS 'Consentimientos informados firmados digitalmente';

CREATE INDEX idx_consentimientos_paciente ON consentimientos_paciente(id_paciente);
CREATE INDEX idx_consentimientos_fecha ON consentimientos_paciente(fecha_firma);

-- ============================================
-- TRIGGERS PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_pacientes_updated BEFORE UPDATE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_empleados_updated BEFORE UPDATE ON empleados
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_citas_updated BEFORE UPDATE ON citas
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_sucursales_updated BEFORE UPDATE ON cat_sucursales
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_servicios_updated BEFORE UPDATE ON cat_servicios
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_historial_updated BEFORE UPDATE ON historial_clinico
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de citas con información completa
CREATE OR REPLACE VIEW vista_citas_completas AS
SELECT
    c.id,
    c.fecha_cita,
    c.hora_cita,
    c.motivo_consulta,
    -- Paciente
    p.id AS id_paciente,
    u_pac.nombre_completo AS nombre_paciente,
    u_pac.email1 AS email_paciente,
    u_pac.telefono1 AS telefono_paciente,
    u_pac.whatsapp AS whatsapp_paciente,
    p.fecha_nacimiento,
    p.sexo,
    tp.nombre_tipo AS tipo_paciente,
    -- Doctor
    e.id AS id_doctor,
    u_doc.nombre_completo AS nombre_doctor,
    e.especialidad_principal,
    e.cedula_profesional,
    -- Sucursal
    s.id AS id_sucursal,
    s.nombre AS nombre_sucursal,
    s.direccion AS direccion_sucursal,
    s.telefono_contacto1 AS telefono_sucursal,
    -- Servicio
    srv.nombre_servicio,
    srv.costo_base,
    srv.duracion_estimada,
    esp.nombre_especialidad,
    -- Estado y medio
    ec.nombre_estado AS estado_cita,
    ec.color AS color_estado,
    mc.nombre_medio AS medio_contacto,
    -- Timestamps
    c.created_at,
    c.updated_at
FROM citas c
JOIN pacientes p ON c.id_paciente = p.id
JOIN usuarios u_pac ON p.id_usuario = u_pac.id
JOIN cat_tipos_paciente tp ON p.id_tipo_paciente = tp.id
JOIN empleados e ON c.id_doctor = e.id
JOIN usuarios u_doc ON e.id_usuario = u_doc.id
JOIN cat_sucursales s ON c.id_sucursal = s.id
JOIN cat_servicios srv ON c.id_servicio = srv.id
JOIN cat_especialidades esp ON srv.id_especialidad = esp.id
JOIN cat_estados_cita ec ON c.id_estado = ec.id
JOIN cat_medios_contacto mc ON c.id_medio_contacto = mc.id;

-- Vista de pacientes completa
CREATE OR REPLACE VIEW vista_pacientes_completos AS
SELECT
    p.id,
    p.id_usuario,
    u.nombre_completo,
    u.curp,
    u.rfc,
    u.email1,
    u.telefono1,
    u.whatsapp,
    p.fecha_nacimiento,
    EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) AS edad,
    p.sexo,
    p.direccion_completa,
    p.ocupacion,
    p.nombre_tutor,
    tp.nombre_tipo AS tipo_paciente,
    s.nombre AS sucursal_frecuente,
    n.gentilicio AS nacionalidad,
    n.pais,
    COUNT(DISTINCT c.id) AS total_citas,
    MAX(c.fecha_cita) AS ultima_cita,
    p.activo,
    p.created_at,
    p.updated_at
FROM pacientes p
JOIN usuarios u ON p.id_usuario = u.id
JOIN cat_tipos_paciente tp ON p.id_tipo_paciente = tp.id
JOIN cat_nacionalidades n ON u.id_nacionalidad = n.id
LEFT JOIN cat_sucursales s ON p.id_sucursal_frecuente = s.id
LEFT JOIN citas c ON p.id = c.id_paciente
GROUP BY p.id, u.id, tp.nombre_tipo, s.nombre, n.gentilicio, n.pais;

-- Vista de empleados completa
CREATE OR REPLACE VIEW vista_empleados_completos AS
SELECT
    e.id,
    e.id_usuario,
    u.nombre_completo,
    u.email1,
    u.telefono1,
    u.whatsapp,
    r.nombre_rol AS rol,
    e.cedula_profesional,
    e.especialidad_principal,
    e.biografia_resumen,
    e.foto_perfil_url,
    s.nombre AS sucursal_asignada,
    s.direccion AS direccion_sucursal,
    STRING_AGG(DISTINCT esp.nombre_especialidad, ', ') AS especialidades,
    COUNT(DISTINCT c.id) AS total_citas_atendidas,
    e.activo,
    e.created_at
FROM empleados e
JOIN usuarios u ON e.id_usuario = u.id
JOIN cat_roles r ON u.id_rol = r.id
JOIN cat_sucursales s ON e.id_sucursal_asignada = s.id
LEFT JOIN empleado_especialidades ee ON e.id = ee.id_empleado
LEFT JOIN cat_especialidades esp ON ee.id_especialidad = esp.id
LEFT JOIN citas c ON e.id = c.id_doctor
GROUP BY e.id, u.id, r.nombre_rol, s.nombre, s.direccion;

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Tipos de pacientes
INSERT INTO cat_tipos_paciente (nombre_tipo, descripcion) VALUES
('Regular', 'Paciente con visitas recurrentes'),
('Pediátrico', 'Paciente menor de edad'),
('Primera Vez', 'Paciente que visita por primera vez');

-- Tipos de antecedentes
INSERT INTO cat_tipos_antecedentes (nombre_categoria) VALUES
('Heredofamiliares'),
('Antecedentes Patológicos'),
('Antecedentes No Patológicos'),
('Alergias y Reacciones'),
('Intervenciones Quirúrgicas');

-- Sucursales
INSERT INTO cat_sucursales (
    nombre, direccion, telefono_contacto1, telefono_contacto2,
    whatsapp, email, url_google_maps, hora_apertura,
    hora_cierre, foto_url, activa
) VALUES
(
    'Pénjamo',
    'Calle primero de mayo #9, Pénjamo Gto',
    '4611234567',
    NULL,
    '524611234567',
    'penjamo@dentalwhite.com',
    'https://maps.app.goo.gl/penjamo',
    '09:00:00',
    '18:00:00',
    NULL,
    TRUE
),
(
    'Valle de Santiago',
    'Centro, Valle de Santiago Gto',
    '4619876543',
    NULL,
    '524619876543',
    'valle@dentalwhite.com',
    'https://maps.app.goo.gl/valle',
    '09:00:00',
    '18:00:00',
    NULL,
    TRUE
),
(
    'Abasolo',
    'Abasolo Gto',
    '4615551234',
    NULL,
    '524615551234',
    'abasolo@dentalwhite.com',
    'https://maps.app.goo.gl/abasolo',
    '10:00:00',
    '19:00:00',
    NULL,
    TRUE
);

-- Nacionalidades
INSERT INTO cat_nacionalidades (codigo_iso, gentilicio, pais) VALUES
('MEX', 'Mexicana', 'México'),
('USA', 'Estadounidense', 'Estados Unidos'),
('CAN', 'Canadiense', 'Canadá'),
('ESP', 'Española', 'España'),
('COL', 'Colombiana', 'Colombia'),
('ARG', 'Argentina', 'Argentina'),
('VEN', 'Venezolana', 'Venezuela'),
('GTM', 'Guatemalteca', 'Guatemala');

-- Roles
INSERT INTO cat_roles (nombre_rol, descripcion) VALUES
('Admin', 'Control total del sistema y gestión de usuarios'),
('Doctor', 'Acceso a expedientes clínicos y gestión de citas'),
('Recepcionista', 'Gestión de agenda, cobros y registro de pacientes'),
('Paciente', 'Acceso a su propio historial y consulta de citas');

-- Especialidades
INSERT INTO cat_especialidades (nombre_especialidad, descripcion) VALUES
('Odontología General', 'Atención odontológica general'),
('Ortodoncia', 'Corrección de posición dental'),
('Endodoncia', 'Tratamiento de conductos'),
('Estética Dental', 'Diseño de sonrisa y blanqueamiento'),
('Odontopediatría', 'Atención dental infantil'),
('Periodoncia', 'Tratamiento de encías'),
('Cirugía Maxilofacial', 'Cirugía oral y maxilofacial'),
('Implantología', 'Colocación de implantes dentales');

-- Servicios
INSERT INTO cat_servicios (id_especialidad, nombre_servicio, descripcion, costo_base, duracion_estimada, requiere_fotos) VALUES
(1, 'Limpieza Dental', 'Profilaxis y limpieza profesional', 500.00, '00:45:00', FALSE),
(2, 'Ajuste de Brackets', 'Ajuste de ortodoncia', 800.00, '00:30:00', TRUE),
(3, 'Endodoncia Unirradicular', 'Tratamiento de conducto simple', 2500.00, '01:30:00', TRUE),
(4, 'Blanqueamiento Láser', 'Blanqueamiento dental con tecnología láser', 3500.00, '01:00:00', TRUE),
(5, 'Revisión Pediátrica', 'Revisión dental para niños', 300.00, '00:30:00', FALSE),
(6, 'Extracción Dental', 'Extracción de pieza dental', 800.00, '00:45:00', FALSE),
(7, 'Diseño de Sonrisa', 'Planificación estética de sonrisa', 5000.00, '02:00:00', TRUE);

-- Medios de contacto
INSERT INTO cat_medios_contacto (nombre_medio) VALUES
('Página Web'),
('WhatsApp'),
('Teléfono'),
('Presencial');

-- Estados de cita
INSERT INTO cat_estados_cita (nombre_estado, descripcion, color) VALUES
('Pendiente', 'Cita pendiente de confirmación', '#FFA500'),
('Confirmada', 'Cita confirmada por el paciente', '#4CAF50'),
('Atendida', 'Cita atendida y completada', '#2196F3'),
('Cancelada', 'Cita cancelada', '#F44336'),
('No asistió', 'Paciente no asistió a la cita', '#9E9E9E');

-- Usuarios de ejemplo (contraseña encriptada: "Password123")
INSERT INTO usuarios (
    nombre_completo, curp, rfc, id_nacionalidad, id_rol,
    email1, telefono1, whatsapp, passwd_encript, activo
) VALUES
-- Dr. Faustino Vázquez Rodríguez
('Dr. Faustino Vázquez Rodríguez', 'VARF700512HDFZRR01', 'VARF700512P87', 1, 2,
'faustino.vazquez@dentalwhite.com', '5511223344', '525511223344',
'$2a$10$examplehash1', TRUE),
-- Recepcionista
('Laura Sánchez Meza', 'SAML850314MDFNZZ02', 'SAML850314H45', 1, 3,
'laura.recepcion@dentalwhite.com', '5522334455', '525522334455',
'$2a$10$examplehash2', TRUE),
-- Administrador
('Admin Principal', NULL, NULL, 1, 1,
'admin@dentalwhite.com', '5500000000', '525500000000',
'$2a$10$examplehash3', TRUE),
-- Pacientes
('Juan Pérez Soto', 'PESJ940520HDFRZZ03', 'PESJ940520A12', 1, 4,
'paciente@example.com', '5512345678', '525512345678',
'$2a$10$examplehash4', TRUE),
('Ana Rodríguez Luna', 'ROLA810215MDFDZZ04', 'ROLA810215L45', 1, 4,
'ana.rodriguez@example.com', '5534567890', '525534567890',
'$2a$10$examplehash5', TRUE);

-- Empleados
INSERT INTO empleados (
    id_usuario, id_sucursal_asignada, cedula_profesional,
    especialidad_principal, biografia_resumen, activo
) VALUES
(1, 1, 'P8708', 'Estética Dental',
'Especialista en diseño de sonrisa con más de 20 años de experiencia. Certificado en blanqueamiento láser y carillas dentales.', TRUE),
(2, 1, NULL, 'Recepción',
'Atención personalizada y gestión eficiente de citas', TRUE),
(3, 1, NULL, 'Administración',
'Gestión administrativa del sistema', TRUE);

-- Especialidades de empleados
INSERT INTO empleado_especialidades (id_empleado, id_especialidad) VALUES
(1, 1), -- Dr. Faustino: Odontología General
(1, 4); -- Dr. Faustino: Estética Dental

-- Especialidades por sucursal
INSERT INTO sucursal_especialidades (id_sucursal, id_especialidad) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Pénjamo: todas
(2, 1), (2, 4), (2, 7), (2, 8),         -- Valle: General, Estética, Cirugía, Implantes
(3, 1), (3, 5);                          -- Abasolo: General, Odontopediatría

-- Pacientes
INSERT INTO pacientes (
    id_usuario, id_tipo_paciente, id_sucursal_frecuente,
    fecha_nacimiento, sexo, direccion_completa, ocupacion, nombre_tutor
) VALUES
(4, 1, 1, '1994-05-20', 'Masculino', 'Calle Juárez 10, Pénjamo, Gto', 'Contador', NULL),
(5, 3, 1, '1981-02-15', 'Femenino', 'Calle Norte 789, Valle de Santiago, Gto', 'Docente', NULL);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

COMMENT ON DATABASE CURRENT_DATABASE() IS 'Sistema de Gestión Dental - Dental White v3.0';
