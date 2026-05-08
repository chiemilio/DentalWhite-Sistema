-- ============================================
-- DENTAL WHITE - SQL Server Database Schema
-- Sistema de Gestión Dental
-- ============================================

-- Configuración inicial
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

-- ============================================
-- Eliminar tablas existentes (en orden inverso de dependencias)
-- ============================================
IF OBJECT_ID('dbo.appointment_history', 'U') IS NOT NULL DROP TABLE dbo.appointment_history;
IF OBJECT_ID('dbo.payments', 'U') IS NOT NULL DROP TABLE dbo.payments;
IF OBJECT_ID('dbo.medical_records', 'U') IS NOT NULL DROP TABLE dbo.medical_records;
IF OBJECT_ID('dbo.appointments', 'U') IS NOT NULL DROP TABLE dbo.appointments;
IF OBJECT_ID('dbo.blocked_days', 'U') IS NOT NULL DROP TABLE dbo.blocked_days;
IF OBJECT_ID('dbo.blocked_time_slots', 'U') IS NOT NULL DROP TABLE dbo.blocked_time_slots;
IF OBJECT_ID('dbo.patients', 'U') IS NOT NULL DROP TABLE dbo.patients;
IF OBJECT_ID('dbo.employees', 'U') IS NOT NULL DROP TABLE dbo.employees;
IF OBJECT_ID('dbo.services', 'U') IS NOT NULL DROP TABLE dbo.services;
IF OBJECT_ID('dbo.work_centers', 'U') IS NOT NULL DROP TABLE dbo.work_centers;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
GO

-- ============================================
-- TABLA: users
-- Gestión de autenticación y roles
-- ============================================
CREATE TABLE dbo.users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('patient', 'receptionist', 'doctor', 'admin')),
    full_name NVARCHAR(255) NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    last_login DATETIME2
);
GO

CREATE INDEX idx_users_email ON dbo.users(email);
CREATE INDEX idx_users_role ON dbo.users(role);
GO

-- ============================================
-- TABLA: work_centers
-- Sucursales de la clínica
-- ============================================
CREATE TABLE dbo.work_centers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    phone NVARCHAR(20),
    email NVARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

CREATE INDEX idx_work_centers_name ON dbo.work_centers(name);
GO

-- ============================================
-- TABLA: services
-- Servicios odontológicos por sucursal
-- ============================================
CREATE TABLE dbo.services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    branch NVARCHAR(100) NOT NULL,
    duration_minutes INT DEFAULT 60,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

CREATE INDEX idx_services_branch ON dbo.services(branch);
CREATE INDEX idx_services_active ON dbo.services(is_active);
GO

-- ============================================
-- TABLA: employees
-- Empleados de la clínica
-- ============================================
CREATE TABLE dbo.employees (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    employee_code NVARCHAR(50) UNIQUE,
    specialty NVARCHAR(255),
    work_center_id INT,
    hire_date DATE NOT NULL,
    status NVARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    phone NVARCHAR(20),
    emergency_contact NVARCHAR(255),
    emergency_phone NVARCHAR(20),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_employees_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE,
    CONSTRAINT FK_employees_work_centers FOREIGN KEY (work_center_id) REFERENCES dbo.work_centers(id)
);
GO

CREATE INDEX idx_employees_user ON dbo.employees(user_id);
CREATE INDEX idx_employees_work_center ON dbo.employees(work_center_id);
CREATE INDEX idx_employees_status ON dbo.employees(status);
GO

