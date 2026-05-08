# 🦷 DENTAL WHITE - Sistema de Gestión Dental v3.0

## 📋 Descripción

Sistema integral de gestión dental con arquitectura completa de catálogos, manejo de expedientes médicos digitales, sistema de citas, recetas electrónicas y gestión multi-sucursal.

**Características Principales:**
- ✅ 9 Catálogos normalizados
- ✅ 13 Tablas principales
- ✅ Sistema completo de citas con bloqueos de agenda
- ✅ Expedientes médicos digitales
- ✅ Recetas electrónicas
- ✅ Gestión de consentimientos con firma digital
- ✅ Multi-sucursal con especialidades por sede
- ✅ Sistema de roles (Admin, Doctor, Recepcionista, Paciente)
- ✅ Vistas responsive con Tailwind CSS v4
- ✅ TypeScript con tipos fuertemente tipados

---

## 🗂️ Estructura del Proyecto

```
dental-white/
├── database/                          # Esquemas de base de datos
│   ├── postgresql_schema_completo.sql # ⭐ ESQUEMA PRINCIPAL PostgreSQL
│   ├── ESTRUCTURA_COMPLETA.md         # 📚 Documentación detallada
│   ├── MAPEO_CAMPOS.md               # Guía de migración
│   └── README.md                      # Información general de BD
│
├── src/
│   └── app/
│       ├── types/                     # Definiciones TypeScript
│       │   ├── database.ts           # ⭐ TIPOS PRINCIPALES
│       │   └── README.md             # Documentación de tipos
│       │
│       ├── components/                # Componentes React
│       │   ├── dashboards/           # Dashboards por rol
│       │   ├── ui/                   # Componentes UI reutilizables
│       │   └── ...
│       │
│       └── context/                   # Contextos de React
│           ├── AuthContext.tsx       # Autenticación
│           ├── PatientContext.tsx    # Gestión de pacientes
│           └── ...
│
├── RESPONSIVE_GUIDE.md               # ⭐ GUÍA DE DISEÑO RESPONSIVE
└── README_V3.md                      # Este archivo
```

---

## 🗄️ BASE DE DATOS

### Catálogos (9 Tablas)

| # | Tabla | Descripción | Registros Iniciales |
|---|-------|-------------|---------------------|
| 1 | `cat_tipos_paciente` | Regular, Pediátrico, Primera Vez | 3 |
| 2 | `cat_sucursales` | Información completa de sucursales | 3 (Pénjamo, Valle, Abasolo) |
| 3 | `cat_nacionalidades` | Países con código ISO | 8 |
| 4 | `cat_roles` | Roles del sistema | 4 |
| 5 | `cat_especialidades` | Especialidades odontológicas | 8 |
| 6 | `cat_servicios` | Servicios con costos y duración | 7 |
| 7 | `cat_medios_contacto` | Web, WhatsApp, Teléfono, Presencial | 4 |
| 8 | `cat_estados_cita` | Estados del flujo de citas | 5 |
| 9 | `cat_tipos_antecedentes` | Categorías de historial clínico | 5 |

### Tablas Principales (13 Tablas)

| # | Tabla | Descripción | Relaciones |
|---|-------|-------------|------------|
| 1 | `usuarios` | Autenticación y datos generales | → nacionalidades, roles |
| 2 | `pacientes` | Información específica de pacientes | → usuarios, tipos_paciente, sucursales |
| 3 | `empleados` | Personal clínico y administrativo | → usuarios, sucursales |
| 4 | `citas` | Sistema de agendamiento | → pacientes, empleados, servicios, etc. |
| 5 | `bloqueos_agenda` | Gestión de disponibilidad | → sucursales, empleados |
| 6 | `consultas` | Información clínica detallada | → citas, pacientes, empleados |
| 7 | `consultas_fotos` | Evidencia fotográfica | → consultas |
| 8 | `recetas` | Recetas médicas | → consultas, empleados, pacientes |
| 9 | `receta_medicamentos` | Medicamentos por receta | → recetas |
| 10 | `sucursal_especialidades` | Especialidades por sucursal (N:N) | → sucursales, especialidades |
| 11 | `empleado_especialidades` | Especialidades por empleado (N:N) | → empleados, especialidades |
| 12 | `historial_clinico` | Antecedentes médicos | → pacientes, tipos_antecedentes |
| 13 | `consentimientos_paciente` | Firmas digitales y consentimientos | → pacientes, servicios, citas |

