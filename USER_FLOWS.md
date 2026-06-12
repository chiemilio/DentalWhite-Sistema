# USER_FLOWS.md — Flujos de Usuario por Rol

## Flujo General

```
Landing Page → Login/Register → Dashboard (segun rol)
```

Sin React Router. State machine via useState en App.tsx:
`landing` → `login` → `register` → `dashboard`

---

## 1. FLUJO PACIENTE

**Credenciales**: `paciente@example.com` / `paciente123`

### 1.1 Login → Dashboard
```
Login → POST /auth/login → JWT token
  → GET /auth/me → user data
  → Dashboard carga:
    → GET /appointments?paciente_id={userId} → citas del paciente
    → GET /catalogos/servicios → catologo de servicios
    → GET /catalogos/sucursales → catologo de sucursales
```

### 1.2 Ver Citas Proximas
```
Pestana "Proximas Citas":
  - Filtra citas con status != cancelado Y fecha >= hoy
  - Muestra: servicio, doctor, fecha, hora, sucursal, estado
  - Puede cancelar cita → DELETE /appointments/{id}
```

### 1.3 Ver Historial
```
Pestana "Historial":
  - Filtra citas completadas O con fecha < hoy
  - Muestra citas pasadas
```

### 1.4 Agendar Cita
```
Click "Agendar Cita" → Dialog se abre
  1. Seleccionar sucursal → GET /catalogos/sucursales
  2. Seleccionar servicio → GET /catalogos/servicios
  3. Seleccionar fecha → validacion: dia no bloqueado
  4. Seleccionar hora → validacion: slot disponible
     → POST /catalogos/validar-disponibilidad/ → {disponible, mensaje}
  5. Confirmar → POST /appointments/
     → Se agrega a estado local inmediatamente
```

**Estado**: Funcional

---

## 2. FLUJO DOCTOR

**Credenciales**: `doctor@dentalwhite.com` / `doctor123`

### 2.1 Login → Dashboard
```
Login → POST /auth/login → JWT token
  → GET /auth/me → user.id
  → GET /employees/?usuario_id={userId} → employee.id
  → GET /appointments/?empleado_id={employeeId} → citas asignadas
```

### 2.2 Ver Citas del Dia
```
Pestana "Citas Confirmadas":
  - Filtra por estado = Confirmada (estado_cita_id = 2)
  - Filtra por fecha seleccionada
  - Muestra: paciente, servicio, hora, sucursal
```

### 2.3 Atender Paciente
```
Click "Atender" en cita
  → PUT /appointments/{id}/status/ → estado_cita_id = 3 (Atendida)
  → Abre PatientDiagnosisView:
    - Info del paciente (nombre, edad)
    - Formulario: motivo, reconocimiento, diagnostico, tratamiento
    - Boton "Guardar" → solo muestra toast (NO persiste a backend) ⚠️
    - Boton "Imprimir" → ventana de impresion
    - Boton "Generar Receta" → abre MedicalPrescription
```

### 2.4 Crear Receta
```
MedicalPrescription:
  - Vitals: peso, TA, pulso, glucosa
  - TX: textarea para indicaciones
  - Boton "Imprimir" → formato imprimible con logo
  - NO persiste a backend ⚠️
```

### 2.5 Ver Historial Clinico
```
Click "Ver Historial" en DoctorDashboard
  → GET /clinical-history/?paciente_id={id}
  → Muestra PrintableMedicalRecord
  - Imprime o exporta a PDF
  - NO persiste desde frontend ⚠️
```

**Estado**: Parcialmente funcional. CRUD de consultas/recetas NO implementado en frontend.

---

## 3. FLUJO RECEPCIONISTA

**Credenciales**: `recepcion@dentalwhite.com` / `recep123`

### 3.1 Login → Dashboard
```
Login → POST /auth/login → JWT token
  → Dashboard carga:
    → GET /appointments?fecha_inicio=...&fecha_fin=... → citas del dia
    → GET /catalogos/sucursales → sucursales
    → GET /employees/ → doctores disponibles
```

### 3.2 Gestionar Citas
```
Tabla de citas con filtros:
  - Filtrar por fecha
  - Filtrar por sucursal
  - Ver estado de cada cita

Acciones:
  - Confirmar cita → PUT /appointments/{id} → estado_cita_id = 2
  - Cancelar cita → PUT /appointments/{id} → estado_cita_id = 3
```