-- ============================================
-- TABLA: patients
-- Pacientes de la clínica
-- ============================================
CREATE TABLE dbo.patients (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    patient_code NVARCHAR(50) UNIQUE,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    age INT,
    sex NVARCHAR(20) CHECK (sex IN ('Masculino', 'Femenino', 'Otro')),
    address NVARCHAR(MAX),
    colony NVARCHAR(255),
    delegation NVARCHAR(255),
    municipality NVARCHAR(255),
    postal_code NVARCHAR(10),
    tutor NVARCHAR(255),
    occupation NVARCHAR(255),
    patient_type NVARCHAR(50) DEFAULT 'Primera vez',
    is_new_patient BIT DEFAULT 1,
    registration_date DATE DEFAULT CAST(GETDATE() AS DATE),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_patients_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_patients_user ON dbo.patients(user_id);
CREATE INDEX idx_patients_email ON dbo.patients(email);
CREATE INDEX idx_patients_phone ON dbo.patients(phone);
CREATE INDEX idx_patients_name ON dbo.patients(name);
CREATE INDEX idx_patients_patient_code ON dbo.patients(patient_code);
GO

-- ============================================
-- TABLA: appointments
-- Citas médicas
-- ============================================
CREATE TABLE dbo.appointments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    appointment_code NVARCHAR(50) UNIQUE,
    patient_id INT NOT NULL,
    service_id INT NOT NULL,
    work_center_id INT NOT NULL,
    doctor_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status NVARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    
    -- Información de pago
    service_price DECIMAL(10, 2),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_type NVARCHAR(20) CHECK (payment_type IN ('complete', 'installment')),
    number_of_payments INT DEFAULT 1,
    current_payment INT DEFAULT 1,
    
    -- Notas y observaciones
    notes NVARCHAR(MAX),
    cancellation_reason NVARCHAR(MAX),
    
    -- Confirmaciones enviadas
    email_sent BIT DEFAULT 0,
    whatsapp_sent BIT DEFAULT 0,
    
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    confirmed_at DATETIME2,
    completed_at DATETIME2,
    cancelled_at DATETIME2,
    
    CONSTRAINT FK_appointments_patients FOREIGN KEY (patient_id) REFERENCES dbo.patients(id) ON DELETE CASCADE,
    CONSTRAINT FK_appointments_services FOREIGN KEY (service_id) REFERENCES dbo.services(id),
    CONSTRAINT FK_appointments_work_centers FOREIGN KEY (work_center_id) REFERENCES dbo.work_centers(id),
    CONSTRAINT FK_appointments_employees FOREIGN KEY (doctor_id) REFERENCES dbo.employees(id)
);
GO

CREATE INDEX idx_appointments_patient ON dbo.appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON dbo.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON dbo.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON dbo.appointments(status);
CREATE INDEX idx_appointments_work_center ON dbo.appointments(work_center_id);
CREATE INDEX idx_appointments_datetime ON dbo.appointments(appointment_date, appointment_time);
GO

-- ============================================
-- TABLA: payments
-- Registro de pagos
-- ============================================
CREATE TABLE dbo.payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    appointment_id INT NOT NULL,
    patient_id INT NOT NULL,
    payment_number INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT CAST(GETDATE() AS DATE),
    payment_method NVARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
    receipt_number NVARCHAR(100),
    notes NVARCHAR(MAX),
    created_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_payments_appointments FOREIGN KEY (appointment_id) REFERENCES dbo.appointments(id) ON DELETE CASCADE,
    CONSTRAINT FK_payments_patients FOREIGN KEY (patient_id) REFERENCES dbo.patients(id),
    CONSTRAINT FK_payments_employees FOREIGN KEY (created_by) REFERENCES dbo.employees(id)
);
GO

CREATE INDEX idx_payments_appointment ON dbo.payments(appointment_id);
CREATE INDEX idx_payments_patient ON dbo.payments(patient_id);
CREATE INDEX idx_payments_date ON dbo.payments(payment_date);
GO

-- ============================================
-- TABLA: medical_records
-- Expedientes médicos digitales
-- ============================================
CREATE TABLE dbo.medical_records (
    id INT IDENTITY(1,1) PRIMARY KEY,
    patient_id INT UNIQUE NOT NULL,
    record_number NVARCHAR(50) UNIQUE,
    
    -- Información personal
    address NVARCHAR(MAX),
    phone NVARCHAR(20),
    occupation NVARCHAR(255),
    age INT,
    reference NVARCHAR(255),
    sex NVARCHAR(20),
    colony NVARCHAR(255),
    delegation NVARCHAR(255),
    postal_code NVARCHAR(10),
    tutor NVARCHAR(255),
    
    -- Información del doctor
    assigned_doctor_id INT,
    
    -- Historia Clínica
    physical_state NVARCHAR(20) CHECK (physical_state IN ('good', 'bad', 'regular')),
    dental_state NVARCHAR(20) CHECK (dental_state IN ('good', 'bad', 'regular')),
    
    -- Antecedentes Patológicos (JSON)
    pathological_history NVARCHAR(MAX),
    
    -- Antecedentes No Patológicos (JSON)
    non_pathological_history NVARCHAR(MAX),
    
    -- Hábitos
    habit_frequency NVARCHAR(100),
    habit_duration NVARCHAR(100),
    habit_intensity NVARCHAR(100),
    received_medical_attention BIT DEFAULT 0,
    medical_attention_cause NVARCHAR(MAX),
    
    -- Examen de la Cara (JSON)
    face_exam NVARCHAR(MAX),
    
    -- Línea de Holdaway (JSON)
    holdaway_line NVARCHAR(MAX),
    
    -- Examen Bucal (JSON)
    oral_exam NVARCHAR(MAX),
    
    -- Examen Radiográfico (JSON)
    radiographic_exam NVARCHAR(MAX),
    
    -- Firmas (Base64)
    patient_signature NVARCHAR(MAX),
    legal_guardian_signature NVARCHAR(MAX),
    
    -- Observaciones
    observations NVARCHAR(MAX),
    
    -- Fechas
    start_date DATE,
    end_date DATE,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_medical_records_patients FOREIGN KEY (patient_id) REFERENCES dbo.patients(id) ON DELETE CASCADE,
    CONSTRAINT FK_medical_records_employees FOREIGN KEY (assigned_doctor_id) REFERENCES dbo.employees(id)
);
GO

