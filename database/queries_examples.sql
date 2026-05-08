-- ============================================
-- DENTAL WHITE - Consultas SQL de Ejemplo
-- Ejemplos útiles para operaciones comunes
-- ============================================

-- ============================================
-- CONSULTAS DE PACIENTES
-- ============================================

-- 1. Buscar paciente por nombre, teléfono o email
-- PostgreSQL / SQL Server
SELECT * FROM patients
WHERE name ILIKE '%juan%'  -- PostgreSQL (case-insensitive)
   OR phone LIKE '%5512345%'
   OR email ILIKE '%example%';

-- SQL Server (case-insensitive por defecto)
SELECT * FROM patients
WHERE name LIKE '%juan%'
   OR phone LIKE '%5512345%'
   OR email LIKE '%example%';

-- 2. Pacientes nuevos registrados en los últimos 7 días
SELECT * FROM patients
WHERE registration_date >= CURRENT_DATE - INTERVAL '7 days'  -- PostgreSQL
  AND is_new_patient = TRUE;

SELECT * FROM patients
WHERE registration_date >= DATEADD(DAY, -7, GETDATE())  -- SQL Server
  AND is_new_patient = 1;

-- 3. Pacientes con más citas
SELECT 
    p.name,
    p.email,
    p.phone,
    COUNT(a.id) as total_appointments
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
GROUP BY p.id, p.name, p.email, p.phone
ORDER BY total_appointments DESC
LIMIT 10;  -- PostgreSQL

SELECT TOP 10
    p.name,
    p.email,
    p.phone,
    COUNT(a.id) as total_appointments
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
GROUP BY p.id, p.name, p.email, p.phone
ORDER BY total_appointments DESC;  -- SQL Server

-- 4. Pacientes sin citas agendadas
SELECT p.*
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
WHERE a.id IS NULL;

-- ============================================
-- CONSULTAS DE CITAS
-- ============================================

-- 5. Citas del día actual
SELECT 
    a.appointment_code,
    a.appointment_time,
    p.name as patient_name,
    s.name as service_name,
    w.name as work_center,
    a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN services s ON a.service_id = s.id
JOIN work_centers w ON a.work_center_id = w.id
WHERE a.appointment_date = CURRENT_DATE  -- PostgreSQL
ORDER BY a.appointment_time;

WHERE a.appointment_date = CAST(GETDATE() AS DATE)  -- SQL Server
ORDER BY a.appointment_time;

-- 6. Citas pendientes (próximas 7 días)
SELECT * FROM vw_appointments_full
WHERE appointment_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'  -- PostgreSQL
  AND status IN ('scheduled', 'confirmed')
ORDER BY appointment_date, appointment_time;

WHERE appointment_date BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 7, GETDATE())  -- SQL Server
  AND status IN ('scheduled', 'confirmed')
ORDER BY appointment_date, appointment_time;

-- 7. Citas por doctor en un rango de fechas
SELECT 
    u.full_name as doctor_name,
    COUNT(*) as total_appointments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled
FROM appointments a
JOIN employees e ON a.doctor_id = e.id
JOIN users u ON e.user_id = u.id
WHERE a.appointment_date BETWEEN '2026-03-01' AND '2026-03-31'
GROUP BY u.full_name
ORDER BY total_appointments DESC;

-- 8. Horarios ocupados para una fecha y sucursal específica
SELECT a.appointment_time
FROM appointments a
WHERE a.appointment_date = '2026-03-20'
  AND a.work_center_id = 1
  AND a.status NOT IN ('cancelled', 'no_show')
ORDER BY a.appointment_time;

-- 9. Días con mayor número de citas
SELECT 
    appointment_date,
    COUNT(*) as total_appointments
FROM appointments
WHERE status NOT IN ('cancelled', 'no_show')
  AND appointment_date >= CURRENT_DATE - INTERVAL '30 days'  -- PostgreSQL
GROUP BY appointment_date
ORDER BY total_appointments DESC;

