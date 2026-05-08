-- =============================================
-- DATOS INICIALES PARA DENTAL WHITE
-- =============================================

-- Catálogos
INSERT INTO cat_roles (nombre, descripcion, permisos, activo) VALUES
('SUPERADMIN', 'Super Administrador con acceso total', '{"all": true}'::jsonb, true),
('ADMIN', 'Administrador de sucursal', '{"users": ["read", "create", "update"], "patients": ["all"], "appointments": ["all"]}'::jsonb, true),
('DENTISTA', 'Odontólogo', '{"patients": ["read"], "appointments": ["read", "update"], "consultations": ["all"]}'::jsonb, true),
('RECEPCIONISTA', 'Personal de recepción', '{"patients": ["read", "create", "update"], "appointments": ["all"]}'::jsonb, true),
('ASISTENTE', 'Asistente dental', '{"patients": ["read"], "appointments": ["read"], "consultations": ["read"]}'::jsonb, true)
ON CONFLICT DO NOTHING;

INSERT INTO cat_nacionalidades (nombre, codigo_iso, activo) VALUES
('Mexicana', 'MEX', true),
('Estadounidense', 'USA', true),
('Canadiense', 'CAN', true),
('Guatemalteca', 'GTM', true),
('Otra', 'OTH', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_sucursales (nombre, direccion, telefono, email, activo) VALUES
('Pénjamo', 'Calle Principal #123, Pénjamo, Guanajuato', '4771234567', 'penjamo@dentalwhite.com', true),
('Valle de Santiago', 'Av. Central #456, Valle de Santiago, Guanajuato', '4569876543', 'valle@dentalwhite.com', true),
('Abasolo', 'Blvd. Norte #789, Abasolo, Guanajuato', '4291357924', 'abasolo@dentalwhite.com', true)
ON CONFLICT DO NOTHING;

INSERT INTO cat_tipos_paciente (nombre, descripcion, activo) VALUES
('General', 'Paciente sin características especiales', true),
('VIP', 'Paciente VIP con atención preferencial', true),
('Corporativo', 'Paciente de convenio corporativo', true),
('Familiar', 'Familiar de empleado con descuento', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_especialidades (nombre, descripcion, activo) VALUES
('Odontología General', 'Práctica general de odontología', true),
('Ortodoncia', 'Especialidad en corrección de dientes y mandíbulas', true),
('Endodoncia', 'Tratamiento de conductos radiculares', true),
('Periodoncia', 'Tratamiento de encías y estructuras de soporte', true),
('Odontopediatría', 'Odontología pediátrica', true),
('Cirugía Oral', 'Cirugía maxilofacial y extracciones', true),
('Prostodoncia', 'Prótesis dentales y restauración', true),
('Estética Dental', 'Blanqueamiento y estética', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_servicios (nombre, descripcion, precio_base, duracion_minutos, activo) VALUES
('Consulta General', 'Consulta odontológica general', 500.00, 30, true),
('Limpieza Dental', 'Profilaxis y limpieza profesional', 800.00, 45, true),
('Extracción Simple', 'Extracción de pieza dental simple', 1200.00, 30, true),
('Extracción Compleja', 'Extracción quirúrgica', 2500.00, 60, true),
('Resina', 'Restauración con resina', 1000.00, 45, true),
('Endodoncia', 'Tratamiento de conductos', 3500.00, 90, true),
('Corona', 'Corona dental', 5000.00, 60, true),
('Blanqueamiento', 'Blanqueamiento dental', 3000.00, 60, true),
('Ortodoncia - Consulta', 'Consulta de ortodoncia', 500.00, 45, true),
('Brackets', 'Colocación de brackets', 15000.00, 120, true)
ON CONFLICT DO NOTHING;

INSERT INTO cat_medios_contacto (nombre, descripcion, activo) VALUES
('Teléfono', 'Contacto telefónico', true),
('WhatsApp', 'Mensajería WhatsApp', true),
('Email', 'Correo electrónico', true),
('Redes Sociales', 'Facebook, Instagram, etc.', true),
('Visita Directa', 'Visita sin cita previa', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_estados_cita (nombre, color, descripcion, activo) VALUES
('Programada', '#3B82F6', 'Cita programada', true),
('Confirmada', '#10B981', 'Cita confirmada por el paciente', true),
('En Curso', '#F59E0B', 'Cita en progreso', true),
('Completada', '#6366F1', 'Cita finalizada', true),
('Cancelada', '#EF4444', 'Cita cancelada', true),
('No Asistió', '#9CA3AF', 'Paciente no asistió', true),
('Reagendada', '#8B5CF6', 'Cita reprogramada', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cat_tipos_antecedentes (nombre, categoria, descripcion, activo) VALUES
('Diabetes', 'Patológicos', 'Diabetes mellitus tipo 1 o 2', true),
('Hipertensión', 'Patológicos', 'Presión arterial alta', true),
('Cardiopatías', 'Patológicos', 'Enfermedades del corazón', true),
('Asma', 'Patológicos', 'Asma bronquial', true),
('Alergias Medicamentosas', 'Alérgicos', 'Alergias a medicamentos', true),
('Tabaquismo', 'No Patológicos', 'Fumador activo', true),
('Alcoholismo', 'No Patológicos', 'Consumo de alcohol', true),
('Embarazo', 'Gineco-obstétricos', 'Paciente embarazada', true),
('Cirugías Previas', 'Quirúrgicos', 'Antecedentes de cirugías', true),
('VIH/SIDA', 'Patológicos', 'Virus de inmunodeficiencia humana', true)
ON CONFLICT (nombre) DO NOTHING;

-- CREAR USUARIO ADMIN
-- Password: admin123 (en plaintext, el backend lo hashea)
INSERT INTO usuarios (email, password_hash, nombre, apellido_paterno, curp, nacionalidad_id, telefono_principal, whatsapp, rol_id, activo)
VALUES (
    'admin@dentalwhite.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.bpMcXVTQhPOlKy', -- admin123
    'Administrador',
    'Sistema',
    'SIBA850101HNENSLS09',
    1,
    '4771234567',
    '4771234567',
    1,
    true
) ON CONFLICT (email) DO NOTHING;

-- CREAR EMPLEADO ADMIN
INSERT INTO empleados (usuario_id, sucursal_id, numero_empleado, cedula_profesional, fecha_contratacion, puesto, activo)
VALUES (
    (SELECT id FROM usuarios WHERE email = 'admin@dentalwhite.com'),
    1,
    'EMP001',
    'CEDULA12345',
    CURRENT_DATE,
    'Administrador General',
    true
) ON CONFLICT (usuario_id) DO NOTHING;

SELECT 'Datos insertados correctamente' as mensaje;