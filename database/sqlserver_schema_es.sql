-- ============================================
-- DENTAL WHITE - Esquema SQL Server
-- Sistema de Gestión Dental
-- VERSION: 2.0 - Todo en Español con Catálogos
-- ============================================

USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DentalWhite')
BEGIN
    CREATE DATABASE DentalWhite;
END
GO

USE DentalWhite;
GO

-- Eliminar tablas existentes (en orden inverso de dependencias)
IF OBJECT_ID('dbo.historial_citas', 'U') IS NOT NULL DROP TABLE dbo.historial_citas;
IF OBJECT_ID('dbo.pagos', 'U') IS NOT NULL DROP TABLE dbo.pagos;
IF OBJECT_ID('dbo.expedientes_medicos', 'U') IS NOT NULL DROP TABLE dbo.expedientes_medicos;
IF OBJECT_ID('dbo.citas', 'U') IS NOT NULL DROP TABLE dbo.citas;
IF OBJECT_ID('dbo.dias_bloqueados', 'U') IS NOT NULL DROP TABLE dbo.dias_bloqueados;
IF OBJECT_ID('dbo.horarios_bloqueados', 'U') IS NOT NULL DROP TABLE dbo.horarios_bloqueados;
IF OBJECT_ID('dbo.pacientes', 'U') IS NOT NULL DROP TABLE dbo.pacientes;
IF OBJECT_ID('dbo.empleados', 'U') IS NOT NULL DROP TABLE dbo.empleados;
IF OBJECT_ID('dbo.servicios', 'U') IS NOT NULL DROP TABLE dbo.servicios;
IF OBJECT_ID('dbo.centros_trabajo', 'U') IS NOT NULL DROP TABLE dbo.centros_trabajo;
IF OBJECT_ID('dbo.usuarios', 'U') IS NOT NULL DROP TABLE dbo.usuarios;

-- Catálogos
IF OBJECT_ID('dbo.cat_roles', 'U') IS NOT NULL DROP TABLE dbo.cat_roles;
IF OBJECT_ID('dbo.cat_estados_cita', 'U') IS NOT NULL DROP TABLE dbo.cat_estados_cita;
IF OBJECT_ID('dbo.cat_tipos_pago', 'U') IS NOT NULL DROP TABLE dbo.cat_tipos_pago;
IF OBJECT_ID('dbo.cat_metodos_pago', 'U') IS NOT NULL DROP TABLE dbo.cat_metodos_pago;
IF OBJECT_ID('dbo.cat_estados_empleado', 'U') IS NOT NULL DROP TABLE dbo.cat_estados_empleado;
IF OBJECT_ID('dbo.cat_tipos_paciente', 'U') IS NOT NULL DROP TABLE dbo.cat_tipos_paciente;
IF OBJECT_ID('dbo.cat_sexos', 'U') IS NOT NULL DROP TABLE dbo.cat_sexos;
IF OBJECT_ID('dbo.cat_estados_fisicos', 'U') IS NOT NULL DROP TABLE dbo.cat_estados_fisicos;
GO

-- ============================================
-- CATÁLOGOS
-- ============================================

