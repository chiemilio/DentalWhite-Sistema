# API_REFERENCE.md — Dental White Backend

Base URL: `http://192.168.1.81:8000/api/v1`

## Autenticacion

Todos los endpoints protegidos requieren:
```
Authorization: Bearer <jwt_token>
```

Obtener token: `POST /auth/login`

## Auth — `/api/v1/auth`

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/login` | No | Login. Body: `{email, password}`. Retorna `{access_token, user}` |
| POST | `/register` | No | Registro como paciente. Body: `{email, password, nombre, apellido_paterno, telefono}` |
| GET | `/me` | JWT | Info del usuario actual |

## Usuarios — `/api/v1/users`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Admin, SuperAdmin | Listar usuarios |
| GET | `/{user_id}` | JWT | Admin, SuperAdmin | Obtener usuario |
| PUT | `/{user_id}` | JWT | Admin, SuperAdmin | Actualizar usuario |
| DELETE | `/{user_id}` | JWT | SuperAdmin | Eliminar (soft delete) |

## Pacientes — `/api/v1/patients`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Todos | Listar pacientes |
| GET | `/search?q=&limit=` | No | Publico | Buscar por nombre/telefono/expediente |
| GET | `/{patient_id}` | JWT | Todos | Obtener paciente |
| POST | `/` | JWT | Admin, Recepcionista | Crear paciente |
| PUT | `/{patient_id}` | JWT | Admin, Recepcionista | Actualizar paciente |
| DELETE | `/{patient_id}` | JWT | Admin | Eliminar paciente |

## Empleados — `/api/v1/employees`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Todos | Listar empleados. Filtros: `usuario_id`, `es_doctor` |
| GET | `/{employee_id}` | JWT | Todos | Obtener empleado |
| POST | `/` | JWT | Admin, SuperAdmin | Crear empleado |
| PUT | `/{employee_id}` | JWT | Admin, SuperAdmin | Actualizar empleado |
| DELETE | `/{employee_id}` | JWT | Admin | Eliminar empleado |
| PATCH | `/{employee_id}/toggle-status/` | JWT | Admin | Activar/desactivar |

## Citas — `/api/v1/appointments`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Todos | Listar. Filtros: `fecha_inicio`, `fecha_fin`, `paciente_id`, `usuario_id`, `empleado_id`, `estado_id`, `sucursal_id` |
| GET | `/{id}` | JWT | Todos | Obtener cita |
| POST | `/` | JWT | Todos | Crear cita. Resolve paciente/empleado por usuario_id o entity_id |
| PUT | `/{id}` | JWT | Admin, Recepcionista, Doctor | Actualizar cita |
| PUT | `/{id}/status/` | JWT | Admin, Recepcionista, Doctor | Actualizar estado |
| DELETE | `/{id}` | JWT | Admin, Recepcionista | Eliminar cita |
| POST | `/register-and-appointment/` | JWT | Admin, Recepcionista | Registrar paciente + crear cita en una llamada |

**AppointmentCreate**:
```json
{
  "paciente_id": 10,
  "empleado_id": 3,
  "servicio_id": 1,
  "sucursal_id": 1,
  "estado_cita_id": 1,
  "fecha_hora": "2026-06-15T10:00:00",
  "duracion_minutos": 30,
  "motivo": "Dolor de muelas"
}
```

**AppointmentUpdate**:
```json
{
  "estado_cita_id": 2,
  "notas": "Paciente confirmo asistencia"
}
```

## Consultas — `/api/v1/consultations`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Admin, Doctor | Listar. Filtro: `paciente_id` |
| GET | `/{id}` | JWT | Admin, Doctor | Obtener consulta |
| POST | `/` | JWT | Admin, Doctor | Crear consulta (1:1 con cita) |
| PUT | `/{id}` | JWT | Admin, Doctor | Actualizar consulta |
| DELETE | `/{id}` | JWT | Admin | Eliminar |

**ConsultationCreate**:
```json
{
  "cita_id": 5,
  "peso": 70,
  "talla": 1.70,
  "presion_sistolica": 120,
  "presion_diastolica": 80,
  "motivo_consulta": "Dolor persistente",
  "diagnostico": "Caries dental",
  "plan_tratamiento": "Obturacion"
}
```

## Recetas — `/api/v1/prescriptions`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Admin, Doctor | Listar. Filtro: `paciente_id` |
| GET | `/{id}` | JWT | Admin, Doctor | Obtener receta |
| GET | `/folio/{folio}` | JWT | Admin, Doctor | Buscar por folio (formato: YYYYMM-NNNNN) |
| POST | `/` | JWT | Admin, Doctor | Crear receta con medicamentos |
| DELETE | `/{id}` | JWT | Admin | Eliminar |

**PrescriptionCreate**:
```json
{
  "consulta_id": 5,
  "indicaciones_generales": "Tomar cada 8 horas",
  "medicamentos": [
    {
      "medicamento": "Ibuprofeno",
      "presentacion": "Tabletas 400mg",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas",
      "duracion": "5 dias",
      "indicaciones": "Tomar con alimentos"
    }
  ]
}
```

## Historial Clinico — `/api/v1/clinical-history`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Admin, Doctor | Listar. Filtros: `paciente_id`, `activo` |
| GET | `/{id}` | JWT | Admin, Doctor | Obtener registro |
| POST | `/` | JWT | Admin, Doctor | Crear registro |
| PUT | `/{id}` | JWT | Admin, Doctor | Actualizar registro |
| DELETE | `/{id}` | JWT | Admin | Eliminar |

## Pagos — `/api/v1/payments`

| Metodo | Ruta | Auth | Roles | Descripcion |
|--------|------|------|-------|-------------|
| GET | `/` | JWT | Todos | Listar pagos activos |
| GET | `/{payment_id}` | No | Publico | Obtener pago |
| GET | `/cita/{cita_id}` | No | Publico | Pago por cita |
| POST | `/` | JWT | Recepcionista | Crear pago (auto-genera numero recibo) |
| PUT | `/{payment_id}` | JWT | Recepcionista | Actualizar pago (registra abonos parciales) |
| GET | `/{payment_id}/abonos` | JWT | Recepcionista | Ver abonos parciales |

**PaymentCreate**:
```json
{
  "cita_id": 5,
  "paciente_id": 10,
  "monto_total": 500.00,
  "metodo_pago_id": 1,
  "tipo_pago_id": 1,
  "notas": "Pago completo"
}
```

## Catalogos — `/api/v1/catalogos`

**Todos los endpoints son PUBLICOS (sin auth)**

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/roles` | Roles del sistema |
| GET | `/sucursales` | Sucursales |
| GET | `/servicios` | Servicios dentales |
| GET | `/estados-cita` | Estados de cita |
| GET | `/estadoscita` | Alias de estados-cita |
| GET | `/tipos-paciente` | Tipos de paciente |
| GET | `/tipos-antecedente` | Tipos de antecedentes clinicos |
| GET | `/bloqueos-agenda?sucursal_id=` | Bloqueos de agenda |
| GET | `/horarios?sucursal_id=` | Horarios disponibles |
| POST | `/validar-disponibilidad/` | Validar slot. Body: `{fecha, hora, sucursal_id?, empleado_id?}` |
| GET | `/debug-horarios` | Debug (solo dev) |
| GET | `/debug-citas` | Debug (solo dev) |
| GET | `/debug-bloqueos` | Debug (solo dev) |

## Errores Comunes

| Codigo | Significado |
|--------|-------------|
| 400 | Bad Request — datos invalidos o entidad no existe |
| 401 | Unauthorized — token invalido o ausente |
| 403 | Forbidden — rol sin permisos |
| 404 | Not Found — recurso no encontrado |
| 422 | Unprocessable Entity — error de validacion Pydantic |
| 429 | Too Many Requests — rate limit excedido |

## Matriz de Permisos

| Endpoint | SuperAdmin | Admin | Recepcionista | Doctor | Paciente |
|----------|:---:|:---:|:---:|:---:|:---:|
| users/* | CRUD | CRUD | - | - | - |
| patients/* | CRUD | CRUD | CRUD | R | - |
| employees/* | CRUD | CRUD | - | R | - |
| appointments/* | CRUD | CRUD | CRUD | RU | C(R) |
| consultations/* | CRUD | CRUD | - | CRUD | - |
| prescriptions/* | CRUD | CRUD | - | CRU(D) | - |
| clinical-history/* | CRUD | CRUD | - | CRUD | - |
| payments/* | CRUD | CRUD | CRUD | R | - |
| catalogos/* | R | R | R | R | R |

**C**=Create, **R**=Read, **U**=Update, **D**=Delete