### 3.3 Registrar Pago
```
Click en cita → Dialog de pago
  → GET /payments/cita/{appointmentId}
  → Si no existe pago:
      POST /payments/ → crear pago nuevo
  → Si existe pago:
      PUT /payments/{id} → actualizar (abono parcial)
```

### 3.4 Buscar Paciente
```
Busqueda por nombre/telefono:
  → GET /patients/search/?q={query}
  → Muestra resultados en dropdown
```

### 3.5 Nueva Cita (FAB)
```
Click boton "+" → NewAppointmentDialog
  1. Buscar paciente existente → GET /patients/search/?q=
     O Registrar nuevo paciente
  2. Para paciente nuevo:
     → POST /appointments/register-and-appointment/
     (registra usuario + paciente + cita en una llamada)
  3. Para paciente existente:
     → POST /appointments/
  4. Seleccionar: servicio, doctor, fecha, hora, sucursal
  5. Enviar confirmaciones (simuladas: email + WhatsApp)
```

**Estado**: Funcional con algunas limitaciones en pagos.

---

## 4. FLUJO ADMIN

**Credenciales**: `admin@dentalwhite.com` / `admin123`

### 4.1 Login → Dashboard
```
Login → POST /auth/login → JWT token
  → Dashboard carga con 4 pestanas
```

### 4.2 Gestionar Empleados (pestana Empleados)
```
Tabla de empleados con filtro por rol
  → GET /employees/

Crear empleado:
  → POST /employees/ (crea empleado + usuario)
  ✅ Funcional

Editar empleado:
  ⚠️ Solo modifica estado local, NO llama API

Eliminar empleado:
  → DELETE /employees/{id}
  ✅ Funcional

Activar/Desactivar:
  → PATCH /employees/{id}/toggle-status/
  ✅ Funcional
```

### 4.3 Gestionar Pacientes (pestana Pacientes)
```
Tabla de pacientes
  → GET /patients/
  ✅ Lectura funcional

Crear paciente:
  ⚠️ Solo modifica estado local, NO llama API

Editar paciente:
  ⚠️ Solo modifica estado local, NO llama API
```

### 4.4 Ver Citas (pestana Citas)
```
Tabla de citas
  ⚠️ Usa datos mock, NO llama API

Cancelar cita:
  ⚠️ Solo modifica estado local
```

### 4.5 Reportes (pestana Reportes)
```
Charts con Recharts:
  - Citas por servicio
  - Citas por sucursal
  - Ingresos
  - Estadisticas generales
  ⚠️ Datos mock/local, NO de API
```

**Estado**: Parcialmente funcional. Solo lectura y toggle-status funcionan con API.

---

## Resumen de Estado

| Funcionalidad | Estado |
|---------------|--------|
| Login / Register | ✅ Funcional |
| Token refresh | ✅ Funcional (client-side) |
| Paciente: ver citas | ✅ Funcional |
| Paciente: agendar cita | ✅ Funcional |
| Paciente: cancelar cita | ✅ Funcional |
| Doctor: ver citas | ✅ Funcional |
| Doctor: cambiar estado cita | ✅ Funcional |
| Doctor: diagnostico | ⚠️ Solo local, no persiste |
| Doctor: receta | ⚠️ Solo local, no persiste |
| Doctor: historia clinica | ⚠️ Solo local, no persiste |
| Recepcionista: ver citas | ✅ Funcional |
| Recepcionista: confirmar/cancelar | ✅ Funcional |
| Recepcionista: nuevo paciente+cita | ✅ Funcional |
| Recepcionista: pagos | ✅ Funcional |
| Admin: listar empleados | ✅ Funcional |
| Admin: crear empleado | ✅ Funcional |
| Admin: editar empleado | ⚠️ Solo local |
| Admin: listar pacientes | ✅ Funcional |
| Admin: crear paciente | ⚠️ Solo local |
| Admin: citas | ⚠️ Mock data |
| Admin: reportes | ⚠️ Mock data |
| Validar disponibilidad | ✅ Funcional |
| ProtectedRoute (RBAC frontend) | ❌ No se usa |
| PatientContext (backend) | ❌ Mock data |
| BlockSchedule (persistencia) | ❌ Solo client-side |
