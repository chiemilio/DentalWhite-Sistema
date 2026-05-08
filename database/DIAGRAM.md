# 📊 Diagrama de Base de Datos - Dental White

## Diagrama de Relaciones (ERD)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ PK id           │
│    email        │◄─────────────┐
│    password_hash│              │
│    role         │              │
│    full_name    │              │
│    is_active    │              │
└─────────────────┘              │
        ▲                        │
        │                        │
        │                        │
┌───────┴──────────┐    ┌────────┴──────────┐
│   EMPLOYEES      │    │    PATIENTS       │
├──────────────────┤    ├───────────────────┤
│ PK id            │    │ PK id             │
│ FK user_id       │    │ FK user_id        │
│    employee_code │    │    patient_code   │
│    specialty     │    │    name           │
│ FK work_center_id│    │    email          │
│    hire_date     │    │    phone          │
│    status        │    │    age            │
└──────────────────┘    │    sex            │
        ▲               │    address        │
        │               │    delegation     │
        │               │    is_new_patient │
        │               └───────────────────┘
        │                       ▲
        │                       │
        │                       │
┌───────┴──────────┐    ┌───────┴──────────────┐
│ WORK_CENTERS     │    │   APPOINTMENTS       │
├──────────────────┤    ├──────────────────────┤
│ PK id            │◄───┤ PK id                │
│    name          │    │    appointment_code  │
│    address       │    │ FK patient_id        │
│    phone         │    │ FK service_id        │
│    email         │    │ FK work_center_id    │
└──────────────────┘    │ FK doctor_id         │
        ▲               │    appointment_date  │
        │               │    appointment_time  │
        │               │    status            │
┌───────┴──────────┐    │    service_price     │
│    SERVICES      │    │    amount_paid       │
├──────────────────┤    │    payment_type      │
│ PK id            │◄───┤    email_sent        │
│    name          │    │    whatsapp_sent     │
│    description   │    └──────────────────────┘
│    branch        │            ▲
│    duration_min  │            │
└──────────────────┘            │
                                │
                    ┌───────────┴──────────┐
                    │      PAYMENTS        │
                    ├──────────────────────┤
                    │ PK id                │
                    │ FK appointment_id    │
                    │ FK patient_id        │
                    │    payment_number    │
                    │    amount            │
                    │    payment_date      │
                    │    payment_method    │
                    │ FK created_by        │
                    └──────────────────────┘


┌──────────────────────┐          ┌─────────────────────────┐
│  MEDICAL_RECORDS     │          │  APPOINTMENT_HISTORY    │
├──────────────────────┤          ├─────────────────────────┤
│ PK id                │◄─────────┤ PK id                   │
│ FK patient_id (UQ)   │          │ FK medical_record_id    │
│    record_number     │          │    appointment_number   │
│ FK assigned_doctor_id│          │    appointment_date     │
│    physical_state    │          │    activity             │
│    dental_state      │          │    doctor_name          │
│    pathological_hist │          │    notes                │
│    oral_exam (JSON)  │          └─────────────────────────┘
│    face_exam (JSON)  │
│    radiographic_exam │
│    patient_signature │
│    observations      │
└──────────────────────┘