### Vistas Creadas (3)

- `vista_citas_completas` - Citas con toda la información relacionada
- `vista_pacientes_completos` - Pacientes con estadísticas y edad calculada
- `vista_empleados_completos` - Empleados con especialidades y carga de trabajo

---

## 🔑 CARACTERÍSTICAS PRINCIPALES

### 1. Sistema de Usuarios Robusto
- Múltiples formas de contacto (2 emails, 2 teléfonos, WhatsApp)
- CURP y RFC para pacientes mexicanos
- Nacionalidad con código ISO
- Roles: Admin, Doctor, Recepcionista, Paciente

### 2. Gestión de Sucursales
- Información completa de contacto
- Horarios de apertura y cierre
- URL de Google Maps
- Foto para galería web
- Especialidades disponibles por sucursal

### 3. Sistema de Citas Avanzado
- Múltiples estados del flujo
- Registro del medio de contacto
- Motivo de consulta
- Bloqueos de agenda (días completos o rangos horarios)
- Bloqueos por doctor específico o sucursal completa
- Validación de disponibilidad

### 4. Expedientes Médicos Digitales
- **Consultas** con información clínica detallada:
  - Reconocimiento y hallazgos
  - Diagnóstico
  - Tratamiento e indicaciones
  - Signos vitales completos (peso, talla, temperatura, presión, pulso, glucosa)
  
- **Fotos de consulta**:
  - Evidencia fotográfica (Antes, Durante, Después)
  - Etiquetadas por servicio
  - URL de almacenamiento

- **Recetas electrónicas**:
  - Folio único
  - Signos vitales históricos
  - Medicamentos con presentación, dosis y duración
  - Indicaciones generales
  
- **Historial clínico**:
  - Categorizado por tipo de antecedente
  - Estado activo/inactivo
  - Fecha de diagnóstico
  - Notas adicionales

### 5. Consentimientos Informados
- Texto legal almacenado
- Firma digital en Base64
- IP de registro para validez legal
- Vinculado a servicio y cita específica

### 6. Gestión de Especialidades
- Catálogo centralizado de especialidades
- Asignación flexible a sucursales
- Múltiples especialidades por empleado
- Servicios vinculados a especialidades

---

## 💻 TECNOLOGÍAS

### Backend / Base de Datos
- **PostgreSQL** - Base de datos principal
- **SQL Server** - Soporte alternativo
- Triggers automáticos para `updated_at`
- Vistas materializadas para consultas complejas
- Índices optimizados

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Framework de estilos
- **React Context API** - Gestión de estado
- **React Router** - Navegación

### Características de Frontend
- ✅ **100% Responsive** - Mobile-first design
- ✅ **TypeScript Strict** - Seguridad de tipos
- ✅ **Tailwind CSS v4** - Utilidades modernas
- ✅ **Dark Mode Ready** - Preparado para modo oscuro
- ✅ **Accessible** - Estándares de accesibilidad

---

## 🚀 INSTALACIÓN

### 1. Base de Datos

```bash
# PostgreSQL
psql -U postgres -d dental_white -f database/postgresql_schema_completo.sql

# O crear la BD primero
createdb dental_white
psql -U postgres -d dental_white -f database/postgresql_schema_completo.sql
```

### 2. Frontend

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Build para producción
pnpm build
```

### 3. Variables de Entorno

Crear archivo `.env`:
```env
# Database
DATABASE_URL=postgresql://usuario:password@localhost:5432/dental_white