WHERE status NOT IN ('cancelled', 'no_show')
  AND appointment_date >= DATEADD(DAY, -30, GETDATE())  -- SQL Server
GROUP BY appointment_date
ORDER BY total_appointments DESC;

-- ============================================
-- CONSULTAS DE DISPONIBILIDAD
-- ============================================

-- 10. Verificar si un día está bloqueado
SELECT * FROM blocked_days
WHERE blocked_date = '2026-03-25'
  AND (work_center_id = 1 OR work_center_id IS NULL);

-- 11. Horarios bloqueados para una fecha
SELECT blocked_time, reason
FROM blocked_time_slots
WHERE blocked_date = '2026-03-20'
  AND (work_center_id = 1 OR work_center_id IS NULL)
ORDER BY blocked_time;

-- 12. Días festivos bloqueados
SELECT blocked_date, reason
FROM blocked_days
WHERE is_holiday = TRUE  -- PostgreSQL
  AND blocked_date >= CURRENT_DATE
ORDER BY blocked_date;

WHERE is_holiday = 1  -- SQL Server
  AND blocked_date >= CAST(GETDATE() AS DATE)
ORDER BY blocked_date;

-- ============================================
-- CONSULTAS DE PAGOS
-- ============================================

-- 13. Citas con pagos pendientes
SELECT 
    a.appointment_code,
    p.name as patient_name,
    a.service_price,
    a.amount_paid,
    (a.service_price - a.amount_paid) as pending_amount,
    a.number_of_payments,
    a.current_payment
FROM appointments a
JOIN patients p ON a.patient_id = p.id
WHERE a.payment_type = 'installment'
  AND a.amount_paid < a.service_price
ORDER BY (a.service_price - a.amount_paid) DESC;

-- 14. Ingresos por fecha
SELECT 
    payment_date,
    SUM(amount) as total_income,
    COUNT(*) as total_payments
FROM payments
WHERE payment_date >= '2026-03-01'
GROUP BY payment_date
ORDER BY payment_date DESC;

-- 15. Ingresos por sucursal
SELECT 
    w.name as work_center,
    SUM(a.amount_paid) as total_collected,
    COUNT(*) as total_appointments
FROM appointments a
JOIN work_centers w ON a.work_center_id = w.id
WHERE a.appointment_date >= '2026-03-01'
GROUP BY w.name
ORDER BY total_collected DESC;

-- 16. Historial de pagos de un paciente
SELECT 
    p.payment_date,
    p.amount,
    p.payment_method,
    p.payment_number,
    a.appointment_code,
    s.name as service_name
FROM payments p
JOIN appointments a ON p.appointment_id = a.id
JOIN services s ON a.service_id = s.id
WHERE p.patient_id = 1
ORDER BY p.payment_date DESC;

-- ============================================
-- CONSULTAS DE SERVICIOS Y SUCURSALES
-- ============================================

-- 17. Servicios más solicitados
SELECT 
    s.name,
    s.branch,
    COUNT(a.id) as times_requested
FROM services s
LEFT JOIN appointments a ON s.id = a.service_id
WHERE a.status NOT IN ('cancelled', 'no_show')
GROUP BY s.id, s.name, s.branch
ORDER BY times_requested DESC;

-- 18. Servicios por sucursal
SELECT 
    branch,
    COUNT(*) as total_services,
    AVG(duration_minutes) as avg_duration
FROM services
WHERE is_active = TRUE  -- PostgreSQL
GROUP BY branch
ORDER BY branch;

WHERE is_active = 1  -- SQL Server
GROUP BY branch
ORDER BY branch;

-- 19. Carga de trabajo por sucursal (próximos 7 días)
SELECT 
    w.name as work_center,
    COUNT(a.id) as scheduled_appointments,
    SUM(s.duration_minutes) as total_minutes
FROM work_centers w
LEFT JOIN appointments a ON w.id = a.work_center_id
    AND a.appointment_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'  -- PostgreSQL
    AND a.status IN ('scheduled', 'confirmed')