┌──────────────────────┐          ┌─────────────────────────┐
│   BLOCKED_DAYS       │          │  BLOCKED_TIME_SLOTS     │
├──────────────────────┤          ├─────────────────────────┤
│ PK id                │          │ PK id                   │
│    blocked_date      │          │    blocked_date         │
│ FK work_center_id    │          │    blocked_time         │
│    reason            │          │ FK work_center_id       │
│    is_holiday        │          │    reason               │
│ FK blocked_by        │          │ FK blocked_by           │
└──────────────────────┘          └─────────────────────────┘
```

---

## Relaciones Detalladas

### 1. USERS ↔ EMPLOYEES (1:1)
- Un usuario puede ser un empleado
- CASCADE DELETE: Si se elimina el usuario, se elimina el empleado

### 2. USERS ↔ PATIENTS (1:1 opcional)
- Un usuario puede ser un paciente
- SET NULL: Si se elimina el usuario, el paciente permanece

### 3. WORK_CENTERS ↔ EMPLOYEES (1:N)
- Una sucursal tiene múltiples empleados
- Un empleado pertenece a una sucursal

### 4. PATIENTS ↔ APPOINTMENTS (1:N)
- Un paciente puede tener múltiples citas
- Una cita pertenece a un paciente
- CASCADE DELETE: Si se elimina el paciente, se eliminan sus citas

### 5. SERVICES ↔ APPOINTMENTS (1:N)
- Un servicio puede tener múltiples citas
- Una cita tiene un servicio

### 6. WORK_CENTERS ↔ APPOINTMENTS (1:N)
- Una sucursal tiene múltiples citas
- Una cita se realiza en una sucursal

### 7. EMPLOYEES ↔ APPOINTMENTS (1:N como doctor)
- Un doctor puede tener múltiples citas
- Una cita puede tener un doctor asignado (opcional)

### 8. APPOINTMENTS ↔ PAYMENTS (1:N)
- Una cita puede tener múltiples pagos (cuotas)
- Un pago pertenece a una cita
- CASCADE DELETE: Si se elimina la cita, se eliminan sus pagos

### 9. PATIENTS ↔ MEDICAL_RECORDS (1:1)
- Un paciente tiene un expediente médico
- Un expediente pertenece a un paciente
- CASCADE DELETE: Si se elimina el paciente, se elimina su expediente

### 10. EMPLOYEES ↔ MEDICAL_RECORDS (1:N como doctor asignado)
- Un doctor puede tener múltiples expedientes asignados
- Un expediente tiene un doctor asignado (opcional)

### 11. MEDICAL_RECORDS ↔ APPOINTMENT_HISTORY (1:N)
- Un expediente tiene múltiples registros de historial
- Un registro de historial pertenece a un expediente
- CASCADE DELETE: Si se elimina el expediente, se elimina su historial

### 12. WORK_CENTERS ↔ BLOCKED_DAYS (1:N)
- Una sucursal puede tener días bloqueados
- NULL = bloqueado para todas las sucursales

### 13. WORK_CENTERS ↔ BLOCKED_TIME_SLOTS (1:N)
- Una sucursal puede tener horarios bloqueados
- NULL = bloqueado para todas las sucursales

### 14. EMPLOYEES ↔ BLOCKED_DAYS (1:N como bloqueador)
- Un empleado puede bloquear días
- Registro de quién bloqueó el día

### 15. EMPLOYEES ↔ BLOCKED_TIME_SLOTS (1:N como bloqueador)
- Un empleado puede bloquear horarios
- Registro de quién bloqueó el horario

### 16. EMPLOYEES ↔ PAYMENTS (1:N como creador)
- Un empleado registra pagos
- Registro de quién creó el pago

---

## Tipos de Relaciones

### One-to-One (1:1)
- `users` ↔ `employees` (opcional)
- `users` ↔ `patients` (opcional)
- `patients` ↔ `medical_records` (obligatorio para pacientes)

### One-to-Many (1:N)
- `work_centers` ↔ `employees`
- `work_centers` ↔ `appointments`
- `work_centers` ↔ `blocked_days`
- `work_centers` ↔ `blocked_time_slots`
- `patients` ↔ `appointments`
- `services` ↔ `appointments`
- `employees` (doctor) ↔ `appointments`
- `employees` (doctor) ↔ `medical_records`
- `appointments` ↔ `payments`
- `medical_records` ↔ `appointment_history`

---

## Constraints Importantes

### Primary Keys
Todas las tablas usan `id` como PK con AUTO_INCREMENT/IDENTITY

### Unique Constraints
- `users.email`
- `employees.employee_code`
- `patients.patient_code`
- `patients.user_id` (si existe)
- `medical_records.patient_id`
- `medical_records.record_number`
- `appointments.appointment_code`

### Foreign Keys con CASCADE
- `employees.user_id` → DELETE CASCADE
- `patients.user_id` → DELETE SET NULL
- `appointments.patient_id` → DELETE CASCADE
- `payments.appointment_id` → DELETE CASCADE
- `medical_records.patient_id` → DELETE CASCADE
- `appointment_history.medical_record_id` → DELETE CASCADE

---

## Índices Creados

### Búsqueda rápida de pacientes
- `idx_patients_email`
- `idx_patients_phone`
- `idx_patients_name`
- `idx_patients_patient_code`

### Búsqueda rápida de citas
- `idx_appointments_date`
- `idx_appointments_datetime` (compuesto)
- `idx_appointments_patient`
- `idx_appointments_doctor`
- `idx_appointments_work_center`
- `idx_appointments_status`

### Búsqueda de disponibilidad
- `idx_blocked_days_date`
- `idx_blocked_time_slots_datetime` (compuesto)

### Otros índices importantes
- `idx_users_email`
- `idx_users_role`
- `idx_services_branch`
- `idx_employees_work_center`

---

## Cardinalidades

```
USERS (1) ────── (0..1) EMPLOYEES
USERS (1) ────── (0..1) PATIENTS