CREATE INDEX idx_medical_records_patient ON dbo.medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON dbo.medical_records(assigned_doctor_id);
GO

-- ============================================
-- TABLA: appointment_history
-- Historial de citas en expedientes
-- ============================================
CREATE TABLE dbo.appointment_history (
    id INT IDENTITY(1,1) PRIMARY KEY,
    medical_record_id INT NOT NULL,
    appointment_number INT NOT NULL,
    appointment_date DATE NOT NULL,
    activity NVARCHAR(MAX) NOT NULL,
    doctor_name NVARCHAR(255) NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_appointment_history_medical_records FOREIGN KEY (medical_record_id) REFERENCES dbo.medical_records(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_appointment_history_record ON dbo.appointment_history(medical_record_id);
CREATE INDEX idx_appointment_history_date ON dbo.appointment_history(appointment_date);
GO

-- ============================================
-- TABLA: blocked_days
-- Días bloqueados para citas
-- ============================================
CREATE TABLE dbo.blocked_days (
    id INT IDENTITY(1,1) PRIMARY KEY,
    blocked_date DATE NOT NULL,
    work_center_id INT,
    reason NVARCHAR(255),
    is_holiday BIT DEFAULT 0,
    blocked_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_blocked_days_work_centers FOREIGN KEY (work_center_id) REFERENCES dbo.work_centers(id),
    CONSTRAINT FK_blocked_days_employees FOREIGN KEY (blocked_by) REFERENCES dbo.employees(id)
);
GO

CREATE INDEX idx_blocked_days_date ON dbo.blocked_days(blocked_date);
CREATE INDEX idx_blocked_days_work_center ON dbo.blocked_days(work_center_id);
GO

-- ============================================
-- TABLA: blocked_time_slots
-- Horarios bloqueados para citas
-- ============================================
CREATE TABLE dbo.blocked_time_slots (
    id INT IDENTITY(1,1) PRIMARY KEY,
    blocked_date DATE NOT NULL,
    blocked_time TIME NOT NULL,
    work_center_id INT,
    reason NVARCHAR(255),
    blocked_by INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_blocked_time_slots_work_centers FOREIGN KEY (work_center_id) REFERENCES dbo.work_centers(id),
    CONSTRAINT FK_blocked_time_slots_employees FOREIGN KEY (blocked_by) REFERENCES dbo.employees(id)
);
GO

CREATE INDEX idx_blocked_time_slots_datetime ON dbo.blocked_time_slots(blocked_date, blocked_time);
CREATE INDEX idx_blocked_time_slots_work_center ON dbo.blocked_time_slots(work_center_id);
GO

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Insertar sucursales
SET IDENTITY_INSERT dbo.work_centers ON;
INSERT INTO dbo.work_centers (id, name, address, phone, email) VALUES
(1, N'Pénjamo', N'Calle primero de mayo #9, Pénjamo Gto', N'4611234567', N'penjamo@dentalwhite.com'),
(2, N'Valle de Santiago', N'Centro, Valle de Santiago Gto', N'4619876543', N'valle@dentalwhite.com'),
(3, N'Abasolo', N'Abasolo Gto', N'4615551234', N'abasolo@dentalwhite.com');
SET IDENTITY_INSERT dbo.work_centers OFF;
GO

-- Insertar servicios por sucursal
-- Servicios de Pénjamo
INSERT INTO dbo.services (name, description, branch, duration_minutes) VALUES
(N'Limpieza Dental', N'Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales', N'Pénjamo', 60),
(N'Ortodoncia', N'Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal.', N'Pénjamo', 90),
(N'Endodoncia', N'Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material.', N'Pénjamo', 120),
(N'Extracción', N'Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia.', N'Pénjamo', 45),
(N'Blanqueamiento', N'Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas.', N'Pénjamo', 90),
(N'Prótesis Dentales', N'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', N'Pénjamo', 120),
(N'Revisión General', N'Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor.', N'Pénjamo', 30);

-- Servicios de Valle de Santiago
INSERT INTO dbo.services (name, description, branch, duration_minutes) VALUES
(N'Prótesis Dentales', N'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', N'Valle de Santiago', 120),
(N'Implantes Dentales', N'Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental.', N'Valle de Santiago', 180),
(N'Cirugía Maxilofacial', N'Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial.', N'Valle de Santiago', 150),
(N'Periodoncia', N'Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis.', N'Valle de Santiago', 90);

-- Servicios de Abasolo
INSERT INTO dbo.services (name, description, branch, duration_minutes) VALUES
(N'Odontopediatría', N'Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad.', N'Abasolo', 60),
(N'Diseño de Sonrisa', N'Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental.', N'Abasolo', 120),
(N'Coronas y Puentes', N'Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa.', N'Abasolo', 120),
(N'Rehabilitación Oral', N'Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca.', N'Abasolo', 150);
GO

-- Insertar usuarios de ejemplo
-- Contraseña para todos: "Password123" (debe ser hasheada en producción)
SET IDENTITY_INSERT dbo.users ON;
INSERT INTO dbo.users (id, email, password_hash, role, full_name) VALUES
(1, N'admin@dentalwhite.com', N'$2a$10$example_hash_admin', N'admin', N'Administrador Principal'),
(2, N'recepcion@dentalwhite.com', N'$2a$10$example_hash_reception', N'receptionist', N'María González'),
(3, N'doctor@dentalwhite.com', N'$2a$10$example_hash_doctor', N'doctor', N'Dr. Carlos Méndez'),
(4, N'laura.sanchez@dentalwhite.com', N'$2a$10$example_hash_doctor2', N'doctor', N'Dra. Laura Sánchez'),
(5, N'paciente@example.com', N'$2a$10$example_hash_patient', N'patient', N'Juan Pérez');
SET IDENTITY_INSERT dbo.users OFF;
GO

-- Insertar empleados
SET IDENTITY_INSERT dbo.employees ON;
INSERT INTO dbo.employees (id, user_id, employee_code, specialty, work_center_id, hire_date, phone) VALUES
(1, 1, N'ADMIN001', NULL, 1, '2025-01-01', N'5500000000'),
(2, 2, N'RECEP001', NULL, 1, '2025-03-01', N'5511111111'),
(3, 3, N'DOC001', N'Odontología General', 1, '2025-02-01', N'5522222222'),
(4, 4, N'DOC002', N'Endodoncia', 2, '2025-04-01', N'5533333333');
SET IDENTITY_INSERT dbo.employees OFF;
GO

-- Insertar pacientes de ejemplo
SET IDENTITY_INSERT dbo.patients ON;
INSERT INTO dbo.patients (id, user_id, patient_code, name, email, phone, age, sex, address, colony, delegation, municipality, occupation, patient_type, is_new_patient, registration_date) VALUES
(1, 5, N'PAT001', N'Juan Pérez', N'paciente@example.com', N'5512345678', 32, N'Masculino', N'Calle Principal 123', N'Centro', N'Cuauhtémoc', N'Cuauhtémoc', N'Ingeniero', N'Regular', 0, '2026-01-15'),
(2, NULL, N'PAT002', N'María López', N'maria.lopez@example.com', N'5523456789', 28, N'Femenino', N'Av. Reforma 456', N'Polanco', N'Miguel Hidalgo', N'Miguel Hidalgo', N'Diseñadora', N'Regular', 0, '2026-01-20'),
(3, NULL, N'PAT003', N'Ana Rodríguez', N'ana.rodriguez@example.com', N'5534567890', 45, N'Femenino', N'Calle Norte 789', N'Del Valle', N'Benito Juárez', N'Benito Juárez', N'Abogada', N'Primera vez', 0, '2026-02-01'),
(4, NULL, N'PAT004', N'Carlos Martínez', N'carlos.martinez@example.com', N'5545678901', 12, N'Masculino', N'Calle Sur 321', N'Coyoacán', N'Coyoacán', N'Coyoacán', N'Estudiante', N'Pediátrico', 0, '2026-02-05');
SET IDENTITY_INSERT dbo.patients OFF;
GO

-- Insertar citas de ejemplo
SET IDENTITY_INSERT dbo.appointments ON;
INSERT INTO dbo.appointments (id, appointment_code, patient_id, service_id, work_center_id, doctor_id, appointment_date, appointment_time, status, service_price, amount_paid, payment_type) VALUES
(1, N'APT001', 1, 1, 1, 3, '2026-03-20', '10:00', N'scheduled', 500.00, 500.00, N'complete'),
(2, N'APT002', 2, 7, 1, 3, '2026-03-20', '11:00', N'confirmed', 300.00, 300.00, N'complete'),
(3, N'APT003', 3, 3, 1, 3, '2026-03-21', '14:00', N'scheduled', 1500.00, 500.00, N'installment'),
(4, N'APT004', 4, 2, 1, 3, '2026-03-21', '09:00', N'confirmed', 15000.00, 5000.00, N'installment');
SET IDENTITY_INSERT dbo.appointments OFF;
GO

UPDATE dbo.appointments SET number_of_payments = 3, current_payment = 1 WHERE id = 3;
UPDATE dbo.appointments SET number_of_payments = 3, current_payment = 1 WHERE id = 4;
GO

-- ============================================
-- TRIGGERS PARA ACTUALIZAR updated_at
-- ============================================

-- Trigger para users
CREATE TRIGGER trg_users_updated_at
ON dbo.users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.users
    SET updated_at = GETDATE()
    FROM dbo.users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

-- Trigger para work_centers
CREATE TRIGGER trg_work_centers_updated_at
ON dbo.work_centers
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.work_centers
    SET updated_at = GETDATE()
    FROM dbo.work_centers w
    INNER JOIN inserted i ON w.id = i.id;
END;
GO

-- Trigger para services
CREATE TRIGGER trg_services_updated_at
ON dbo.services
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.services
    SET updated_at = GETDATE()
    FROM dbo.services s
    INNER JOIN inserted i ON s.id = i.id;
END;
GO

-- Trigger para employees
CREATE TRIGGER trg_employees_updated_at
ON dbo.employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.employees
    SET updated_at = GETDATE()
    FROM dbo.employees e
    INNER JOIN inserted i ON e.id = i.id;
END;
GO

-- Trigger para patients
CREATE TRIGGER trg_patients_updated_at
ON dbo.patients
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.patients
    SET updated_at = GETDATE()
    FROM dbo.patients p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- Trigger para appointments
CREATE TRIGGER trg_appointments_updated_at
ON dbo.appointments
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.appointments
    SET updated_at = GETDATE()
    FROM dbo.appointments a
    INNER JOIN inserted i ON a.id = i.id;
END;
GO

-- Trigger para medical_records
CREATE TRIGGER trg_medical_records_updated_at
ON dbo.medical_records
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.medical_records
    SET updated_at = GETDATE()
    FROM dbo.medical_records m
    INNER JOIN inserted i ON m.id = i.id;
END;
GO

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de citas con información completa
CREATE VIEW vw_appointments_full AS
SELECT 
    a.id,
    a.appointment_code,
    a.appointment_date,
    a.appointment_time,
    a.status,
    p.name AS patient_name,
    p.phone AS patient_phone,
    p.email AS patient_email,
    s.name AS service_name,
    s.duration_minutes,
    w.name AS work_center_name,
    w.address AS work_center_address,
    e.user_id AS doctor_user_id,
    u.full_name AS doctor_name,
    a.service_price,
    a.amount_paid,
    a.payment_type,
    a.number_of_payments,
    a.current_payment,
    a.notes,
    a.created_at,
    a.confirmed_at,
    a.completed_at
FROM dbo.appointments a
INNER JOIN dbo.patients p ON a.patient_id = p.id
INNER JOIN dbo.services s ON a.service_id = s.id
INNER JOIN dbo.work_centers w ON a.work_center_id = w.id
LEFT JOIN dbo.employees e ON a.doctor_id = e.id
LEFT JOIN dbo.users u ON e.user_id = u.id;
GO

-- Vista de pacientes con información de usuario
CREATE VIEW vw_patients_full AS
SELECT 
    p.*,
    u.email AS user_email,
    u.is_active AS user_is_active,
    COUNT(DISTINCT a.id) AS total_appointments,
    MAX(a.appointment_date) AS last_appointment_date
FROM dbo.patients p
LEFT JOIN dbo.users u ON p.user_id = u.id
LEFT JOIN dbo.appointments a ON p.id = a.patient_id
GROUP BY 
    p.id, p.user_id, p.patient_code, p.name, p.email, p.phone, p.age, p.sex, 
    p.address, p.colony, p.delegation, p.municipality, p.postal_code, p.tutor, 
    p.occupation, p.patient_type, p.is_new_patient, p.registration_date, 
    p.created_at, p.updated_at, u.email, u.is_active;
GO

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ============================================

-- Procedimiento para obtener citas por fecha y sucursal
CREATE PROCEDURE sp_GetAppointmentsByDateAndBranch
    @AppointmentDate DATE,
    @WorkCenterId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT *
    FROM vw_appointments_full
    WHERE appointment_date = @AppointmentDate
        AND (@WorkCenterId IS NULL OR work_center_id = @WorkCenterId)
    ORDER BY appointment_time;
END;
GO

-- Procedimiento para obtener horarios disponibles
CREATE PROCEDURE sp_GetAvailableTimeSlots
    @AppointmentDate DATE,
    @WorkCenterId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar si el día está bloqueado
    IF EXISTS (SELECT 1 FROM dbo.blocked_days 
               WHERE blocked_date = @AppointmentDate 
                 AND (work_center_id = @WorkCenterId OR work_center_id IS NULL))
    BEGIN
        SELECT 'Day is blocked' AS message;
        RETURN;
    END
    
    -- Obtener horarios ocupados
    SELECT appointment_time AS occupied_time
    FROM dbo.appointments
    WHERE appointment_date = @AppointmentDate
      AND work_center_id = @WorkCenterId
      AND status NOT IN ('cancelled', 'no_show')
    UNION
    SELECT blocked_time
    FROM dbo.blocked_time_slots
    WHERE blocked_date = @AppointmentDate
      AND (work_center_id = @WorkCenterId OR work_center_id IS NULL);
END;
GO

-- Procedimiento para registrar un nuevo paciente
CREATE PROCEDURE sp_RegisterNewPatient
    @Name NVARCHAR(255),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(20),
    @Age INT = NULL,
    @Sex NVARCHAR(20) = NULL,
    @PatientId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @PatientCode NVARCHAR(50);
    DECLARE @NextNumber INT;
    
    -- Generar código de paciente
    SELECT @NextNumber = ISNULL(MAX(CAST(SUBSTRING(patient_code, 4, 10) AS INT)), 0) + 1
    FROM dbo.patients
    WHERE patient_code LIKE 'PAT%';
    
    SET @PatientCode = 'PAT' + RIGHT('00000' + CAST(@NextNumber AS NVARCHAR), 5);
    
    -- Insertar paciente
    INSERT INTO dbo.patients (patient_code, name, email, phone, age, sex, patient_type, is_new_patient)
    VALUES (@PatientCode, @Name, @Email, @Phone, @Age, @Sex, 'Primera vez', 1);
    
    SET @PatientId = SCOPE_IDENTITY();
    
    SELECT @PatientId AS patient_id, @PatientCode AS patient_code;
END;
GO

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Usuarios del sistema con autenticación', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'users';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Sucursales de Dental White', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'work_centers';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Servicios odontológicos por sucursal', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'services';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Empleados de la clínica', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'employees';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Pacientes registrados', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'patients';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Citas médicas agendadas', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'appointments';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Registro de pagos realizados', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'payments';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Expedientes médicos digitales', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'medical_records';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Días bloqueados para agendar citas', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'blocked_days';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Horarios específicos bloqueados', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'blocked_time_slots';
GO

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

PRINT 'Base de datos DentalWhite creada exitosamente';
PRINT 'Tablas creadas: 11';
PRINT 'Vistas creadas: 2';
PRINT 'Procedimientos almacenados creados: 3';
PRINT 'Triggers creados: 7';
GO