LEFT JOIN services s ON a.service_id = s.id
GROUP BY w.name
ORDER BY scheduled_appointments DESC;

    AND a.appointment_date BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 7, GETDATE())  -- SQL Server

-- ============================================
-- CONSULTAS DE EMPLEADOS
-- ============================================

-- 20. Doctores activos por sucursal
SELECT 
    w.name as work_center,
    u.full_name as doctor_name,
    e.specialty,
    e.phone
FROM employees e
JOIN users u ON e.user_id = u.id
JOIN work_centers w ON e.work_center_id = w.id
WHERE u.role = 'doctor'
  AND e.status = 'active'
ORDER BY w.name, u.full_name;

-- 21. Productividad de doctores (citas completadas)
SELECT 
    u.full_name as doctor_name,
    COUNT(*) as total_completed,
    SUM(a.service_price) as total_revenue
FROM appointments a
JOIN employees e ON a.doctor_id = e.id
JOIN users u ON e.user_id = u.id
WHERE a.status = 'completed'
  AND a.appointment_date >= '2026-03-01'
GROUP BY u.full_name
ORDER BY total_completed DESC;

-- ============================================
-- CONSULTAS DE EXPEDIENTES MÉDICOS
-- ============================================

-- 22. Pacientes sin expediente médico
SELECT p.*
FROM patients p
LEFT JOIN medical_records m ON p.id = m.patient_id
WHERE m.id IS NULL;

-- 23. Expedientes actualizados recientemente
SELECT 
    p.name as patient_name,
    m.updated_at,
    u.full_name as assigned_doctor
FROM medical_records m
JOIN patients p ON m.patient_id = p.id
LEFT JOIN employees e ON m.assigned_doctor_id = e.id
LEFT JOIN users u ON e.user_id = u.id
WHERE m.updated_at >= CURRENT_DATE - INTERVAL '30 days'  -- PostgreSQL
ORDER BY m.updated_at DESC;

WHERE m.updated_at >= DATEADD(DAY, -30, GETDATE())  -- SQL Server
ORDER BY m.updated_at DESC;

-- ============================================
-- REPORTES Y ESTADÍSTICAS
-- ============================================