WORK_CENTERS (1) ────── (0..*) EMPLOYEES
WORK_CENTERS (1) ────── (0..*) APPOINTMENTS
WORK_CENTERS (1) ────── (0..*) SERVICES (lógico por branch)
WORK_CENTERS (1) ────── (0..*) BLOCKED_DAYS
WORK_CENTERS (1) ────── (0..*) BLOCKED_TIME_SLOTS

PATIENTS (1) ────── (0..*) APPOINTMENTS
PATIENTS (1) ────── (0..1) MEDICAL_RECORDS

SERVICES (1) ────── (0..*) APPOINTMENTS

EMPLOYEES (1) ────── (0..*) APPOINTMENTS (como doctor)
EMPLOYEES (1) ────── (0..*) MEDICAL_RECORDS (como doctor asignado)
EMPLOYEES (1) ────── (0..*) PAYMENTS (como creador)
EMPLOYEES (1) ────── (0..*) BLOCKED_DAYS (como bloqueador)
EMPLOYEES (1) ────── (0..*) BLOCKED_TIME_SLOTS (como bloqueador)

APPOINTMENTS (1) ────── (0..*) PAYMENTS

MEDICAL_RECORDS (1) ────── (0..*) APPOINTMENT_HISTORY
```

---

## Dependencias de Eliminación

### Si eliminas un USER:
- ✅ Se elimina EMPLOYEE relacionado (CASCADE)
- ⚠️ Se mantiene PATIENT pero sin user_id (SET NULL)

### Si eliminas un PATIENT:
- ❌ Se eliminan todas sus APPOINTMENTS (CASCADE)
- ❌ Se elimina su MEDICAL_RECORD (CASCADE)
- ❌ Se elimina APPOINTMENT_HISTORY del expediente (CASCADE)
- ❌ Se eliminan PAYMENTS de sus citas (CASCADE)

### Si eliminas un APPOINTMENT:
- ❌ Se eliminan todos sus PAYMENTS (CASCADE)

### Si eliminas un WORK_CENTER:
- ⚠️ Los EMPLOYEES quedan sin sucursal (permitido)
- ⚠️ Los APPOINTMENTS quedan sin sucursal (no permitido - error FK)
- 💡 Recomendación: Marcar como inactivo en lugar de eliminar

### Si eliminas un EMPLOYEE:
- ⚠️ Las APPOINTMENTS quedan sin doctor (permitido)
- ⚠️ Los MEDICAL_RECORDS quedan sin doctor asignado (permitido)

---

## Integridad Referencial

### Reglas CHECK
- `users.role` IN ('patient', 'receptionist', 'doctor', 'admin')
- `appointments.status` IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')
- `appointments.payment_type` IN ('complete', 'installment')
- `patients.sex` IN ('Masculino', 'Femenino', 'Otro')
- `employees.status` IN ('active', 'inactive', 'on_leave')
- `payments.payment_method` IN ('cash', 'card', 'transfer', 'other')

### Valores por Defecto
- `users.is_active` = TRUE
- `patients.is_new_patient` = TRUE
- `patients.patient_type` = 'Primera vez'
- `appointments.status` = 'scheduled'
- `appointments.amount_paid` = 0
- `appointments.number_of_payments` = 1
- `blocked_days.is_holiday` = FALSE
- Todos los `created_at` = CURRENT_TIMESTAMP

---

## Campos JSON/JSONB

### MEDICAL_RECORDS
Los siguientes campos almacenan datos estructurados en formato JSON:

#### pathological_history
```json
{
  "tonsillitis": false,
  "adenoids": false,
  "herpes": false,
  "flu": false,
  "respiratoryProblems": false
}
```

#### non_pathological_history
```json
{
  "lip": false,
  "tongue": false,
  "objects": false,
  "finger": false,
  "other": ""
}
```

#### face_exam
```json
{
  "form": "symmetric",
  "profile": "Normal",
  "ears": "Normales",
  "tic": "No",
  "rictus": "Normal",
  "bipupilarLine": "Normal"
}
```

#### holdaway_line
```json
{
  "labialMusculature": "normal",
  "mentonianHyperactivity": false
}
```

#### oral_exam
```json
{
  "molarRelation": "Normal",
  "canineRelation": "Normal",
  "incisalRelation": "Normal",
  "overJet": "Normal",
  "overBite": "Normal",
  "openBite": "No",
  "midline": "Normal",
  "absentTeeth": "Ninguna",
  "malformedTeeth": "Ninguna",
  "teethWithCavities": "Ninguna",
  "temporaryTeeth": "Ninguna",
  "posteriorCrossbite": "",
  "brushingTechnique": "good",
  "periodontalState": "good"
}
```

#### radiographic_exam
```json
{
  "cephalography": "Normal",
  "orthoradial": "Normal",
  "palmar": "Normal",
  "occlusal": "Normal",
  "oblique": "Normal",
  "orthopantography": "Normal",
  "mesioradial": "Normal",
  "congenitalAbsence": "Ninguna",
  "supernumerary": "Ninguna",
  "cysts": "Ninguna",
  "periapicalLesions": "Ninguna",
  "inclusions": "Ninguna",
  "radicularResorption": "Ninguna",
  "thirdMolars": "Ninguna",
  "dwarfRoots": "Ninguna",
  "abnormalRoots": "Ninguna"
}
```

---

## Normalización

La base de datos está normalizada hasta la **3ra Forma Normal (3NF)**:

### 1NF (Primera Forma Normal)
- ✅ Todos los campos son atómicos
- ✅ No hay grupos repetitivos
- ✅ Cada tabla tiene una clave primaria

### 2NF (Segunda Forma Normal)
- ✅ Cumple 1NF
- ✅ Todos los atributos no-clave dependen completamente de la clave primaria
- ✅ No hay dependencias parciales

### 3NF (Tercera Forma Normal)
- ✅ Cumple 2NF
- ✅ No hay dependencias transitivas
- ✅ Los campos JSON permiten almacenar datos complejos sin violar 3NF

---

## Optimizaciones

### Índices Compuestos
- `(appointment_date, appointment_time)` para búsquedas de citas
- `(blocked_date, blocked_time)` para verificación de disponibilidad

### Campos Calculados (Views)
- `vw_appointments_full`: Join completo de citas
- `vw_patients_full`: Pacientes con estadísticas

### Triggers
- Actualización automática de `updated_at` en todas las tablas

---

Este diagrama representa la estructura completa de la base de datos Dental White con todas sus relaciones y restricciones.
