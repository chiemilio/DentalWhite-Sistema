# 🗄️ Base de Datos - Dental White

Scripts SQL para crear la base de datos del sistema de gestión dental "Dental White".

## 📋 Contenido

### ✨ Versión 2.0 (Recomendado) - Esquema en Español con Catálogos
- `postgresql_schema_es.sql` - Script PostgreSQL 12+ **TODO EN ESPAÑOL**
- `sqlserver_schema_es.sql` - Script SQL Server 2016+ **TODO EN ESPAÑOL**
- `MAPEO_CAMPOS.md` - Guía de migración de inglés a español

### 📦 Versión 1.0 (Legacy) - Esquema Original
- `postgresql_schema.sql` - Script para PostgreSQL 12+ (inglés)
- `sqlserver_schema.sql` - Script para SQL Server 2016+ (inglés)

### 📚 Documentación
- `README.md` - Este archivo
- `DIAGRAM.md` - Diagramas de la base de datos
- `queries_examples.sql` - Ejemplos de consultas

---

## 🆕 Novedades Versión 2.0

### Cambios Principales:
✅ **TODO en español** - Tablas, campos, vistas, procedimientos  
✅ **Catálogos normalizados** - 8 tablas de catálogo para mejor integridad  
✅ **Nomenclatura consistente** - Convenciones claras y uniformes  
✅ **Mejor rendimiento** - Índices en IDs numéricos en lugar de strings  
✅ **Fácil mantenimiento** - Agregar nuevos valores sin modificar código  

### Nuevas Tablas de Catálogo:
- `cat_roles` - Roles de usuario
- `cat_estados_cita` - Estados de citas con colores para UI
- `cat_tipos_pago` - Tipos de pago
- `cat_metodos_pago` - Métodos de pago
- `cat_estados_empleado` - Estados de empleados
- `cat_tipos_paciente` - Tipos de pacientes
- `cat_sexos` - Catálogo de sexos
- `cat_estados_fisicos` - Estados físicos/dentales

---

## 🚀 Instalación

### PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE dental_white;

# Ejecutar script
\i /path/to/postgresql_schema.sql

# O desde línea de comandos
psql -U postgres -d dental_white -f postgresql_schema.sql
```

### SQL Server

```bash
# Desde SQL Server Management Studio (SSMS):
# 1. Abrir el archivo sqlserver_schema.sql
# 2. Ejecutar (F5)

# O desde línea de comandos:
sqlcmd -S localhost -i sqlserver_schema.sql
```

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción | Registros |
|-------|-------------|-----------|
| `users` | Autenticación y roles de usuarios | Sistema de login |
| `work_centers` | Sucursales (Pénjamo, Valle, Abasolo) | 3 sucursales |
| `services` | Servicios odontológicos por sucursal | 15 servicios |
| `employees` | Personal de la clínica | Doctores, recepción, admin |
| `patients` | Pacientes registrados | Con expedientes |
| `appointments` | Citas médicas | Con pagos y confirmaciones |
| `medical_records` | Expedientes digitales completos | Historial clínico |
| `payments` | Registro de pagos | Completos y a cuotas |
| `blocked_days` | Días bloqueados para citas | Feriados y días inhábiles |
| `blocked_time_slots` | Horarios bloqueados específicos | Control de disponibilidad |
| `appointment_history` | Historial de citas en expedientes | Trazabilidad |

---

## 🔑 Campos Importantes

### Tabla `patients`

```sql
- patient_code: Código único (PAT001, PAT002, etc.)
- name, email, phone: Datos de contacto
- age, sex: Información demográfica
- delegation, municipality: Ubicación
- is_new_patient: Marca si es paciente nuevo registrado por recepción
- registration_date: Fecha de registro
```

### Tabla `appointments`

```sql
- appointment_code: Código único de cita (APT001, APT002, etc.)
- status: scheduled | confirmed | completed | cancelled | no_show
- payment_type: complete | installment
- number_of_payments, current_payment: Para pagos en cuotas
- email_sent, whatsapp_sent: Control de confirmaciones
```

### Tabla `medical_records`

```sql
- Campos JSON para almacenar información compleja:
  * pathological_history (antecedentes patológicos)
  * non_pathological_history (antecedentes no patológicos)
  * face_exam (examen de la cara)
  * holdaway_line (línea de Holdaway)
  * oral_exam (examen bucal)
  * radiographic_exam (examen radiográfico)
  