-- 24. Resumen general del sistema
SELECT 
    (SELECT COUNT(*) FROM patients) as total_patients,
    (SELECT COUNT(*) FROM patients WHERE is_new_patient = TRUE) as new_patients,  -- PostgreSQL
    (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') as scheduled_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'completed') as completed_appointments,
    (SELECT COUNT(*) FROM employees WHERE status = 'active') as active_employees;

    (SELECT COUNT(*) FROM patients WHERE is_new_patient = 1) as new_patients,  -- SQL Server

-- 25. Tasa de cancelación de citas
SELECT 
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
    COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(*) as total,
    ROUND(100.0 * COUNT(CASE WHEN status = 'cancelled' THEN 1 END) / COUNT(*), 2) as cancellation_rate,
    ROUND(100.0 * COUNT(CASE WHEN status = 'no_show' THEN 1 END) / COUNT(*), 2) as no_show_rate
FROM appointments
WHERE appointment_date >= '2026-03-01';

-- 26. Pacientes por rango de edad
SELECT 
    CASE 
        WHEN age < 18 THEN 'Menor de 18'
        WHEN age BETWEEN 18 AND 30 THEN '18-30'
        WHEN age BETWEEN 31 AND 50 THEN '31-50'
        WHEN age > 50 THEN 'Mayor de 50'
        ELSE 'Sin edad'
    END as age_range,
    COUNT(*) as total
FROM patients
GROUP BY 
    CASE 
        WHEN age < 18 THEN 'Menor de 18'
        WHEN age BETWEEN 18 AND 30 THEN '18-30'
        WHEN age BETWEEN 31 AND 50 THEN '31-50'
        WHEN age > 50 THEN 'Mayor de 50'
        ELSE 'Sin edad'
    END
ORDER BY age_range;

-- 27. Confirmaciones enviadas
SELECT 
    COUNT(CASE WHEN email_sent = TRUE THEN 1 END) as emails_sent,  -- PostgreSQL
    COUNT(CASE WHEN whatsapp_sent = TRUE THEN 1 END) as whatsapp_sent,
    COUNT(*) as total_appointments
FROM appointments
WHERE appointment_date >= CURRENT_DATE;

    COUNT(CASE WHEN email_sent = 1 THEN 1 END) as emails_sent,  -- SQL Server
    COUNT(CASE WHEN whatsapp_sent = 1 THEN 1 END) as whatsapp_sent,
    COUNT(*) as total_appointments
FROM appointments
WHERE appointment_date >= CAST(GETDATE() AS DATE);

-- ============================================
-- CONSULTAS DE MANTENIMIENTO
-- ============================================

-- 28. Limpiar citas canceladas antiguas (más de 6 meses)
DELETE FROM appointments
WHERE status = 'cancelled'
  AND cancelled_at < CURRENT_DATE - INTERVAL '6 months';  -- PostgreSQL

WHERE status = 'cancelled'
  AND cancelled_at < DATEADD(MONTH, -6, GETDATE());  -- SQL Server

-- 29. Actualizar códigos de paciente faltantes
-- PostgreSQL
UPDATE patients
SET patient_code = 'PAT' || LPAD(id::text, 5, '0')
WHERE patient_code IS NULL;

-- SQL Server
UPDATE patients
SET patient_code = 'PAT' + RIGHT('00000' + CAST(id AS NVARCHAR), 5)
WHERE patient_code IS NULL;

-- 30. Marcar citas pasadas sin actualizar como "no_show"
UPDATE appointments
SET status = 'no_show'
WHERE appointment_date < CURRENT_DATE  -- PostgreSQL
  AND status = 'scheduled';

WHERE appointment_date < CAST(GETDATE() AS DATE)  -- SQL Server
  AND status = 'scheduled';

-- ============================================
-- CONSULTAS AVANZADAS
-- ============================================

-- 31. Pacientes con más de una cita pendiente
SELECT 
    p.name,
    p.phone,
    COUNT(a.id) as pending_appointments
FROM patients p
JOIN appointments a ON p.id = a.patient_id
WHERE a.status IN ('scheduled', 'confirmed')
  AND a.appointment_date >= CURRENT_DATE  -- PostgreSQL
GROUP BY p.id, p.name, p.phone
HAVING COUNT(a.id) > 1
ORDER BY pending_appointments DESC;

  AND a.appointment_date >= CAST(GETDATE() AS DATE)  -- SQL Server

-- 32. Análisis de ocupación por hora del día
SELECT 
    EXTRACT(HOUR FROM appointment_time) as hour,  -- PostgreSQL
    COUNT(*) as total_appointments
FROM appointments
WHERE status NOT IN ('cancelled', 'no_show')
  AND appointment_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY EXTRACT(HOUR FROM appointment_time)
ORDER BY hour;

SELECT 
    DATEPART(HOUR, appointment_time) as hour,  -- SQL Server
    COUNT(*) as total_appointments
FROM appointments
WHERE status NOT IN ('cancelled', 'no_show')
  AND appointment_date >= DATEADD(DAY, -30, GETDATE())
GROUP BY DATEPART(HOUR, appointment_time)
ORDER BY hour;

-- 33. Pacientes frecuentes (más de 5 citas completadas)
SELECT 
    p.name,
    p.email,
    p.phone,
    COUNT(*) as completed_appointments,
    MAX(a.appointment_date) as last_visit
FROM patients p
JOIN appointments a ON p.id = a.patient_id
WHERE a.status = 'completed'
GROUP BY p.id, p.name, p.email, p.phone
HAVING COUNT(*) > 5
ORDER BY completed_appointments DESC;

-- ============================================
-- FIN DE CONSULTAS DE EJEMPLO
-- ============================================
