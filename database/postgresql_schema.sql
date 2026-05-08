-- ============================================
-- DENTAL WHITE - PostgreSQL Database Schema
-- Sistema de Gestión Dental
-- ============================================

-- Eliminar tablas existentes (en orden inverso de dependencias)
DROP TABLE IF EXISTS appointment_history CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS blocked_days CASCADE;
DROP TABLE IF EXISTS blocked_time_slots CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS work_centers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLA: users
-- Gestión de autenticación y roles
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'receptionist', 'doctor', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABLA: work_centers
-- Sucursales de la clínica
-- ============================================
CREATE TABLE work_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_centers_name ON work_centers(name);

-- ============================================
-- TABLA: services
-- Servicios odontológicos por sucursal
-- ============================================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    branch VARCHAR(100) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_branch ON services(branch);
CREATE INDEX idx_services_active ON services(is_active);

-- ============================================
-- TABLA: employees
-- Empleados de la clínica
-- ============================================
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE,
    specialty VARCHAR(255),
    work_center_id INTEGER REFERENCES work_centers(id),
    hire_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    phone VARCHAR(20),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_work_center ON employees(work_center_id);
CREATE INDEX idx_employees_status ON employees(status);

-- ============================================
-- TABLA: patients
-- Pacientes de la clínica
-- ============================================
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    patient_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    age INTEGER,
    sex VARCHAR(20) CHECK (sex IN ('Masculino', 'Femenino', 'Otro')),
    address TEXT,
    colony VARCHAR(255),
    delegation VARCHAR(255),
    municipality VARCHAR(255),
    postal_code VARCHAR(10),
    tutor VARCHAR(255),
    occupation VARCHAR(255),
    patient_type VARCHAR(50) DEFAULT 'Primera vez',
    is_new_patient BOOLEAN DEFAULT TRUE,
    registration_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_user ON patients(user_id);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_patient_code ON patients(patient_code);

-- ============================================
-- TABLA: appointments
-- Citas médicas
-- ============================================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    appointment_code VARCHAR(50) UNIQUE,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id),
    work_center_id INTEGER NOT NULL REFERENCES work_centers(id),
    doctor_id INTEGER REFERENCES employees(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    
    -- Información de pago
    service_price DECIMAL(10, 2),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_type VARCHAR(20) CHECK (payment_type IN ('complete', 'installment')),
    number_of_payments INTEGER DEFAULT 1,
    current_payment INTEGER DEFAULT 1,
    
    -- Notas y observaciones
    notes TEXT,
    cancellation_reason TEXT,
    
    -- Confirmaciones enviadas
    email_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_work_center ON appointments(work_center_id);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, appointment_time);

