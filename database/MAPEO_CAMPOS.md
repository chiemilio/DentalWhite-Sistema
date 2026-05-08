# Mapeo de Campos - Migración a Español con Catálogos

## Guía de Migración del Esquema

Este documento detalla el mapeo entre los nombres de tablas y campos antiguos (en inglés) y los nuevos (en español con catálogos).

---

## Tablas Principales

### users → usuarios
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_usuario | |
| email | correo_electronico | |
| password_hash | contrasena_hash | |
| role | id_rol | **Ahora referencia a cat_roles** |
| full_name | nombre_completo | |
| is_active | esta_activo | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |
| last_login | ultimo_acceso | |

### work_centers → centros_trabajo
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_centro | |
| name | nombre_centro | |
| address | direccion | |
| phone | telefono | |
| email | correo_electronico | |
| is_active | esta_activo | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |

### services → servicios
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_servicio | |
| name | nombre_servicio | |
| description | descripcion | |
| branch | sucursal | |
| duration_minutes | duracion_minutos | |
| is_active | esta_activo | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |

### employees → empleados
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_empleado | |
| user_id | id_usuario | |
| employee_code | codigo_empleado | |
| specialty | especialidad | |
| work_center_id | id_centro | |
| hire_date | fecha_contratacion | |
| status | id_estado | **Ahora referencia a cat_estados_empleado** |
| phone | telefono | |
| emergency_contact | contacto_emergencia | |
| emergency_phone | telefono_emergencia | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |

### patients → pacientes
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_paciente | |
| user_id | id_usuario | |
| patient_code | codigo_paciente | |
| name | nombre_completo | |
| email | correo_electronico | |
| phone | telefono | |
| age | edad | |
| sex | id_sexo | **Ahora referencia a cat_sexos** |
| address | direccion | |
| colony | colonia | |
| delegation | delegacion | |
| municipality | municipio | |
| postal_code | codigo_postal | |
| tutor | tutor | |
| occupation | ocupacion | |
| patient_type | id_tipo_paciente | **Ahora referencia a cat_tipos_paciente** |
| is_new_patient | es_nuevo | |
| registration_date | fecha_registro | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |

### appointments → citas
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_cita | |
| appointment_code | codigo_cita | |
| patient_id | id_paciente | |
| service_id | id_servicio | |
| work_center_id | id_centro | |
| doctor_id | id_medico | |
| appointment_date | fecha_cita | |
| appointment_time | hora_cita | |
| status | id_estado | **Ahora referencia a cat_estados_cita** |
| service_price | precio_servicio | |
| amount_paid | monto_pagado | |
| payment_type | id_tipo_pago | **Ahora referencia a cat_tipos_pago** |
| number_of_payments | numero_pagos | |
| current_payment | pago_actual | |
| notes | notas | |
| cancellation_reason | motivo_cancelacion | |
| email_sent | correo_enviado | |
| whatsapp_sent | whatsapp_enviado | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |
| confirmed_at | fecha_confirmacion | |
| completed_at | fecha_completada | |
| cancelled_at | fecha_cancelacion | |

### payments → pagos
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_pago | |
| appointment_id | id_cita | |
| patient_id | id_paciente | |
| payment_number | numero_pago | |
| amount | monto | |
| payment_date | fecha_pago | |
| payment_method | id_metodo_pago | **Ahora referencia a cat_metodos_pago** |
| receipt_number | numero_recibo | |
| notes | notas | |
| created_by | id_creador | |
| created_at | fecha_creacion | |