# JWT
JWT_SECRET=tu_secret_key_aqui
JWT_EXPIRES_IN=7d

# API URLs
API_URL=http://localhost:3000/api
FRONTEND_URL=http://localhost:5173

# WhatsApp (opcional)
WHATSAPP_API_KEY=tu_api_key
WHATSAPP_PHONE=+525512345678

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password
```

---

## 📖 DOCUMENTACIÓN

### Para Desarrolladores

1. **[ESTRUCTURA_COMPLETA.md](database/ESTRUCTURA_COMPLETA.md)** - Documentación detallada de BD
2. **[RESPONSIVE_GUIDE.md](RESPONSIVE_GUIDE.md)** - Guía de diseño responsive
3. **[types/README.md](src/app/types/README.md)** - Documentación de tipos TypeScript
4. **[MAPEO_CAMPOS.md](database/MAPEO_CAMPOS.md)** - Migración desde versión anterior

### Diagramas y Esquemas

```
📊 Base de Datos
    ├── 9 Catálogos
    ├── 13 Tablas Principales
    ├── 3 Vistas
    └── ~40 Índices

🎨 Frontend
    ├── Componentes Responsive
    ├── Contextos de Estado
    ├── Tipos TypeScript
    └── Utilidades
```

---

## 👥 ROLES Y PERMISOS

### 1. Paciente
- ✅ Ver sus propias citas
- ✅ Agendar nuevas citas
- ✅ Ver su historial médico
- ✅ Ver sus recetas
- ✅ Firmar consentimientos
- ❌ No puede ver otros pacientes

### 2. Recepcionista
- ✅ Gestionar agenda completa
- ✅ Registrar pacientes nuevos
- ✅ Agendar citas para cualquier paciente
- ✅ Confirmar/cancelar citas
- ✅ Bloquear horarios
- ✅ Ver reportes de su sucursal
- ❌ No puede acceder a expedientes médicos completos

### 3. Doctor
- ✅ Ver agenda de citas
- ✅ Acceder a expedientes médicos completos
- ✅ Registrar consultas
- ✅ Emitir recetas
- ✅ Ver historial de pacientes
- ✅ Subir fotos de consultas
- ✅ Bloquear su propia agenda
- ❌ No puede gestionar empleados

### 4. Administrador
- ✅ Acceso total al sistema
- ✅ Gestionar usuarios y empleados
- ✅ Gestionar sucursales
- ✅ Ver reportes globales
- ✅ Configurar catálogos
- ✅ Ver todas las sucursales

---

## 📊 FLUJOS PRINCIPALES

### Flujo 1: Registro de Paciente Nuevo (Recepcionista)
```
1. Crear usuario con rol "Paciente"
   - Nombre completo, CURP, RFC
   - Emails y teléfonos
   - Nacionalidad
   
2. Crear registro de paciente
   - Tipo de paciente
   - Fecha de nacimiento
   - Dirección completa
   - Tutor (si es pediátrico)
   
3. (Opcional) Registrar antecedentes
   - Categoría de antecedente
   - Descripción
   - Fecha de diagnóstico
```

### Flujo 2: Agendar Cita (Recepcionista/Paciente)
```
1. Seleccionar sucursal
2. Seleccionar servicio
3. Ver disponibilidad:
   - Verificar días no bloqueados
   - Ver horarios disponibles
4. Seleccionar doctor
5. Ingresar motivo de consulta
6. Confirmar cita
7. Sistema envía confirmación (email/WhatsApp)
```

### Flujo 3: Atender Cita (Doctor)
```
1. Ver citas del día
2. Marcar como "Atendida"
3. Registrar consulta:
   - Hallazgos
   - Diagnóstico
   - Tratamiento
   - Signos vitales
4. (Opcional) Subir fotos antes/después
5. Generar receta si es necesario:
   - Agregar medicamentos
   - Indicaciones generales