- patient_signature, legal_guardian_signature: Firmas en Base64
```

---

## 🔐 Usuarios de Ejemplo

**IMPORTANTE:** Las contraseñas deben ser hasheadas en producción.

| Email | Rol | Contraseña (ejemplo) |
|-------|-----|---------------------|
| admin@dentalwhite.com | admin | Password123 |
| recepcion@dentalwhite.com | receptionist | Password123 |
| doctor@dentalwhite.com | doctor | Password123 |
| laura.sanchez@dentalwhite.com | doctor | Password123 |
| paciente@example.com | patient | Password123 |

---

## 🏥 Sucursales (Work Centers)

1. **Pénjamo**
   - Dirección: Calle primero de mayo #9, Pénjamo Gto
   - Teléfono: 4611234567
   - Servicios: 7 servicios

2. **Valle de Santiago**
   - Dirección: Centro, Valle de Santiago Gto
   - Teléfono: 4619876543
   - Servicios: 4 servicios

3. **Abasolo**
   - Dirección: Abasolo Gto
   - Teléfono: 4615551234
   - Servicios: 4 servicios

---

## 📝 Servicios por Sucursal

### Pénjamo
- Limpieza Dental (60 min)
- Ortodoncia (90 min)
- Endodoncia (120 min)
- Extracción (45 min)
- Blanqueamiento (90 min)
- Prótesis Dentales (120 min)
- Revisión General (30 min)

### Valle de Santiago
- Prótesis Dentales (120 min)
- Implantes Dentales (180 min)
- Cirugía Maxilofacial (150 min)
- Periodoncia (90 min)

### Abasolo
- Odontopediatría (60 min)
- Diseño de Sonrisa (120 min)
- Coronas y Puentes (120 min)
- Rehabilitación Oral (150 min)

---

## 🔍 Vistas (Views)

### `vw_appointments_full`
Vista completa de citas con información de paciente, servicio, sucursal y doctor.

```sql
SELECT * FROM vw_appointments_full WHERE appointment_date = '2026-03-20';
```

### `vw_patients_full`
Vista de pacientes con información de usuario y estadísticas de citas.

```sql
SELECT * FROM vw_patients_full WHERE is_new_patient = TRUE;
```

---

## ⚙️ Procedimientos Almacenados (SQL Server)

### `sp_GetAppointmentsByDateAndBranch`
Obtiene citas por fecha y sucursal.

```sql
EXEC sp_GetAppointmentsByDateAndBranch 
    @AppointmentDate = '2026-03-20', 
    @WorkCenterId = 1;
```

### `sp_GetAvailableTimeSlots`
Obtiene horarios disponibles para una fecha y sucursal.

```sql
EXEC sp_GetAvailableTimeSlots 
    @AppointmentDate = '2026-03-20', 
    @WorkCenterId = 1;
```

### `sp_RegisterNewPatient`
Registra un paciente nuevo con código auto-generado.

```sql
DECLARE @PatientId INT;
EXEC sp_RegisterNewPatient 
    @Name = 'Roberto García',
    @Email = 'roberto@example.com',
    @Phone = '4619876543',
    @Age = 35,
    @Sex = 'Masculino',
    @PatientId = @PatientId OUTPUT;
