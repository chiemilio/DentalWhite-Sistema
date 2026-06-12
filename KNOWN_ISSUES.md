# KNOWN_ISSUES.md — Bugs y Deuda Tecnica

## Bugs Criticos

### 1. Admin: Crear paciente no persiste
**Archivo**: `AdminDashboard.tsx`
**Problema**: `handleCreatePatient()` agrega a estado local pero NO llama `POST /patients/`
**Impacto**: Paciente creado se pierde al recargar
**Solucion**: Agregar `apiClient.post('/patients', data)` y actualizar estado con respuesta

### 2. Admin: Editar empleado no persiste
**Archivo**: `AdminDashboard.tsx`
**Problema**: `handleEditEmployee()` actualiza estado local pero NO llama `PUT /employees/{id}`
**Impacto**: Cambios no se guardan
**Solucion**: Agregar `apiClient.put('/employees/${id}', data)`

### 3. Admin: Editar paciente no persiste
**Archivo**: `AdminDashboard.tsx`
**Problema**: `handleEditPatient()` actualiza estado local pero NO llama `PUT /patients/{id}`
**Impacto**: Cambios no se guardan
**Solucion**: Agregar `apiClient.put('/patients/${id}', data)`

### 4. Admin: Citas usa mockData
**Archivo**: `AdminDashboard.tsx`
**Problema**: `initialAppointments` viene de mockData, NO de `GET /appointments/`
**Impacto**: No muestra citas reales del sistema
**Solucion**: Fetch desde API al cargar el componente

### 5. Doctor: Guardar diagnostico no persiste
**Archivo**: `PatientDiagnosisView.tsx`
**Problema**: `handleSave()` solo muestra toast, NO llama API
**Impacto**: Diagnostico perdido al cerrar
**Solucion**: Crear endpoint `POST /consultations/` y llamarlo

### 6. Doctor: Guardar historia clinica no persiste
**Archivo**: `ClinicalHistoryForm.tsx`
**Problema**: `handleSave()` solo muestra toast, NO llama API
**Impacto**: Historia clinica perdida
**Solucion**: Llamar `POST /clinical-history/`

### 7. Doctor: Guardar consentimiento no persiste
**Archivo**: `ConsentForm.tsx`
**Problema**: `handleSave()` solo muestra toast, NO llama API
**Impacto**: Consentimiento perdido
**Solucion**: Crear endpoint de consentimientos

### 8. ProtectedRoute nunca se usa
**Archivo**: `App.tsx`
**Problema**: `<Dashboard />` se renderiza sin `<ProtectedRoute>` wrapper
**Impacto**: Cualquier rol puede manipular state y acceder a cualquier dashboard
**Solucion**: Envoler Dashboard con ProtectedRoute y verificar rol

### 9. PatientContext usa mockData
**Archivo**: `PatientContext.tsx`
**Problema**: `patients` viene de `mockData.ts`, NO de API
**Impacto**: Datos de pacientes no son reales
**Solucion**: Fetch desde `GET /patients/` o eliminar Context si no se usa

### 10. AvailabilityContext: bloqueos son client-side only
**Archivo**: `AvailabilityContext.tsx`
**Problema**: `blockedDays[]` y `blockedTimeSlots[]` se pierden al recargar
**Impacto**: Bloqueos de horarios no persisten
**Solucion**: Persistir en backend via `POST /catalogos/bloqueos-agenda`

### 11. useTokenRefresh llama endpoint que no existe
**Archivo**: `useTokenRefresh.ts`
**Problema**: Llama `/auth/refresh` que NO existe en backend
**Impacto**: Error silencioso cada 60 segundos
**Solucion**: Crear endpoint `POST /auth/refresh` o eliminar el hook

### 12. BackedCatalogItem typo
**Archivo**: `PatientDashboard.tsx:37`
**Problema**: `BackedCatalogItem` (falta 'n') en vez de `BackendCatalogItem`
**Impacto**: Puede causar error de TypeScript en compilation
**Solucion**: Corregir a `BackendCatalogItem`

### 13. Admin Reportes usa datos mock
**Archivo**: `AdminDashboard.tsx`, `ReportsSection.tsx`
**Problema**: Charts usan datos filtrados de local state, NO de API
**Impacto**: Estadisticas incorrectas
**Solucion**: Fetch desde endpoints de reportes o crear endpoint agregado

### 14. Cancelacion inconsistente de estados
**Archivos**: `DoctorDashboard.tsx`, `ReceptionistDashboard.tsx`
**Problema**: Doctor usa `estado_cita_id=3` para "en atencion", Recepcionista usa `3` para "cancelada"
**Impacto**: Estados confusos entre roles
**Solucion**: Estandarizar IDs de estado y documentarlos

---

## Deuda Tecnica

| # | Item | Prioridad |
|---|------|-----------|
| 1 | Sin React Router (usa useState para navegacion) | Alta |
| 2 | Sin tests unitarios ni de integracion | Alta |
| 3 | Sin CI/CD pipeline | Media |
| 4 | SQLAlchemy driver sincrono (no async) | Media |
| 5 | Sin paginacion en listas | Media |
| 6 | Sin error boundary global | Media |
| 7 | Sin confirmacion en acciones destructivas | Baja |
| 8 | appointmentNotifications.ts simula envios | Baja |
| 9 | Paciente no puede ver expediente clinico | Media |
| 10 | Sin restablecimiento de contrasena | Baja |