6. (Opcional) Solicitar consentimiento firmado
```

### Flujo 4: Generar Reporte (Admin/Recepcionista)
```
1. Seleccionar rango de fechas
2. Filtrar por:
   - Sucursal
   - Doctor
   - Servicio
   - Estado de cita
3. Ver estadísticas:
   - Total de citas
   - Ingresos generados
   - Servicios más solicitados
   - Tasa de asistencia
```

---

## 🎨 DISEÑO RESPONSIVE

### Breakpoints
```
móvil:    < 640px
tablet:   640px - 1024px
desktop:  > 1024px
```

### Patrones Comunes

**Tablas:**
- Móvil: Tarjetas apiladas
- Desktop: Tabla tradicional

**Formularios:**
- Móvil: 1 columna
- Tablet/Desktop: 2 columnas

**Navegación:**
- Móvil: Menú hamburguesa
- Desktop: Menú horizontal

**Tarjetas:**
- Móvil: 1 columna
- Tablet: 2 columnas
- Desktop: 3-4 columnas

Ver [RESPONSIVE_GUIDE.md](RESPONSIVE_GUIDE.md) para detalles completos.

---

## 🔒 SEGURIDAD

### Autenticación
- Contraseñas hasheadas con bcrypt
- JWT para sesiones
- Refresh tokens para renovación

### Validaciones
- CURP: 18 caracteres
- RFC: 13 caracteres
- Email: formato válido
- Teléfono: 10 dígitos
- Campos obligatorios marcados

### Permisos
- Middleware de autenticación
- Validación de roles por endpoint
- Pacientes solo ven su información
- Empleados limitados a su sucursal (excepto admin)

---

## 📈 PRÓXIMOS PASOS

### Fase 1: Backend API (Pendiente)
- [ ] Crear endpoints REST
- [ ] Implementar autenticación JWT
- [ ] Validaciones con Zod
- [ ] Manejo de errores
- [ ] Logging y auditoría

### Fase 2: Integraciones (Pendiente)
- [ ] WhatsApp Business API
- [ ] Servicio de email (SMTP)
- [ ] Google Maps API
- [ ] Almacenamiento de fotos (S3/CloudStorage)
- [ ] Generación de PDFs (recetas, reportes)

### Fase 3: Features Avanzados (Futuro)
- [ ] Dashboard de estadísticas
- [ ] Reportes exportables (Excel, PDF)
- [ ] Notificaciones push
- [ ] Chat interno
- [ ] Sistema de pagos en línea
- [ ] App móvil nativa

---

## 🤝 CONTRIBUCIÓN

Este es un proyecto privado para Dental White. Para contribuir:

1. Revisar documentación completa
2. Seguir guías de estilo (Responsive, TypeScript)
3. Crear branch feature
4. Hacer PR con descripción detallada
5. Esperar revisión de código

---

## 📞 SOPORTE

### Documentación
- Base de datos: `database/ESTRUCTURA_COMPLETA.md`
- TypeScript: `src/app/types/README.md`
- Responsive: `RESPONSIVE_GUIDE.md`

### Contacto
- **Proyecto:** Dental White
- **Doctor:** Dr. Faustino Vázquez Rodríguez
- **Email:** info@dentalwhite.com
- **Sucursales:** Pénjamo, Valle de Santiago, Abasolo (Guanajuato)

---

## 📄 LICENCIA

© 2026 Dental White - Todos los derechos reservados

---

## 🏆 CRÉDITOS

**Desarrollo:**
- Sistema de Gestión Dental v3.0
- Arquitectura de Base de Datos Completa
- TypeScript Types System
- Responsive Design Guide

**Tecnologías:**
- React 18
- TypeScript
- Tailwind CSS v4
- PostgreSQL
- SQL Server

---

**Versión:** 3.0
**Última actualización:** Abril 2026
**Estado:** ✅ Base de Datos y Tipos Completos | ⏳ API Backend Pendiente