```

---

## 🔄 Triggers

Ambos sistemas incluyen triggers automáticos para actualizar el campo `updated_at` en todas las tablas principales cuando se modifica un registro.

---

## 📌 Índices Creados

Optimización de consultas frecuentes:

- **Búsquedas de pacientes**: Por email, teléfono, nombre, código
- **Citas por fecha**: Índice en appointment_date y appointment_time
- **Citas por doctor**: Índice en doctor_id
- **Días bloqueados**: Índice en blocked_date
- **Empleados por sucursal**: Índice en work_center_id
- **Servicios por sucursal**: Índice en branch

---

## 🛡️ Constraints y Validaciones

### CHECK Constraints

```sql
-- Roles de usuario
role IN ('patient', 'receptionist', 'doctor', 'admin')

-- Estado de citas
status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')

-- Tipo de pago
payment_type IN ('complete', 'installment')

-- Método de pago
payment_method IN ('cash', 'card', 'transfer', 'other')

-- Sexo
sex IN ('Masculino', 'Femenino', 'Otro')

-- Estados de salud
physical_state, dental_state IN ('good', 'bad', 'regular')
```

### Foreign Keys

Todas las relaciones entre tablas están definidas con claves foráneas para mantener la integridad referencial.

---

## 📊 Datos de Ejemplo

El script incluye datos de ejemplo (seeds):

- ✅ 3 Sucursales
- ✅ 15 Servicios
- ✅ 5 Usuarios
- ✅ 4 Empleados
- ✅ 4 Pacientes
- ✅ 4 Citas

---

## 🔒 Seguridad

### Recomendaciones para Producción

1. **Hashear contraseñas** con bcrypt o similar
2. **Cambiar contraseñas por defecto** inmediatamente
3. **Crear usuarios de base de datos** con permisos específicos
4. **Habilitar SSL/TLS** para conexiones
5. **Configurar backups automáticos**
6. **Auditoría de cambios** en tablas críticas
7. **Encriptar datos sensibles** (firmas, información médica)

### Usuarios de Base de Datos Recomendados

```sql
-- PostgreSQL
CREATE USER dental_app WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO dental_app;
GRANT DELETE ON appointments, patients TO dental_app;

-- SQL Server
CREATE LOGIN dental_app WITH PASSWORD = 'secure_password';
CREATE USER dental_app FOR LOGIN dental_app;
GRANT SELECT, INSERT, UPDATE ON SCHEMA::dbo TO dental_app;
```

---

## 🔧 Mantenimiento

### Limpieza de Datos

```sql
-- Eliminar citas canceladas antiguas (más de 6 meses)
DELETE FROM appointments 
WHERE status = 'cancelled' 
  AND cancelled_at < CURRENT_DATE - INTERVAL '6 months'; -- PostgreSQL
  
DELETE FROM appointments 
WHERE status = 'cancelled' 
  AND cancelled_at < DATEADD(MONTH, -6, GETDATE()); -- SQL Server
```

### Backup Recomendado

```bash
# PostgreSQL
pg_dump -U postgres dental_white > backup_$(date +%Y%m%d).sql

# SQL Server
BACKUP DATABASE DentalWhite 
TO DISK = 'C:\Backups\DentalWhite_backup.bak'
WITH FORMAT, COMPRESSION;
```

---

## 📈 Consultas Útiles

### Obtener citas del día

```sql
-- PostgreSQL
SELECT * FROM vw_appointments_full 
WHERE appointment_date = CURRENT_DATE
ORDER BY appointment_time;

-- SQL Server
SELECT * FROM vw_appointments_full 
WHERE appointment_date = CAST(GETDATE() AS DATE)
ORDER BY appointment_time;
```

### Pacientes nuevos registrados hoy

```sql
SELECT * FROM patients 
WHERE registration_date = CURRENT_DATE; -- PostgreSQL