-- ============================================
-- TABLA: payments
-- Registro de pagos
-- ============================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    payment_number INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
    receipt_number VARCHAR(100),
    notes TEXT,
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_payments_patient ON payments(patient_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- ============================================
-- TABLA: medical_records
-- Expedientes médicos digitales
-- ============================================
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    record_number VARCHAR(50) UNIQUE,
    
    -- Información personal
    address TEXT,
    phone VARCHAR(20),
    occupation VARCHAR(255),
    age INTEGER,
    reference VARCHAR(255),
    sex VARCHAR(20),
    colony VARCHAR(255),
    delegation VARCHAR(255),
    postal_code VARCHAR(10),
    tutor VARCHAR(255),
    
    -- Información del doctor
    assigned_doctor_id INTEGER REFERENCES employees(id),
    
    -- Historia Clínica
    physical_state VARCHAR(20) CHECK (physical_state IN ('good', 'bad', 'regular')),
    dental_state VARCHAR(20) CHECK (dental_state IN ('good', 'bad', 'regular')),
    
    -- Antecedentes Patológicos (JSON)
    pathological_history JSONB DEFAULT '{}',
    
    -- Antecedentes No Patológicos (JSON)
    non_pathological_history JSONB DEFAULT '{}',
    
    -- Hábitos
    habit_frequency VARCHAR(100),
    habit_duration VARCHAR(100),
    habit_intensity VARCHAR(100),
    received_medical_attention BOOLEAN DEFAULT FALSE,
    medical_attention_cause TEXT,
    
    -- Examen de la Cara (JSON)
    face_exam JSONB DEFAULT '{}',
    
    -- Línea de Holdaway (JSON)
    holdaway_line JSONB DEFAULT '{}',
    
    -- Examen Bucal (JSON)
    oral_exam JSONB DEFAULT '{}',
    
    -- Examen Radiográfico (JSON)
    radiographic_exam JSONB DEFAULT '{}',
    
    -- Firmas (Base64)
    patient_signature TEXT,
    legal_guardian_signature TEXT,
    
    -- Observaciones
    observations TEXT,
    
    -- Fechas
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(assigned_doctor_id);

-- ============================================
-- TABLA: appointment_history
-- Historial de citas en expedientes
-- ============================================
CREATE TABLE appointment_history (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    appointment_number INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    activity TEXT NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointment_history_record ON appointment_history(medical_record_id);
CREATE INDEX idx_appointment_history_date ON appointment_history(appointment_date);

-- ============================================
-- TABLA: blocked_days
-- Días bloqueados para citas
-- ============================================
CREATE TABLE blocked_days (
    id SERIAL PRIMARY KEY,
    blocked_date DATE NOT NULL,
    work_center_id INTEGER REFERENCES work_centers(id),
    reason VARCHAR(255),
    is_holiday BOOLEAN DEFAULT FALSE,
    blocked_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocked_days_date ON blocked_days(blocked_date);
CREATE INDEX idx_blocked_days_work_center ON blocked_days(work_center_id);

-- ============================================
-- TABLA: blocked_time_slots
-- Horarios bloqueados para citas
-- ============================================
CREATE TABLE blocked_time_slots (
    id SERIAL PRIMARY KEY,
    blocked_date DATE NOT NULL,
    blocked_time TIME NOT NULL,
    work_center_id INTEGER REFERENCES work_centers(id),
    reason VARCHAR(255),
    blocked_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocked_time_slots_datetime ON blocked_time_slots(blocked_date, blocked_time);
CREATE INDEX idx_blocked_time_slots_work_center ON blocked_time_slots(work_center_id);

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Insertar sucursales
INSERT INTO work_centers (name, address, phone, email) VALUES
('Pénjamo', 'Calle primero de mayo #9, Pénjamo Gto', '4611234567', 'penjamo@dentalwhite.com'),
('Valle de Santiago', 'Centro, Valle de Santiago Gto', '4619876543', 'valle@dentalwhite.com'),
('Abasolo', 'Abasolo Gto', '4615551234', 'abasolo@dentalwhite.com');

-- Insertar servicios por sucursal
-- Servicios de Pénjamo
INSERT INTO services (name, description, branch, duration_minutes) VALUES
('Limpieza Dental', 'Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales', 'Pénjamo', 60),
('Ortodoncia', 'Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal.', 'Pénjamo', 90),
('Endodoncia', 'Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material.', 'Pénjamo', 120),
('Extracción', 'Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia.', 'Pénjamo', 45),
('Blanqueamiento', 'Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas.', 'Pénjamo', 90),
('Prótesis Dentales', 'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', 'Pénjamo', 120),
('Revisión General', 'Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor.', 'Pénjamo', 30);

-- Servicios de Valle de Santiago
INSERT INTO services (name, description, branch, duration_minutes) VALUES
('Prótesis Dentales', 'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.', 'Valle de Santiago', 120),
('Implantes Dentales', 'Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental.', 'Valle de Santiago', 180),
('Cirugía Maxilofacial', 'Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial.', 'Valle de Santiago', 150),
('Periodoncia', 'Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis.', 'Valle de Santiago', 90);

-- Servicios de Abasolo
INSERT INTO services (name, description, branch, duration_minutes) VALUES
('Odontopediatría', 'Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad.', 'Abasolo', 60),
('Diseño de Sonrisa', 'Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental.', 'Abasolo', 120),
('Coronas y Puentes', 'Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa.', 'Abasolo', 120),
('Rehabilitación Oral', 'Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca.', 'Abasolo', 150);

-- Insertar usuarios de ejemplo
-- Contraseña para todos: "Password123" (debe ser hasheada en producción)
INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@dentalwhite.com', '$2a$10$example_hash_admin', 'admin', 'Administrador Principal'),
('recepcion@dentalwhite.com', '$2a$10$example_hash_reception', 'receptionist', 'María González'),
('doctor@dentalwhite.com', '$2a$10$example_hash_doctor', 'doctor', 'Dr. Carlos Méndez'),
('laura.sanchez@dentalwhite.com', '$2a$10$example_hash_doctor2', 'doctor', 'Dra. Laura Sánchez'),
('paciente@example.com', '$2a$10$example_hash_patient', 'patient', 'Juan Pérez');

-- Insertar empleados
INSERT INTO employees (user_id, employee_code, specialty, work_center_id, hire_date, phone) VALUES
(1, 'ADMIN001', NULL, 1, '2025-01-01', '5500000000'),
(2, 'RECEP001', NULL, 1, '2025-03-01', '5511111111'),
(3, 'DOC001', 'Odontología General', 1, '2025-02-01', '5522222222'),
(4, 'DOC002', 'Endodoncia', 2, '2025-04-01', '5533333333');

-- Insertar pacientes de ejemplo
INSERT INTO patients (user_id, patient_code, name, email, phone, age, sex, address, colony, delegation, municipality, occupation, patient_type, is_new_patient, registration_date) VALUES
(5, 'PAT001', 'Juan Pérez', 'paciente@example.com', '5512345678', 32, 'Masculino', 'Calle Principal 123', 'Centro', 'Cuauhtémoc', 'Cuauhtémoc', 'Ingeniero', 'Regular', FALSE, '2026-01-15'),
(NULL, 'PAT002', 'María López', 'maria.lopez@example.com', '5523456789', 28, 'Femenino', 'Av. Reforma 456', 'Polanco', 'Miguel Hidalgo', 'Miguel Hidalgo', 'Diseñadora', 'Regular', FALSE, '2026-01-20'),
(NULL, 'PAT003', 'Ana Rodríguez', 'ana.rodriguez@example.com', '5534567890', 45, 'Femenino', 'Calle Norte 789', 'Del Valle', 'Benito Juárez', 'Benito Juárez', 'Abogada', 'Primera vez', FALSE, '2026-02-01'),
(NULL, 'PAT004', 'Carlos Martínez', 'carlos.martinez@example.com', '5545678901', 12, 'Masculino', 'Calle Sur 321', 'Coyoacán', 'Coyoacán', 'Coyoacán', 'Estudiante', 'Pediátrico', FALSE, '2026-02-05');

-- Insertar citas de ejemplo
INSERT INTO appointments (appointment_code, patient_id, service_id, work_center_id, doctor_id, appointment_date, appointment_time, status, service_price, amount_paid, payment_type) VALUES
('APT001', 1, 1, 1, 3, '2026-03-20', '10:00', 'scheduled', 500.00, 500.00, 'complete'),
('APT002', 2, 7, 1, 3, '2026-03-20', '11:00', 'confirmed', 300.00, 300.00, 'complete'),
('APT003', 3, 3, 1, 3, '2026-03-21', '14:00', 'scheduled', 1500.00, 500.00, 'installment'),
('APT004', 4, 2, 1, 3, '2026-03-21', '09:00', 'confirmed', 15000.00, 5000.00, 'installment');

UPDATE appointments SET number_of_payments = 3, current_payment = 1 WHERE id = 3;
UPDATE appointments SET number_of_payments = 3, current_payment = 1 WHERE id = 4;

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_centers_updated_at BEFORE UPDATE ON work_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de citas con información completa
CREATE OR REPLACE VIEW vw_appointments_full AS
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
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN services s ON a.service_id = s.id
JOIN work_centers w ON a.work_center_id = w.id
LEFT JOIN employees e ON a.doctor_id = e.id
LEFT JOIN users u ON e.user_id = u.id;

-- Vista de pacientes con información de usuario
CREATE OR REPLACE VIEW vw_patients_full AS
SELECT 
    p.*,
    u.email AS user_email,
    u.is_active AS user_is_active,
    COUNT(DISTINCT a.id) AS total_appointments,
    MAX(a.appointment_date) AS last_appointment_date
FROM patients p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN appointments a ON p.id = a.patient_id
GROUP BY p.id, u.email, u.is_active;

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

COMMENT ON TABLE users IS 'Usuarios del sistema con autenticación';
COMMENT ON TABLE work_centers IS 'Sucursales de Dental White';
COMMENT ON TABLE services IS 'Servicios odontológicos por sucursal';
COMMENT ON TABLE employees IS 'Empleados de la clínica';
COMMENT ON TABLE patients IS 'Pacientes registrados';
COMMENT ON TABLE appointments IS 'Citas médicas agendadas';
COMMENT ON TABLE payments IS 'Registro de pagos realizados';
COMMENT ON TABLE medical_records IS 'Expedientes médicos digitales';
COMMENT ON TABLE blocked_days IS 'Días bloqueados para agendar citas';
COMMENT ON TABLE blocked_time_slots IS 'Horarios específicos bloqueados';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
