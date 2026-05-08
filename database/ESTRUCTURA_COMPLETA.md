# Estructura Completa de Base de Datos - Dental White v3.0

## 📋 Visión General

Esta es la estructura definitiva de la base de datos para el sistema Dental White, con 9 catálogos y 13 tablas principales que cubren todas las funcionalidades requeridas.

---

## 🗂️ CATÁLOGOS (9 Tablas)

### 1. cat_tipos_paciente
**Tipos de pacientes que atiende la clínica**
- Regular
- Pediátrico
- Primera Vez

### 2. cat_sucursales
**Información completa de sucursales**
- Nombre, dirección
- Teléfonos de contacto (2)
- WhatsApp, email
- URL de Google Maps
- Horarios de apertura y cierre
- Foto para galería web
- Estado activo/inactivo

**Sucursales actuales:**
- Pénjamo
- Valle de Santiago
- Abasolo

### 3. cat_nacionalidades
**Catálogo de nacionalidades con código ISO**
- Código ISO (3 caracteres): MEX, USA, ESP, etc.
- Gentilicio: Mexicana, Estadounidense
- País: México, Estados Unidos

### 4. cat_roles
**Roles del sistema**
- Admin
- Doctor
- Recepcionista
- Paciente

### 5. cat_especialidades
**Especialidades odontológicas**
- Odontología General
- Ortodoncia
- Endodoncia
- Estética Dental
- Odontopediatría
- Periodoncia
- Cirugía Maxilofacial
- Implantología

### 6. cat_servicios
**Servicios ofrecidos vinculados a especialidades**
- Nombre del servicio
- Descripción
- Costo base
- Duración estimada (INTERVAL)
- Requiere fotos (boolean)
- Especialidad a la que pertenece

### 7. cat_medios_contacto
**Medios por los que llegó el paciente**
- Página Web
- WhatsApp
- Teléfono
- Presencial