SELECT * FROM patients 
WHERE registration_date = CAST(GETDATE() AS DATE); -- SQL Server
```

### Citas pendientes de pago completo

```sql
SELECT * FROM vw_appointments_full
WHERE payment_type = 'installment'
  AND amount_paid < service_price;
```

### Horarios más populares

```sql
SELECT appointment_time, COUNT(*) as total
FROM appointments
WHERE status NOT IN ('cancelled', 'no_show')
GROUP BY appointment_time
ORDER BY total DESC;
```

---

## 🆘 Solución de Problemas

### Error: "Cannot truncate a table referenced in a foreign key constraint"

```sql
-- Deshabilitar constraints temporalmente (solo desarrollo)
-- PostgreSQL
SET session_replication_role = 'replica';
TRUNCATE TABLE table_name;
SET session_replication_role = 'origin';

-- SQL Server
ALTER TABLE table_name NOCHECK CONSTRAINT ALL;
TRUNCATE TABLE table_name;
ALTER TABLE table_name CHECK CONSTRAINT ALL;
```

### Error: "Duplicate key value violates unique constraint"

Verificar que no existen registros duplicados antes de insertar.

```sql
SELECT email, COUNT(*) 
FROM patients 
GROUP BY email 
HAVING COUNT(*) > 1;
```

---

## 📞 Soporte

Para preguntas o problemas con la base de datos, contactar al equipo de desarrollo.

---

## 📄 Licencia

Este esquema de base de datos es parte del sistema Dental White.
© 2026 Dental White - Todos los derechos reservados.

---

## 📝 Notas de Versión

### Versión 2.0 (Abril 2026) - **ACTUAL**
- ✅ **Migración completa a español** - Todos los nombres de tablas y campos
- ✅ **Catálogos implementados** - 8 tablas de catálogo para normalización
- ✅ **Vistas actualizadas** - `vista_citas_completas`, `vista_pacientes_completos`
- ✅ **Convenciones mejoradas** - Nomenclatura consistente y clara
- ✅ **Documentación completa** - MAPEO_CAMPOS.md para migración
- ✅ **Mejor rendimiento** - Índices optimizados con IDs numéricos
- ✅ **Mantenibilidad** - Fácil agregar/modificar valores en catálogos
- ✅ **Integridad referencial** - Foreign keys a catálogos
- ✅ **Triggers actualizados** - fecha_actualizacion en español
- ✅ **Datos de prueba** - Seeds con nueva estructura

### Versión 1.0 (Marzo 2026) - Legacy
- ✅ Esquema inicial completo (en inglés)
- ✅ Tablas principales creadas
- ✅ Relaciones definidas
- ✅ Índices optimizados
- ✅ Vistas y procedimientos almacenados
- ✅ Datos de ejemplo incluidos
- ✅ Soporte para PostgreSQL y SQL Server
- ✅ Sistema de pacientes nuevos implementado
- ✅ Gestión de disponibilidad de citas
- ✅ Sistema de pagos completos y en cuotas
- ✅ Confirmaciones por email y WhatsApp

---

## 🔄 Migración de v1.0 a v2.0

Si tienes datos en el esquema antiguo (inglés), consulta el archivo **`MAPEO_CAMPOS.md`** que contiene:
- Mapeo completo de tablas antiguas → nuevas
- Mapeo de campos antiguos → nuevos  
- Conversión de valores (ej: 'patient' → 1, 'scheduled' → 1)
- Scripts de migración de ejemplo
- Guía paso a paso para migración segura

**Ejemplo de migración:**
```sql
-- Migrar usuarios de versión 1.0 a 2.0
INSERT INTO usuarios (correo_electronico, contrasena_hash, id_rol, nombre_completo, esta_activo)
SELECT 
    email,
    password_hash,
    CASE role
        WHEN 'patient' THEN 1
        WHEN 'receptionist' THEN 2
        WHEN 'doctor' THEN 3
        WHEN 'admin' THEN 4
    END,
    full_name,
    is_active
FROM users;
```