### medical_records → expedientes_medicos
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_expediente | |
| patient_id | id_paciente | |
| record_number | numero_expediente | |
| address | direccion | |
| phone | telefono | |
| occupation | ocupacion | |
| age | edad | |
| reference | referencia | |
| sex | id_sexo | **Ahora referencia a cat_sexos** |
| colony | colonia | |
| delegation | delegacion | |
| postal_code | codigo_postal | |
| tutor | tutor | |
| assigned_doctor_id | id_medico_asignado | |
| physical_state | id_estado_fisico | **Ahora referencia a cat_estados_fisicos** |
| dental_state | id_estado_dental | **Ahora referencia a cat_estados_fisicos** |
| pathological_history | antecedentes_patologicos | |
| non_pathological_history | antecedentes_no_patologicos | |
| habit_frequency | frecuencia_habito | |
| habit_duration | duracion_habito | |
| habit_intensity | intensidad_habito | |
| received_medical_attention | recibio_atencion_medica | |
| medical_attention_cause | motivo_atencion_medica | |
| face_exam | examen_cara | |
| holdaway_line | linea_holdaway | |
| oral_exam | examen_bucal | |
| radiographic_exam | examen_radiografico | |
| patient_signature | firma_paciente | |
| legal_guardian_signature | firma_tutor_legal | |
| observations | observaciones | |
| start_date | fecha_inicio | |
| end_date | fecha_fin | |
| created_at | fecha_creacion | |
| updated_at | fecha_actualizacion | |

### appointment_history → historial_citas
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_historial | |
| medical_record_id | id_expediente | |
| appointment_number | numero_cita | |
| appointment_date | fecha_cita | |
| activity | actividad | |
| doctor_name | nombre_medico | |
| notes | notas | |
| created_at | fecha_creacion | |

### blocked_days → dias_bloqueados
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_bloqueo | |
| blocked_date | fecha_bloqueada | |
| work_center_id | id_centro | |
| reason | motivo | |
| is_holiday | es_festivo | |
| blocked_by | id_bloqueador | |
| created_at | fecha_creacion | |

### blocked_time_slots → horarios_bloqueados
| Campo Antiguo | Campo Nuevo | Notas |
|--------------|-------------|-------|
| id | id_horario_bloqueado | |
| blocked_date | fecha_bloqueada | |
| blocked_time | hora_bloqueada | |
| work_center_id | id_centro | |
| reason | motivo | |
| blocked_by | id_bloqueador | |
| created_at | fecha_creacion | |

---

## Nuevas Tablas de Catálogo

### cat_roles
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_rol | INT | ID del rol |
| nombre_rol | VARCHAR(50) | Nombre del rol (paciente, recepcionista, medico, administrador) |
| descripcion | TEXT | Descripción del rol |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: paciente
- 2: recepcionista
- 3: medico
- 4: administrador