-- Catálogo de Roles
CREATE TABLE dbo.cat_roles (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre_rol NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_roles (nombre_rol, descripcion) VALUES
(N'paciente', N'Usuario paciente con acceso limitado a su información'),
(N'recepcionista', N'Personal de recepción con acceso a gestión de citas'),
(N'medico', N'Médico con acceso completo a expedientes y citas'),
(N'administrador', N'Administrador con acceso total al sistema');
GO

-- Catálogo de Estados de Cita
CREATE TABLE dbo.cat_estados_cita (
    id_estado_cita INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    color NVARCHAR(20),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_estados_cita (nombre_estado, descripcion, color) VALUES
(N'agendada', N'Cita agendada pendiente de confirmación', N'#FFA500'),
(N'confirmada', N'Cita confirmada por el paciente', N'#4CAF50'),
(N'completada', N'Cita realizada y completada', N'#2196F3'),
(N'cancelada', N'Cita cancelada', N'#F44336'),
(N'no_asistio', N'Paciente no asistió a la cita', N'#9E9E9E');
GO

-- Catálogo de Tipos de Pago
CREATE TABLE dbo.cat_tipos_pago (
    id_tipo_pago INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_tipos_pago (nombre_tipo, descripcion) VALUES
(N'completo', N'Pago completo del servicio'),
(N'a_cuotas', N'Pago dividido en varias cuotas');
GO

-- Catálogo de Métodos de Pago
CREATE TABLE dbo.cat_metodos_pago (
    id_metodo_pago INT IDENTITY(1,1) PRIMARY KEY,
    nombre_metodo NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_metodos_pago (nombre_metodo, descripcion) VALUES
(N'efectivo', N'Pago en efectivo'),
(N'tarjeta', N'Pago con tarjeta de crédito o débito'),
(N'transferencia', N'Transferencia bancaria'),
(N'otro', N'Otro método de pago');
GO

-- Catálogo de Estados de Empleado
CREATE TABLE dbo.cat_estados_empleado (
    id_estado_empleado INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_estados_empleado (nombre_estado, descripcion) VALUES
(N'activo', N'Empleado activo trabajando'),
(N'inactivo', N'Empleado inactivo temporalmente'),
(N'permiso', N'Empleado en período de permiso');
GO

-- Catálogo de Tipos de Paciente
CREATE TABLE dbo.cat_tipos_paciente (
    id_tipo_paciente INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_tipos_paciente (nombre_tipo, descripcion) VALUES
(N'primera_vez', N'Paciente que visita por primera vez'),
(N'regular', N'Paciente con visitas recurrentes'),
(N'pediatrico', N'Paciente pediátrico (menor de edad)');
GO

-- Catálogo de Sexos
CREATE TABLE dbo.cat_sexos (
    id_sexo INT IDENTITY(1,1) PRIMARY KEY,
    nombre_sexo NVARCHAR(20) UNIQUE NOT NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_sexos (nombre_sexo) VALUES
(N'Masculino'),
(N'Femenino'),
(N'Otro');
GO

-- Catálogo de Estados Físicos/Dentales
CREATE TABLE dbo.cat_estados_fisicos (
    id_estado_fisico INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado NVARCHAR(20) UNIQUE NOT NULL,
    descripcion NVARCHAR(MAX),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO dbo.cat_estados_fisicos (nombre_estado, descripcion) VALUES
(N'bueno', N'Estado bueno'),
(N'regular', N'Estado regular'),
(N'malo', N'Estado malo o deficiente');
GO

-- ============================================
-- TABLA: usuarios
-- Gestión de autenticación y acceso
-- ============================================
CREATE TABLE dbo.usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    correo_electronico NVARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash NVARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    nombre_completo NVARCHAR(255) NOT NULL,
    esta_activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE(),
    ultimo_acceso DATETIME2,
    CONSTRAINT FK_usuarios_roles FOREIGN KEY (id_rol) REFERENCES dbo.cat_roles(id_rol)
);
GO

CREATE INDEX idx_usuarios_correo ON dbo.usuarios(correo_electronico);
CREATE INDEX idx_usuarios_rol ON dbo.usuarios(id_rol);
GO

-- ============================================
-- TABLA: centros_trabajo
-- Sucursales de la clínica
-- ============================================
CREATE TABLE dbo.centros_trabajo (
    id_centro INT IDENTITY(1,1) PRIMARY KEY,
    nombre_centro NVARCHAR(100) NOT NULL,
    direccion NVARCHAR(MAX) NOT NULL,
    telefono NVARCHAR(20),
    correo_electronico NVARCHAR(255),
    esta_activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE()
);
GO

CREATE INDEX idx_centros_nombre ON dbo.centros_trabajo(nombre_centro);
GO

-- ============================================
-- TABLA: servicios
-- Servicios odontológicos por sucursal
-- ============================================
CREATE TABLE dbo.servicios (
    id_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX),
    sucursal NVARCHAR(100) NOT NULL,
    duracion_minutos INT DEFAULT 60,
    esta_activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE()
);
GO

CREATE INDEX idx_servicios_sucursal ON dbo.servicios(sucursal);
CREATE INDEX idx_servicios_activo ON dbo.servicios(esta_activo);
GO

-- ============================================
-- TABLA: empleados
-- Empleados de la clínica
-- ============================================
CREATE TABLE dbo.empleados (
    id_empleado INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    codigo_empleado NVARCHAR(50) UNIQUE,
    especialidad NVARCHAR(255),
    id_centro INT,
    fecha_contratacion DATE NOT NULL,
    id_estado INT DEFAULT 1,
    telefono NVARCHAR(20),
    contacto_emergencia NVARCHAR(255),
    telefono_emergencia NVARCHAR(20),
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_empleados_usuarios FOREIGN KEY (id_usuario) REFERENCES dbo.usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_empleados_centros FOREIGN KEY (id_centro) REFERENCES dbo.centros_trabajo(id_centro),
    CONSTRAINT FK_empleados_estados FOREIGN KEY (id_estado) REFERENCES dbo.cat_estados_empleado(id_estado_empleado)
);
GO

CREATE INDEX idx_empleados_usuario ON dbo.empleados(id_usuario);
CREATE INDEX idx_empleados_centro ON dbo.empleados(id_centro);
CREATE INDEX idx_empleados_estado ON dbo.empleados(id_estado);
GO

-- ============================================
-- TABLA: pacientes
-- Pacientes de la clínica
-- ============================================
CREATE TABLE dbo.pacientes (
    id_paciente INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    codigo_paciente NVARCHAR(50) UNIQUE,
    nombre_completo NVARCHAR(255) NOT NULL,
    correo_electronico NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(20) NOT NULL,
    edad INT,
    id_sexo INT,
    direccion NVARCHAR(MAX),
    colonia NVARCHAR(255),
    delegacion NVARCHAR(255),
    municipio NVARCHAR(255),
    codigo_postal NVARCHAR(10),
    tutor NVARCHAR(255),
    ocupacion NVARCHAR(255),
    id_tipo_paciente INT DEFAULT 1,
    es_nuevo BIT DEFAULT 1,
    fecha_registro DATE DEFAULT CAST(GETDATE() AS DATE),
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_pacientes_usuarios FOREIGN KEY (id_usuario) REFERENCES dbo.usuarios(id_usuario) ON DELETE SET NULL,
    CONSTRAINT FK_pacientes_sexos FOREIGN KEY (id_sexo) REFERENCES dbo.cat_sexos(id_sexo),
    CONSTRAINT FK_pacientes_tipos FOREIGN KEY (id_tipo_paciente) REFERENCES dbo.cat_tipos_paciente(id_tipo_paciente)
);
GO

CREATE INDEX idx_pacientes_usuario ON dbo.pacientes(id_usuario);
CREATE INDEX idx_pacientes_correo ON dbo.pacientes(correo_electronico);
CREATE INDEX idx_pacientes_telefono ON dbo.pacientes(telefono);
CREATE INDEX idx_pacientes_nombre ON dbo.pacientes(nombre_completo);
CREATE INDEX idx_pacientes_codigo ON dbo.pacientes(codigo_paciente);
GO

-- ============================================
-- TABLA: citas
-- Citas médicas
-- ============================================
CREATE TABLE dbo.citas (
    id_cita INT IDENTITY(1,1) PRIMARY KEY,
    codigo_cita NVARCHAR(50) UNIQUE,
    id_paciente INT NOT NULL,
    id_servicio INT NOT NULL,
    id_centro INT NOT NULL,
    id_medico INT,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    id_estado INT DEFAULT 1,

    -- Información de pago
    precio_servicio DECIMAL(10, 2),
    monto_pagado DECIMAL(10, 2) DEFAULT 0,
    id_tipo_pago INT,
    numero_pagos INT DEFAULT 1,
    pago_actual INT DEFAULT 1,

    -- Notas y observaciones
    notas NVARCHAR(MAX),
    motivo_cancelacion NVARCHAR(MAX),

    -- Confirmaciones enviadas
    correo_enviado BIT DEFAULT 0,
    whatsapp_enviado BIT DEFAULT 0,

    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE(),
    fecha_confirmacion DATETIME2,
    fecha_completada DATETIME2,
    fecha_cancelacion DATETIME2,

    CONSTRAINT FK_citas_pacientes FOREIGN KEY (id_paciente) REFERENCES dbo.pacientes(id_paciente) ON DELETE CASCADE,
    CONSTRAINT FK_citas_servicios FOREIGN KEY (id_servicio) REFERENCES dbo.servicios(id_servicio),
    CONSTRAINT FK_citas_centros FOREIGN KEY (id_centro) REFERENCES dbo.centros_trabajo(id_centro),
    CONSTRAINT FK_citas_medicos FOREIGN KEY (id_medico) REFERENCES dbo.empleados(id_empleado),
    CONSTRAINT FK_citas_estados FOREIGN KEY (id_estado) REFERENCES dbo.cat_estados_cita(id_estado_cita),
    CONSTRAINT FK_citas_tipos_pago FOREIGN KEY (id_tipo_pago) REFERENCES dbo.cat_tipos_pago(id_tipo_pago)
);
GO

CREATE INDEX idx_citas_paciente ON dbo.citas(id_paciente);
CREATE INDEX idx_citas_medico ON dbo.citas(id_medico);
CREATE INDEX idx_citas_fecha ON dbo.citas(fecha_cita);
CREATE INDEX idx_citas_estado ON dbo.citas(id_estado);
CREATE INDEX idx_citas_centro ON dbo.citas(id_centro);
CREATE INDEX idx_citas_fecha_hora ON dbo.citas(fecha_cita, hora_cita);
GO

-- ============================================
-- TABLA: pagos
-- Registro de pagos
-- ============================================
CREATE TABLE dbo.pagos (
    id_pago INT IDENTITY(1,1) PRIMARY KEY,
    id_cita INT NOT NULL,
    id_paciente INT NOT NULL,
    numero_pago INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE DEFAULT CAST(GETDATE() AS DATE),
    id_metodo_pago INT,
    numero_recibo NVARCHAR(100),
    notas NVARCHAR(MAX),
    id_creador INT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_pagos_citas FOREIGN KEY (id_cita) REFERENCES dbo.citas(id_cita) ON DELETE CASCADE,
    CONSTRAINT FK_pagos_pacientes FOREIGN KEY (id_paciente) REFERENCES dbo.pacientes(id_paciente),
    CONSTRAINT FK_pagos_metodos FOREIGN KEY (id_metodo_pago) REFERENCES dbo.cat_metodos_pago(id_metodo_pago),
    CONSTRAINT FK_pagos_empleados FOREIGN KEY (id_creador) REFERENCES dbo.empleados(id_empleado)
);
GO

CREATE INDEX idx_pagos_cita ON dbo.pagos(id_cita);
CREATE INDEX idx_pagos_paciente ON dbo.pagos(id_paciente);
CREATE INDEX idx_pagos_fecha ON dbo.pagos(fecha_pago);
GO

-- ============================================
-- TABLA: expedientes_medicos
-- Expedientes médicos digitales
-- ============================================
CREATE TABLE dbo.expedientes_medicos (
    id_expediente INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente INT UNIQUE NOT NULL,
    numero_expediente NVARCHAR(50) UNIQUE,

    -- Información personal
    direccion NVARCHAR(MAX),
    telefono NVARCHAR(20),
    ocupacion NVARCHAR(255),
    edad INT,
    referencia NVARCHAR(255),
    id_sexo INT,
    colonia NVARCHAR(255),
    delegacion NVARCHAR(255),
    codigo_postal NVARCHAR(10),
    tutor NVARCHAR(255),

    -- Información del médico
    id_medico_asignado INT,

    -- Historia Clínica
    id_estado_fisico INT,
    id_estado_dental INT,

    -- Antecedentes Patológicos (JSON)
    antecedentes_patologicos NVARCHAR(MAX),

    -- Antecedentes No Patológicos (JSON)
    antecedentes_no_patologicos NVARCHAR(MAX),

    -- Hábitos
    frecuencia_habito NVARCHAR(100),
    duracion_habito NVARCHAR(100),
    intensidad_habito NVARCHAR(100),
    recibio_atencion_medica BIT DEFAULT 0,
    motivo_atencion_medica NVARCHAR(MAX),

    -- Examen de la Cara (JSON)
    examen_cara NVARCHAR(MAX),

    -- Línea de Holdaway (JSON)
    linea_holdaway NVARCHAR(MAX),

    -- Examen Bucal (JSON)
    examen_bucal NVARCHAR(MAX),

    -- Examen Radiográfico (JSON)
    examen_radiografico NVARCHAR(MAX),

    -- Firmas (Base64)
    firma_paciente NVARCHAR(MAX),
    firma_tutor_legal NVARCHAR(MAX),

    -- Observaciones
    observaciones NVARCHAR(MAX),

    -- Fechas
    fecha_inicio DATE,
    fecha_fin DATE,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_expedientes_pacientes FOREIGN KEY (id_paciente) REFERENCES dbo.pacientes(id_paciente) ON DELETE CASCADE,
    CONSTRAINT FK_expedientes_medicos FOREIGN KEY (id_medico_asignado) REFERENCES dbo.empleados(id_empleado),
    CONSTRAINT FK_expedientes_sexos FOREIGN KEY (id_sexo) REFERENCES dbo.cat_sexos(id_sexo),
    CONSTRAINT FK_expedientes_estado_fisico FOREIGN KEY (id_estado_fisico) REFERENCES dbo.cat_estados_fisicos(id_estado_fisico),
    CONSTRAINT FK_expedientes_estado_dental FOREIGN KEY (id_estado_dental) REFERENCES dbo.cat_estados_fisicos(id_estado_fisico)
);
GO

CREATE INDEX idx_expedientes_paciente ON dbo.expedientes_medicos(id_paciente);
CREATE INDEX idx_expedientes_medico ON dbo.expedientes_medicos(id_medico_asignado);
GO

-- ============================================
-- TABLA: historial_citas
-- Historial de citas en expedientes
-- ============================================
CREATE TABLE dbo.historial_citas (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_expediente INT NOT NULL,
    numero_cita INT NOT NULL,
    fecha_cita DATE NOT NULL,
    actividad NVARCHAR(MAX) NOT NULL,
    nombre_medico NVARCHAR(255) NOT NULL,
    notas NVARCHAR(MAX),
    fecha_creacion DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_historial_expedientes FOREIGN KEY (id_expediente) REFERENCES dbo.expedientes_medicos(id_expediente) ON DELETE CASCADE
);
GO

CREATE INDEX idx_historial_expediente ON dbo.historial_citas(id_expediente);
CREATE INDEX idx_historial_fecha ON dbo.historial_citas(fecha_cita);
GO

-- ============================================
-- TABLA: dias_bloqueados
-- Días bloqueados para citas
-- ============================================
CREATE TABLE dbo.dias_bloqueados (
    id_bloqueo INT IDENTITY(1,1) PRIMARY KEY,
    fecha_bloqueada DATE NOT NULL,
    id_centro INT,
    motivo NVARCHAR(255),
    es_festivo BIT DEFAULT 0,
    id_bloqueador INT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_dias_bloqueados_centros FOREIGN KEY (id_centro) REFERENCES dbo.centros_trabajo(id_centro),
    CONSTRAINT FK_dias_bloqueados_empleados FOREIGN KEY (id_bloqueador) REFERENCES dbo.empleados(id_empleado)
);
GO

CREATE INDEX idx_dias_bloqueados_fecha ON dbo.dias_bloqueados(fecha_bloqueada);
CREATE INDEX idx_dias_bloqueados_centro ON dbo.dias_bloqueados(id_centro);
GO

-- ============================================
-- TABLA: horarios_bloqueados
-- Horarios bloqueados para citas
-- ============================================
CREATE TABLE dbo.horarios_bloqueados (
    id_horario_bloqueado INT IDENTITY(1,1) PRIMARY KEY,
    fecha_bloqueada DATE NOT NULL,
    hora_bloqueada TIME NOT NULL,
    id_centro INT,
    motivo NVARCHAR(255),
    id_bloqueador INT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_horarios_bloqueados_centros FOREIGN KEY (id_centro) REFERENCES dbo.centros_trabajo(id_centro),
    CONSTRAINT FK_horarios_bloqueados_empleados FOREIGN KEY (id_bloqueador) REFERENCES dbo.empleados(id_empleado)
);
GO

CREATE INDEX idx_horarios_bloqueados_fecha_hora ON dbo.horarios_bloqueados(fecha_bloqueada, hora_bloqueada);
CREATE INDEX idx_horarios_bloqueados_centro ON dbo.horarios_bloqueados(id_centro);
GO

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Insertar sucursales
INSERT INTO dbo.centros_trabajo (nombre_centro, direccion, telefono, correo_electronico) VALUES
(N'Pénjamo', N'Calle primero de mayo #9, Pénjamo Gto', N'4611234567', N'penjamo@dentalwhite.com'),
(N'Valle de Santiago', N'Centro, Valle de Santiago Gto', N'4619876543', N'valle@dentalwhite.com'),
(N'Abasolo', N'Abasolo Gto', N'4615551234', N'abasolo@dentalwhite.com');
GO

-- Insertar servicios por sucursal
INSERT INTO dbo.servicios (nombre_servicio, descripcion, sucursal, duracion_minutos) VALUES
(N'Limpieza Dental', N'Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales', N'Pénjamo', 60),
(N'Ortodoncia', N'Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal.', N'Pénjamo', 90),
(N'Endodoncia', N'Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material.', N'Pénjamo', 120),
(N'Extracción', N'Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia.', N'Pénjamo', 45),
(N'Blanqueamiento', N'Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas.', N'Pénjamo', 90),
(N'Prótesis Dentales', N'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', N'Pénjamo', 120),
(N'Revisión General', N'Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor.', N'Pénjamo', 30);
GO

INSERT INTO dbo.servicios (nombre_servicio, descripcion, sucursal, duracion_minutos) VALUES
(N'Prótesis Dentales', N'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', N'Valle de Santiago', 120),
(N'Implantes Dentales', N'Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental.', N'Valle de Santiago', 180),
(N'Cirugía Maxilofacial', N'Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial.', N'Valle de Santiago', 150),
(N'Periodoncia', N'Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis.', N'Valle de Santiago', 90);
GO

INSERT INTO dbo.servicios (nombre_servicio, descripcion, sucursal, duracion_minutos) VALUES
(N'Odontopediatría', N'Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad.', N'Abasolo', 60),
(N'Diseño de Sonrisa', N'Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental.', N'Abasolo', 120),
(N'Coronas y Puentes', N'Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa.', N'Abasolo', 120),
(N'Rehabilitación Oral', N'Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca.', N'Abasolo', 150);
GO

-- Insertar usuarios
INSERT INTO dbo.usuarios (correo_electronico, contrasena_hash, id_rol, nombre_completo) VALUES
(N'admin@dentalwhite.com', N'$2a$10$example_hash_admin', 4, N'Administrador Principal'),
(N'recepcion@dentalwhite.com', N'$2a$10$example_hash_reception', 2, N'María González'),
(N'doctor@dentalwhite.com', N'$2a$10$example_hash_doctor', 3, N'Dr. Carlos Méndez'),
(N'laura.sanchez@dentalwhite.com', N'$2a$10$example_hash_doctor2', 3, N'Dra. Laura Sánchez'),
(N'paciente@example.com', N'$2a$10$example_hash_patient', 1, N'Juan Pérez');
GO

-- Insertar empleados
INSERT INTO dbo.empleados (id_usuario, codigo_empleado, especialidad, id_centro, fecha_contratacion, telefono) VALUES
(1, N'ADMIN001', NULL, 1, '2025-01-01', N'5500000000'),
(2, N'RECEP001', NULL, 1, '2025-03-01', N'5511111111'),
(3, N'DOC001', N'Odontología General', 1, '2025-02-01', N'5522222222'),
(4, N'DOC002', N'Endodoncia', 2, '2025-04-01', N'5533333333');
GO

-- Insertar pacientes
INSERT INTO dbo.pacientes (codigo_paciente, nombre_completo, correo_electronico, telefono, edad, id_sexo, direccion, colonia, delegacion, municipio, ocupacion, id_tipo_paciente, es_nuevo, fecha_registro, id_usuario) VALUES
(N'PAT001', N'Juan Pérez', N'paciente@example.com', N'5512345678', 32, 1, N'Calle Principal 123', N'Centro', N'Cuauhtémoc', N'Cuauhtémoc', N'Ingeniero', 2, 0, '2026-01-15', 5),
(N'PAT002', N'María López', N'maria.lopez@example.com', N'5523456789', 28, 2, N'Av. Reforma 456', N'Polanco', N'Miguel Hidalgo', N'Miguel Hidalgo', N'Diseñadora', 2, 0, '2026-01-20', NULL),
(N'PAT003', N'Ana Rodríguez', N'ana.rodriguez@example.com', N'5534567890', 45, 2, N'Calle Norte 789', N'Del Valle', N'Benito Juárez', N'Benito Juárez', N'Abogada', 1, 0, '2026-02-01', NULL),
(N'PAT004', N'Carlos Martínez', N'carlos.martinez@example.com', N'5545678901', 12, 1, N'Calle Sur 321', N'Coyoacán', N'Coyoacán', N'Coyoacán', N'Estudiante', 3, 0, '2026-02-05', NULL);
GO

-- Insertar citas
INSERT INTO dbo.citas (codigo_cita, id_paciente, id_servicio, id_centro, id_medico, fecha_cita, hora_cita, id_estado, precio_servicio, monto_pagado, id_tipo_pago) VALUES
(N'APT001', 1, 1, 1, 3, '2026-03-20', '10:00', 1, 500.00, 500.00, 1),
(N'APT002', 2, 7, 1, 3, '2026-03-20', '11:00', 2, 300.00, 300.00, 1),
(N'APT003', 3, 3, 1, 3, '2026-03-21', '14:00', 1, 1500.00, 500.00, 2),
(N'APT004', 4, 2, 1, 3, '2026-03-21', '09:00', 2, 15000.00, 5000.00, 2);
GO

UPDATE dbo.citas SET numero_pagos = 3, pago_actual = 1 WHERE id_cita = 3;
UPDATE dbo.citas SET numero_pagos = 3, pago_actual = 1 WHERE id_cita = 4;
GO

-- ============================================
-- TRIGGERS PARA ACTUALIZAR fecha_actualizacion
-- ============================================

CREATE TRIGGER trg_usuarios_actualizacion
ON dbo.usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.usuarios
    SET fecha_actualizacion = GETDATE()
    FROM dbo.usuarios u
    INNER JOIN inserted i ON u.id_usuario = i.id_usuario;
END;
GO

CREATE TRIGGER trg_centros_actualizacion
ON dbo.centros_trabajo
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.centros_trabajo
    SET fecha_actualizacion = GETDATE()
    FROM dbo.centros_trabajo c
    INNER JOIN inserted i ON c.id_centro = i.id_centro;
END;
GO

CREATE TRIGGER trg_servicios_actualizacion
ON dbo.servicios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.servicios
    SET fecha_actualizacion = GETDATE()
    FROM dbo.servicios s
    INNER JOIN inserted i ON s.id_servicio = i.id_servicio;
END;
GO

CREATE TRIGGER trg_empleados_actualizacion
ON dbo.empleados
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.empleados
    SET fecha_actualizacion = GETDATE()
    FROM dbo.empleados e
    INNER JOIN inserted i ON e.id_empleado = i.id_empleado;
END;
GO

CREATE TRIGGER trg_pacientes_actualizacion
ON dbo.pacientes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.pacientes
    SET fecha_actualizacion = GETDATE()
    FROM dbo.pacientes p
    INNER JOIN inserted i ON p.id_paciente = i.id_paciente;
END;
GO

CREATE TRIGGER trg_citas_actualizacion
ON dbo.citas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.citas
    SET fecha_actualizacion = GETDATE()
    FROM dbo.citas c
    INNER JOIN inserted i ON c.id_cita = i.id_cita;
END;
GO

CREATE TRIGGER trg_expedientes_actualizacion
ON dbo.expedientes_medicos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.expedientes_medicos
    SET fecha_actualizacion = GETDATE()
    FROM dbo.expedientes_medicos e
    INNER JOIN inserted i ON e.id_expediente = i.id_expediente;
END;
GO

-- ============================================
-- VISTAS ÚTILES
-- ============================================

CREATE VIEW vista_citas_completas AS
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
FROM dbo.citas c
JOIN dbo.pacientes p ON c.id_paciente = p.id_paciente
JOIN dbo.servicios s ON c.id_servicio = s.id_servicio
JOIN dbo.centros_trabajo ct ON c.id_centro = ct.id_centro
JOIN dbo.cat_estados_cita ec ON c.id_estado = ec.id_estado_cita
LEFT JOIN dbo.cat_tipos_pago tp ON c.id_tipo_pago = tp.id_tipo_pago
LEFT JOIN dbo.empleados e ON c.id_medico = e.id_empleado
LEFT JOIN dbo.usuarios u ON e.id_usuario = u.id_usuario;
GO

CREATE VIEW vista_pacientes_completos AS
SELECT
    p.id_paciente,
    p.codigo_paciente,
    p.nombre_completo,
    p.correo_electronico,
    p.telefono,
    p.edad,
    s.nombre_sexo,
    p.direccion,
    p.colonia,
    p.delegacion,
    p.municipio,
    p.codigo_postal,
    p.tutor,
    p.ocupacion,
    tp.nombre_tipo AS tipo_paciente,
    p.es_nuevo,
    p.fecha_registro,
    u.correo_electronico AS correo_usuario,
    u.esta_activo AS usuario_activo,
    COUNT(c.id_cita) AS total_citas,
    MAX(c.fecha_cita) AS fecha_ultima_cita
FROM dbo.pacientes p
LEFT JOIN dbo.cat_sexos s ON p.id_sexo = s.id_sexo
LEFT JOIN dbo.cat_tipos_paciente tp ON p.id_tipo_paciente = tp.id_tipo_paciente
LEFT JOIN dbo.usuarios u ON p.id_usuario = u.id_usuario
LEFT JOIN dbo.citas c ON p.id_paciente = c.id_paciente
GROUP BY
    p.id_paciente, p.codigo_paciente, p.nombre_completo, p.correo_electronico,
    p.telefono, p.edad, s.nombre_sexo, p.direccion, p.colonia, p.delegacion,
    p.municipio, p.codigo_postal, p.tutor, p.ocupacion, tp.nombre_tipo,
    p.es_nuevo, p.fecha_registro, u.correo_electronico, u.esta_activo;
GO

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Usuarios del sistema con autenticación',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'usuarios';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Sucursales de Dental White',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'centros_trabajo';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Servicios odontológicos por sucursal',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'servicios';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Empleados de la clínica',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'empleados';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Pacientes registrados',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'pacientes';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Citas médicas agendadas',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'citas';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Registro de pagos realizados',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'pagos';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Expedientes médicos digitales',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'expedientes_medicos';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Días bloqueados para agendar citas',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'dias_bloqueados';

EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Horarios específicos bloqueados',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'horarios_bloqueados';
GO

PRINT 'Base de datos DentalWhite creada exitosamente con esquema en español';
PRINT 'Tablas creadas: 19 (11 principales + 8 catálogos)';
PRINT 'Vistas creadas: 2';
PRINT 'Triggers creados: 7';
GO

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