### 8. cat_estados_cita
**Estados del flujo de citas**
- Pendiente (#FFA500)
- Confirmada (#4CAF50)
- Atendida (#2196F3)
- Cancelada (#F44336)
- No asistió (#9E9E9E)

### 9. cat_tipos_antecedentes
**Categorías de antecedentes médicos**
- Heredofamiliares
- Antecedentes Patológicos
- Antecedentes No Patológicos
- Alergias y Reacciones
- Intervenciones Quirúrgicas

---

## 📊 TABLAS PRINCIPALES (13 Tablas)

### 1. usuarios
**Gestión de autenticación y datos generales**

Campos principales:
- nombre_completo
- curp (18 caracteres)
- rfc (13 caracteres)
- id_nacionalidad → cat_nacionalidades
- id_rol → cat_roles
- email1, email2
- telefono1, telefono2
- whatsapp
- passwd_encript (contraseña hasheada)
- activo
- created_at, updated_at, last_login

**Índices:**
- email1, telefono1, nombre_completo, whatsapp, curp, rol

### 2. pacientes
**Información específica de pacientes**

Campos principales:
- id_usuario → usuarios (UNIQUE)
- id_tipo_paciente → cat_tipos_paciente
- id_sucursal_frecuente → cat_sucursales
- fecha_nacimiento
- sexo (Masculino, Femenino, No binario, No informar)
- direccion_completa
- ocupacion
- nombre_tutor (para pediátricos)
- firma_digitalizada (Base64)
- activo

**Relación 1:1 con usuarios**

### 3. empleados
**Información de personal clínico y administrativo**

Campos principales:
- id_usuario → usuarios (UNIQUE)
- id_sucursal_asignada → cat_sucursales
- cedula_profesional (solo doctores)
- especialidad_principal
- biografia_resumen (para página web)
- foto_perfil_url
- activo

**Relación 1:1 con usuarios**

### 4. citas
**Sistema de agendamiento**

Campos principales:
- id_paciente → pacientes
- id_doctor → empleados
- id_sucursal → cat_sucursales
- id_servicio → cat_servicios
- id_medio_contacto → cat_medios_contacto
- id_estado → cat_estados_cita
- fecha_cita, hora_cita
- motivo_consulta
- notas_adicionales

**Índices compuestos:**
- (fecha_cita, hora_cita)
- Por doctor, sucursal, paciente, estado

### 5. bloqueos_agenda
**Gestión de disponibilidad**

Campos principales:
- id_sucursal → cat_sucursales
- id_doctor → empleados (NULL = toda la sucursal)
- fecha_bloqueo
- hora_inicio, hora_fin (NULL = día completo)
- motivo
- es_festivo
- created_by → usuarios

**Casos de uso:**
- Día festivo (sucursal completa)
- Vacaciones de doctor específico
- Mantenimiento de instalaciones
- Permisos médicos

### 6. consultas
**Información clínica detallada**

Campos principales:
- id_cita → citas (UNIQUE, 1:1)
- id_paciente, id_doctor
- reconocimiento_hallazgos
- diagnostico
- tratamiento_indicaciones
- **Signos vitales:**
  - peso_kg, talla_cm
  - temperatura_c
  - presion_arterial
  - pulso_bpm
  - glucosa_mgdl
- fecha_consulta

### 7. consultas_fotos
**Evidencia fotográfica**

Campos principales:
- id_consulta → consultas
- url_foto
- etiqueta_servicio
- tipo_foto (Antes, Durante, Después)
- fecha_foto

**Uso:** Documentar procedimientos que requieren fotos (blanqueamiento, ortodoncia, estética)

### 8. recetas
**Recetas médicas**

Campos principales:
- id_consulta → consultas (UNIQUE, 1:1)
- id_doctor, id_paciente
- folio (único)
- peso_receta, presion_receta, pulso_receta, glucosa_receta (copia histórica)
- indicaciones_generales
- fecha_emision

### 9. receta_medicamentos
**Tabla asociativa: medicamentos por receta**

Campos principales:
- id_receta → recetas
- nombre_medicamento
- presentacion (ej: "Tabletas 500mg")
- dosis (ej: "1 cada 8 horas")
- duracion (ej: "Por 7 días")

### 10. sucursal_especialidades
**Tabla asociativa: especialidades por sucursal**

Relación N:N entre:
- cat_sucursales
- cat_especialidades

**Ejemplo:**
- Pénjamo: todas las especialidades
- Valle: General, Estética, Cirugía, Implantes
- Abasolo: General, Odontopediatría

### 11. empleado_especialidades
**Tabla asociativa: especialidades por empleado**

Relación N:N entre:
- empleados
- cat_especialidades

**Ejemplo:**
- Dr. Faustino: Odontología General + Estética Dental

### 12. historial_clinico
**Antecedentes médicos del paciente**

Campos principales:
- id_paciente → pacientes
- id_categoria → cat_tipos_antecedentes
- descripcion_padecimiento
- es_activo (boolean)
- fecha_diagnostico
- notas_adicionales

**Ejemplos:**
- Alérgico a la Penicilina
- Hipertensión arterial
- Diabetes tipo 2
- Madre con antecedentes de cáncer

### 13. consentimientos_paciente
**Firmas digitales y consentimientos**

Campos principales:
- id_paciente → pacientes
- id_servicio → cat_servicios
- id_cita → citas (opcional)
- texto_legal_aceptado (copia del texto al momento de firmar)
- firma_base64 (imagen de la firma)
- fecha_firma
- ip_registro (para validez legal)

---

## 🔄 VISTAS CREADAS (3)

### vista_citas_completas
**Citas con toda la información relacionada**

Incluye:
- Datos del paciente completos
- Datos del doctor
- Información de sucursal
- Detalles del servicio y especialidad
- Estado con color
- Medio de contacto

### vista_pacientes_completos
**Pacientes con información agregada**

Incluye:
- Datos personales completos
- Edad calculada
- Tipo de paciente
- Sucursal frecuente
- Nacionalidad
- Total de citas
- Fecha de última cita

### vista_empleados_completos
**Empleados con estadísticas**

Incluye:
- Datos personales
- Rol
- Sucursal asignada
- Lista de especialidades
- Total de citas atendidas

---

## 🔐 SEGURIDAD Y VALIDACIONES

### Constraints CHECK
```sql
-- Sexo
sexo IN ('Masculino', 'Femenino', 'No binario', 'No informar')

-- Tipo de foto
tipo_foto IN ('Antes', 'Durante', 'Después')
```

### Foreign Keys
Todas las relaciones tienen foreign keys definidas con acciones:
- `ON DELETE CASCADE` - Para dependencias fuertes
- `ON DELETE SET NULL` - Para referencias opcionales

### Índices
Optimizados para:
- Búsquedas por email, teléfono, nombre
- Consultas por fecha de cita
- Filtros por sucursal, doctor, estado
- CURP y cédula profesional

### Triggers
Actualización automática de `updated_at`:
- usuarios
- pacientes
- empleados
- citas
- cat_sucursales
- cat_servicios
- historial_clinico

---

## 📈 FLUJOS PRINCIPALES

### Flujo 1: Registro de Paciente Nuevo
1. Crear registro en `usuarios` (rol = Paciente)
2. Crear registro en `pacientes` vinculado al usuario
3. (Opcional) Crear registros en `historial_clinico` si tiene antecedentes

### Flujo 2: Agendar Cita
1. Verificar disponibilidad en `bloqueos_agenda`
2. Verificar horarios ocupados en `citas`
3. Crear registro en `citas`
4. (Opcional) Si requiere consentimiento → `consentimientos_paciente`

### Flujo 3: Atender Cita
1. Actualizar estado de `citas` a "Atendida"
2. Crear registro en `consultas` con información clínica
3. (Si aplica) Crear registros en `consultas_fotos`
4. (Si aplica) Crear `receta` con `receta_medicamentos`
5. (Si hay nuevos antecedentes) Actualizar `historial_clinico`

### Flujo 4: Generar Reporte de Sucursal
1. Consultar `vista_citas_completas`
2. Filtrar por sucursal y rango de fechas
3. Agrupar por servicio, estado, doctor
4. Calcular ingresos sumando `costo_base` de servicios atendidos

---

## 🎨 DATOS DE EJEMPLO

### Usuarios Precargados
- Dr. Faustino Vázquez Rodríguez (Doctor)
- Laura Sánchez Meza (Recepcionista)
- Admin Principal (Admin)
- Juan Pérez Soto (Paciente)
- Ana Rodríguez Luna (Paciente)

### Servicios por Sucursal
**Pénjamo:** Todas las especialidades
**Valle de Santiago:** General, Estética, Cirugía, Implantes
**Abasolo:** General, Odontopediatría

### Ejemplo de Consulta Completa
```sql
-- Ver citas de hoy con toda la información
SELECT * FROM vista_citas_completas
WHERE fecha_cita = CURRENT_DATE
ORDER BY hora_cita;

-- Ver pacientes con sus estadísticas
SELECT * FROM vista_pacientes_completos
WHERE activo = TRUE
ORDER BY total_citas DESC;

-- Ver empleados y su carga de trabajo
SELECT * FROM vista_empleados_completos
WHERE rol = 'Doctor'
ORDER BY total_citas_atendidas DESC;
```

---

## 🔧 MANTENIMIENTO

### Agregar Nueva Sucursal
```sql
INSERT INTO cat_sucursales (
    nombre, direccion, telefono_contacto1, whatsapp, email,
    hora_apertura, hora_cierre, activa
) VALUES (
    'Nueva Sucursal', 'Dirección...', '4611234567', '524611234567',
    'nueva@dentalwhite.com', '09:00:00', '18:00:00', TRUE
);

-- Luego vincular especialidades disponibles
INSERT INTO sucursal_especialidades (id_sucursal, id_especialidad)
VALUES (nueva_id, 1), (nueva_id, 2); -- IDs de especialidades
```

### Agregar Nuevo Servicio
```sql
INSERT INTO cat_servicios (
    id_especialidad, nombre_servicio, descripcion,
    costo_base, duracion_estimada, requiere_fotos
) VALUES (
    1, 'Nuevo Servicio', 'Descripción...',
    1000.00, '01:00:00', FALSE
);
```

### Bloquear Día Festivo
```sql
INSERT INTO bloqueos_agenda (
    id_sucursal, fecha_bloqueo, motivo, es_festivo
) VALUES (
    1, '2026-12-25', 'Navidad', TRUE
);
```

---

## 📊 CONSIDERACIONES DE RENDIMIENTO

### Índices Compuestos Críticos
```sql
-- Para búsquedas de citas por fecha y hora
CREATE INDEX idx_citas_fecha_hora ON citas(fecha_cita, hora_cita);

-- Para reportes por sucursal y fecha
CREATE INDEX idx_citas_sucursal_fecha ON citas(id_sucursal, fecha_cita);
```

### Tamaño Estimado de Tablas
- **usuarios:** ~1000 registros/año
- **pacientes:** ~800 registros/año
- **empleados:** ~20 registros (estable)
- **citas:** ~10,000 registros/año (3 sucursales × 10 citas/día × 365 días)
- **consultas:** ~8,000 registros/año (80% de citas atendidas)
- **recetas:** ~8,000 registros/año
- **receta_medicamentos:** ~24,000 registros/año (promedio 3 medicamentos/receta)

### Estrategia de Backup
- **Diario:** Backup incremental
- **Semanal:** Backup completo
- **Retención:** 30 días (diarios), 12 meses (semanales)

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Implementar esquema en PostgreSQL
2. ✅ Implementar esquema en SQL Server
3. ✅ Crear tipos TypeScript
4. ⏳ Crear API REST con endpoints
5. ⏳ Implementar autenticación JWT
6. ⏳ Crear componentes React responsive
7. ⏳ Implementar sistema de reportes
8. ⏳ Integrar WhatsApp API para confirmaciones
9. ⏳ Implementar sistema de correos automáticos
10. ⏳ Crear panel de estadísticas y dashboards

---

## 📞 Soporte

Para preguntas sobre la estructura de base de datos:
- Revisar este documento
- Consultar `postgresql_schema_completo.sql`
- Ver ejemplos en sección de VISTAS

---

**Versión:** 3.0
**Última actualización:** Abril 2026
**Estado:** ✅ Producción Ready