### cat_estados_cita
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_estado_cita | INT | ID del estado |
| nombre_estado | VARCHAR(50) | Nombre del estado |
| descripcion | TEXT | Descripción |
| color | VARCHAR(20) | Color hexadecimal para UI |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: agendada (#FFA500)
- 2: confirmada (#4CAF50)
- 3: completada (#2196F3)
- 4: cancelada (#F44336)
- 5: no_asistio (#9E9E9E)

### cat_tipos_pago
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_tipo_pago | INT | ID del tipo de pago |
| nombre_tipo | VARCHAR(50) | Nombre del tipo |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: completo
- 2: a_cuotas

### cat_metodos_pago
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_metodo_pago | INT | ID del método |
| nombre_metodo | VARCHAR(50) | Nombre del método |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: efectivo
- 2: tarjeta
- 3: transferencia
- 4: otro

### cat_estados_empleado
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_estado_empleado | INT | ID del estado |
| nombre_estado | VARCHAR(50) | Nombre del estado |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: activo
- 2: inactivo
- 3: permiso

### cat_tipos_paciente
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_tipo_paciente | INT | ID del tipo |
| nombre_tipo | VARCHAR(50) | Nombre del tipo |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: primera_vez
- 2: regular
- 3: pediatrico

### cat_sexos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_sexo | INT | ID del sexo |
| nombre_sexo | VARCHAR(20) | Nombre |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: Masculino
- 2: Femenino
- 3: Otro

### cat_estados_fisicos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_estado_fisico | INT | ID del estado |
| nombre_estado | VARCHAR(20) | Nombre del estado |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Valores:**
- 1: bueno
- 2: regular
- 3: malo

---

## Conversión de Valores

### Roles (role → id_rol)
```sql
'patient' → 1
'receptionist' → 2
'doctor' → 3
'admin' → 4
```

### Estados de Cita (status → id_estado)
```sql
'scheduled' → 1 (agendada)
'confirmed' → 2 (confirmada)
'completed' → 3 (completada)
'cancelled' → 4 (cancelada)
'no_show' → 5 (no_asistio)
```

### Tipos de Pago (payment_type → id_tipo_pago)
```sql
'complete' → 1 (completo)
'installment' → 2 (a_cuotas)
```

### Métodos de Pago (payment_method → id_metodo_pago)
```sql
'cash' → 1 (efectivo)
'card' → 2 (tarjeta)
'transfer' → 3 (transferencia)
'other' → 4 (otro)
```

### Estados de Empleado (status → id_estado)
```sql
'active' → 1 (activo)
'inactive' → 2 (inactivo)
'on_leave' → 3 (permiso)
```

### Tipos de Paciente (patient_type → id_tipo_paciente)
```sql
'Primera vez' → 1 (primera_vez)
'Regular' → 2 (regular)
'Pediátrico' → 3 (pediatrico)
```

### Sexos (sex → id_sexo)
```sql
'Masculino' → 1
'Femenino' → 2
'Otro' → 3
```

### Estados Físicos (physical_state/dental_state → id_estado_fisico/id_estado_dental)
```sql
'good' → 1 (bueno)
'regular' → 2 (regular)
'bad' → 3 (malo)
```

---

## Vistas Creadas

### vista_citas_completas
Reemplaza: `vw_appointments_full`

Campos disponibles:
- id_cita, codigo_cita, fecha_cita, hora_cita
- estado (nombre en español), color_estado
- nombre_paciente, telefono_paciente, correo_paciente
- nombre_servicio, duracion_minutos
- nombre_centro, direccion_centro
- codigo_medico, nombre_medico
- precio_servicio, monto_pagado, tipo_pago
- numero_pagos, pago_actual, notas
- fecha_creacion, fecha_confirmacion, fecha_completada

### vista_pacientes_completos
Reemplaza: `vw_patients_full`

Campos disponibles:
- Todos los campos de la tabla pacientes
- nombre_sexo (desde catálogo)
- tipo_paciente (desde catálogo)
- correo_usuario, usuario_activo
- total_citas, fecha_ultima_cita

---

## Instrucciones de Uso

1. **Para nuevos proyectos:** Usar directamente los esquemas en español (`postgresql_schema_es.sql` o `sqlserver_schema_es.sql`)

2. **Para migración de proyectos existentes:**
   - Crear las nuevas tablas de catálogo
   - Migrar los datos de las tablas existentes usando este mapeo
   - Actualizar todas las referencias en el código TypeScript/JavaScript

3. **Actualización de código:**
   - Buscar todas las referencias a nombres de tablas/campos antiguos
   - Reemplazar con los nuevos nombres según este mapeo
   - Actualizar los JOINs para incluir las tablas de catálogo donde sea necesario

---

## Beneficios de esta Estructura

✅ **Normalización:** Los catálogos evitan datos duplicados y errores de escritura
✅ **Mantenibilidad:** Fácil agregar/modificar estados, tipos, etc.
✅ **Integridad:** Foreign keys garantizan datos válidos
✅ **Consultas más rápidas:** Índices en IDs en lugar de strings
✅ **Internacionalización:** Fácil traducir los valores del catálogo
✅ **Auditoría:** Tracking de cuándo se crearon/modificaron catálogos
✅ **Flexibilidad:** Activar/desactivar valores sin eliminarlos
