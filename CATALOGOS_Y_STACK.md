# 📋 CATÁLOGOS Y STACK TECNOLÓGICO - Dental White v3.0

## 🗂️ CATÁLOGOS DE LA BASE DE DATOS

Los catálogos son tablas de referencia compartidas que todos los microservicios pueden consultar. Están almacenados en la base de datos principal `dental_white`.

### Lista de Catálogos (9 Tablas)

#### 1. **cat_tipos_paciente**
Clasificación de tipos de pacientes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(50) | Tipo de paciente |
| descripcion | TEXT | Descripción del tipo |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_actualizacion | TIMESTAMP | Última actualización |

**Registros Iniciales:**
- General
- VIP
- Corporativo
- Familiar

---

#### 2. **cat_sucursales**
Información de las sucursales/clínicas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre de la sucursal |
| direccion | TEXT | Dirección completa |
| telefono | VARCHAR(20) | Teléfono principal |
| email | VARCHAR(100) | Email de contacto |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_actualizacion | TIMESTAMP | Última actualización |

**Registros Iniciales:**
- Pénjamo (Calle Principal #123, Pénjamo, Guanajuato)
- Valle de Santiago (Av. Central #456, Valle de Santiago, Guanajuato)
- Abasolo (Blvd. Norte #789, Abasolo, Guanajuato)

---

#### 3. **cat_nacionalidades**
Catálogo de nacionalidades con código ISO

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre del país |
| codigo_iso | VARCHAR(3) | Código ISO del país |
| activo | BOOLEAN | Estado activo/inactivo |

**Registros Iniciales:**
- Mexicana (MEX)
- Estadounidense (USA)
- Canadiense (CAN)
- Guatemalteca (GTM)
- Otra (OTH)

---

#### 4. **cat_roles**
Roles del sistema con permisos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(50) | Nombre del rol |
| descripcion | TEXT | Descripción del rol |
| permisos | JSONB | Permisos en formato JSON |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Registros Iniciales:**
- SUPERADMIN (Acceso total)
- ADMIN (Administrador de sucursal)
- DENTISTA (Odontólogo)
- RECEPCIONISTA (Personal de recepción)
- ASISTENTE (Asistente dental)

**Ejemplo de Permisos (JSONB):**
```json
{
  "users": ["read", "create", "update"],
  "patients": ["all"],
  "appointments": ["all"]
}
```

---

#### 5. **cat_especialidades**
Especialidades odontológicas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre de la especialidad |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Registros Iniciales:**
- Odontología General
- Ortodoncia
- Endodoncia
- Periodoncia
- Odontopediatría
- Cirugía Oral
- Prostodoncia
- Estética Dental

---

#### 6. **cat_servicios**
Servicios odontológicos con costos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre del servicio |
| descripcion | TEXT | Descripción |
| precio_base | DECIMAL(10, 2) | Precio base en MXN |
| duracion_minutos | INTEGER | Duración estimada |
| activo | BOOLEAN | Estado activo/inactivo |
| fecha_creacion | TIMESTAMP | Fecha de creación |

**Registros Iniciales:**
- Consulta General ($500.00, 30 min)
- Limpieza Dental ($800.00, 45 min)
- Extracción Simple ($1,200.00, 30 min)
- Extracción Compleja ($2,500.00, 60 min)
- Resina ($1,000.00, 45 min)
- Endodoncia ($3,500.00, 90 min)
- Corona ($5,000.00, 60 min)
- Blanqueamiento ($3,000.00, 60 min)
- Ortodoncia - Consulta ($500.00, 45 min)
- Brackets ($15,000.00, 120 min)

---

#### 7. **cat_medios_contacto**
Medios por los cuales los pacientes contactan

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(50) | Nombre del medio |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |

**Registros Iniciales:**
- Teléfono
- WhatsApp
- Email
- Redes Sociales
- Visita Directa

---

#### 8. **cat_estados_cita**
Estados del flujo de citas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(50) | Nombre del estado |
| color | VARCHAR(7) | Color en hexadecimal |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |

**Registros Iniciales:**
- Programada (#3B82F6 - Azul)
- Confirmada (#10B981 - Verde)
- En Curso (#F59E0B - Amarillo)
- Completada (#6366F1 - Índigo)
- Cancelada (#EF4444 - Rojo)
- No Asistió (#9CA3AF - Gris)
- Reagendada (#8B5CF6 - Púrpura)

---

#### 9. **cat_tipos_antecedentes**
Categorías de antecedentes médicos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre del antecedente |
| categoria | VARCHAR(50) | Categoría médica |
| descripcion | TEXT | Descripción |
| activo | BOOLEAN | Estado activo/inactivo |

**Registros Iniciales:**
- Diabetes (Patológicos)
- Hipertensión (Patológicos)
- Cardiopatías (Patológicos)
- Asma (Patológicos)
- Alergias Medicamentosas (Alérgicos)
- Tabaquismo (No Patológicos)
- Alcoholismo (No Patológicos)
- Embarazo (Gineco-obstétricos)
- Cirugías Previas (Quirúrgicos)
- VIH/SIDA (Patológicos)

---

## 🎯 USO DE LOS CATÁLOGOS

### ¿Dónde están almacenados?
Base de datos: **`dental_white`** (base de datos compartida)

### ¿Quién los usa?
**Todos los microservicios** pueden leer estos catálogos para:
- Validar datos
- Mostrar opciones en formularios (dropdowns)
- Aplicar reglas de negocio
- Generar reportes

### ¿Quién los modifica?
- **Admin Service** o **API Gateway** con permisos de SUPERADMIN
- Scripts de migración/seed
- Panel administrativo del sistema

### Ejemplo de Uso en un Microservicio

```typescript
// En cualquier microservicio
import { PrismaClient } from '@prisma/client';

// Cliente conectado a dental_white
const catalogosDB = new PrismaClient({
  datasources: {
    db: {
      url: process.env.CATALOGOS_DATABASE_URL
    }
  }
});

// Obtener sucursales activas
const sucursales = await catalogosDB.cat_sucursales.findMany({
  where: { activo: true }
});

// Obtener servicios con precio
const servicios = await catalogosDB.cat_servicios.findMany({
  where: { activo: true },
  select: {
    id: true,
    nombre: true,
    precio_base: true,
    duracion_minutos: true
  }
});
```

---

# 🛠️ STACK TECNOLÓGICO COMPLETO

## 📦 Backend - Microservicios

### Runtime y Lenguaje
- **Node.js** `22.x` - Runtime JavaScript/TypeScript
- **TypeScript** `5.5.4` - Lenguaje con tipado estático
- **pnpm** `9.6.0` - Gestor de paquetes eficiente

### Frameworks Web
- **Fastify** `4.28.1` - Framework web de alto rendimiento
  - `@fastify/cors` `9.0.1` - CORS
  - `@fastify/helmet` `11.1.1` - Seguridad HTTP
  - `@fastify/jwt` `8.0.0` - Autenticación JWT
  - `@fastify/rate-limit` `9.1.0` - Rate limiting

### ORM y Base de Datos
- **Prisma** `5.18.0` - ORM con type-safety
  - `@prisma/client` `5.18.0` - Cliente generado
  - Migrations automáticas
  - Prisma Studio para administración

### Comunicación entre Servicios
- **tRPC** `11.0.0` - Type-safe RPC (síncrono)
- **RabbitMQ** `3.13.x` - Message broker (asíncrono)
  - `amqplib` `0.10.4` - Cliente AMQP

### Validación y Schemas
- **Zod** `3.23.8` - Validación de schemas TypeScript-first

### Seguridad
- **bcryptjs** `2.4.3` - Hashing de contraseñas
- **jsonwebtoken** - JWT tokens
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Control de acceso

### Caché y Sesiones
- **ioredis** `5.4.1` - Cliente Redis para Node.js

### Logging
- **Pino** `9.3.2` - Logger estructurado JSON
  - `pino-pretty` `11.2.2` - Pretty print para desarrollo

### Testing
- **Vitest** `2.0.5` - Framework de testing

### Build y Dev Tools
- **tsx** `4.16.5` - TypeScript execution
- **Turborepo** `2.0.14` - Monorepo con build cache
- **ESLint** `9.9.0` - Linter
- **Prettier** `3.3.3` - Formateador de código

---

## 🗄️ Bases de Datos

### Principal
- **PostgreSQL** `16.x` - Base de datos relacional
  - 8 bases de datos independientes:
    - `dental_auth` - Autenticación
    - `dental_users` - Usuarios y empleados
    - `dental_patients` - Pacientes
    - `dental_appointments` - Citas
    - `dental_consultations` - Consultas
    - `dental_prescriptions` - Recetas
    - `dental_clinical_history` - Historial clínico
    - `dental_white` - **Catálogos compartidos** y reportes

### Caché
- **Redis** `7.x` - In-memory data store
  - Caché de queries
  - Sesiones activas
  - Rate limiting

### Logs y Auditoría
- **MongoDB** `7.x` - NoSQL para logs
  - Logs de aplicación
  - Auditoría de eventos
  - Métricas históricas

### Almacenamiento de Archivos
- **MinIO** - Object storage S3-compatible
  - Fotos de consultas
  - Documentos de pacientes
  - Recetas en PDF
  - Imágenes del sistema

---

## 📡 Mensajería y Eventos

- **RabbitMQ** `3.13.x` - AMQP Message Broker
  - Exchange: `dental-white-events` (tipo: topic)
  - Queues por servicio
  - Dead letter queues
  - Management UI (puerto 15672)

### Eventos del Sistema
```
auth.user.logged_in
auth.user.logged_out
auth.user.registered
auth.password.changed
auth.token.refreshed
auth.login.failed
users.created
users.updated
patients.created
patients.updated
appointments.created
appointments.confirmed
appointments.cancelled
consultations.completed
prescriptions.generated
```

---

## 📊 Observabilidad y Monitoreo

### Métricas
- **Prometheus** `2.53.1` - Recolección de métricas
  - Scraping interval: 15s
  - Puerto: 9090

### Visualización
- **Grafana** `10.4.5` - Dashboards
  - Puerto: 4000
  - Dashboards predefinidos para cada servicio
  - Alertas configurables

### Distributed Tracing
- **Jaeger** `1.58.1` - Trazas distribuidas
  - Puerto UI: 16686
  - Sampling rate: 10%
  - Correlación de requests entre servicios

### Logs (Opcional)
- **Elasticsearch** `8.x` - Búsqueda de logs
- **Logstash** - Agregación de logs
- **Kibana** - Visualización de logs
- **Filebeat** - Shipper de logs

---

## 🎨 Frontend

### Framework
- **Next.js** `15.x` - React framework
  - App Router
  - Server Components
  - Server Actions
  - Streaming SSR

### UI
- **React** `18.3.1` - Librería de UI
- **Tailwind CSS** `4.x` - Framework de estilos
- **Shadcn/ui** - Componentes UI
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconos

### Estado y Data Fetching
- **tRPC Client** `11.0.0` - Type-safe API calls
- **TanStack Query** `5.51.1` - Data fetching y caché
- **Zustand** `4.5.4` - Estado global ligero

### Formularios
- **React Hook Form** `7.55.0` - Gestión de formularios
- **Zod** `3.23.8` - Validación

### Otros
- **date-fns** - Manejo de fechas
- **sonner** - Toast notifications
- **motion** - Animaciones
- **recharts** - Gráficos

---

## 🐳 DevOps y Orquestación

### Contenedores
- **Docker** `25.x` - Contenedorización
- **Docker Compose** - Orquestación local
  - `docker-compose-microservices.yml` - Todos los servicios

### Orquestación Producción
- **Kubernetes** `1.30.x` - Orquestador de contenedores
- **Helm** `3.15.x` - Package manager para K8s
- **kubectl** - CLI de Kubernetes

### CI/CD (Planeado)
- **GitHub Actions** - Pipeline de CI/CD
- **ArgoCD** - GitOps deployment
- **Terraform** - Infrastructure as Code

### Reverse Proxy
- **Nginx** - Load balancer y reverse proxy
  - En producción delante del API Gateway

---

## 🔧 Herramientas de Desarrollo

### Monorepo
```json
{
  "workspaces": [
    "services/*",    // Microservicios
    "packages/*",    // Paquetes compartidos
    "apps/*"         // Aplicaciones frontend
  ]
}
```

### Package Management
- **pnpm workspaces** - Gestión de monorepo
- **Turborepo** - Build cache inteligente
  - Caché de builds
  - Paralelización de tareas
  - Dependencias entre packages

---

## 🔐 Seguridad

### Autenticación
- JWT (Access + Refresh tokens)
- Sessions en Redis
- Rate limiting por IP
- Bcrypt para passwords

### Comunicación
- HTTPS en producción
- mTLS entre microservicios (opcional)
- API Gateway con autenticación

### Secrets Management (Producción)
- Kubernetes Secrets
- HashiCorp Vault (opcional)
- AWS Secrets Manager (opcional)

---

## 🌐 Integraciones Externas

### Email
- **SendGrid** - Servicio de email transaccional

### SMS y WhatsApp
- **Twilio** - SMS y WhatsApp Business API

### Mapas
- **Google Maps API** - Localización de sucursales

### Pagos (Planeado)
- **Stripe** - Procesamiento de pagos

### Imágenes (Alternativa)
- **Cloudinary** - CDN y optimización de imágenes

### Cloud (Producción)
- **AWS** - Infraestructura cloud
  - S3 para archivos
  - SES para emails
  - RDS para PostgreSQL (opcional)
  - ElastiCache para Redis (opcional)

### Error Tracking
- **Sentry** - Monitoreo de errores en producción

### Push Notifications
- **Firebase Cloud Messaging** - Notificaciones push móviles

---

## 📈 Métricas y Versiones

### Versiones Exactas del Proyecto

```json
{
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=9.6.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.5.4",
    "turbo": "^2.0.14",
    "prettier": "^3.3.3",
    "eslint": "^9.9.0"
  }
}
```

### Auth Service (Implementado)
```json
{
  "dependencies": {
    "fastify": "^4.28.1",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^8.0.0",
    "@fastify/rate-limit": "^9.1.0",
    "@prisma/client": "^5.18.0",
    "amqplib": "^0.10.4",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "ioredis": "^5.4.1",
    "pino": "^9.3.2",
    "pino-pretty": "^11.2.2",
    "zod": "^3.23.8"
  }
}
```

---

## 🎯 Arquitectura de Microservicios

### Microservicios (11 Total)

| # | Servicio | Puerto | Base de Datos | Estado |
|---|----------|--------|---------------|--------|
| 1 | API Gateway | 3000 | - | ⏳ Pendiente |
| 2 | Auth Service | 3001 | dental_auth | ✅ **Implementado** |
| 3 | Users Service | 3002 | dental_users | ⏳ Pendiente |
| 4 | Patients Service | 3003 | dental_patients | ⏳ Pendiente |
| 5 | Appointments Service | 3004 | dental_appointments | ⏳ Pendiente |
| 6 | Consultations Service | 3005 | dental_consultations | ⏳ Pendiente |
| 7 | Prescriptions Service | 3006 | dental_prescriptions | ⏳ Pendiente |
| 8 | Clinical History Service | 3007 | dental_clinical_history | ⏳ Pendiente |
| 9 | Notifications Service | 3008 | - | ⏳ Pendiente |
| 10 | Files Service | 3009 | - | ⏳ Pendiente |
| 11 | Reports Service | 3010 | dental_white | ⏳ Pendiente |

### Infraestructura

| Servicio | Puerto(s) | Uso |
|----------|-----------|-----|
| PostgreSQL | 5432 | 8 bases de datos + catálogos |
| Redis | 6379 | Caché y sesiones |
| RabbitMQ | 5672, 15672 | Message broker + UI |
| MinIO | 9000, 9001 | Object storage + Console |
| MongoDB | 27017 | Logs y auditoría |
| Prometheus | 9090 | Métricas |
| Grafana | 4000 | Dashboards |
| Jaeger | 16686 | Distributed tracing |

---

## 📦 Resumen del Stack

```
┌─────────────────────────────────────────────┐
│           FRONTEND (Next.js 15)             │
│   React 18 + Tailwind CSS + tRPC Client    │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│           API GATEWAY (Fastify)             │
│    Routing + Auth + Rate Limiting           │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│          11 MICROSERVICIOS                  │
│  Node 22 + TypeScript + Fastify + Prisma   │
└─────────────────────────────────────────────┘
         ↓              ↓              ↓
┌───────────────┐ ┌──────────┐ ┌──────────────┐
│  PostgreSQL   │ │  Redis   │ │   RabbitMQ   │
│   (8 DBs)     │ │  (Cache) │ │   (Events)   │
└───────────────┘ └──────────┘ └──────────────┘
         ↓                            ↓
┌───────────────┐              ┌──────────────┐
│    MinIO      │              │   MongoDB    │
│  (Files S3)   │              │    (Logs)    │
└───────────────┘              └──────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│            OBSERVABILIDAD                   │
│  Prometheus + Grafana + Jaeger              │
└─────────────────────────────────────────────┘
```

---

**Versión del Stack:** 3.0.0  
**Última actualización:** 21 de Abril de 2026  
**Microservicios implementados:** 1/11 (Auth Service)  
**Catálogos:** 9 tablas en `dental_white`
