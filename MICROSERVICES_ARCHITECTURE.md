# 🏗️ Arquitectura de Microservicios - Dental White

## 📋 Visión General

Sistema Dental White diseñado como microservicios independientes, escalables y resilientes, utilizando las últimas tecnologías (2026).

---

## 🎯 Principios de Diseño

1. **Database per Service** - Cada microservicio tiene su propia base de datos
2. **API First** - Contratos de API bien definidos
3. **Event-Driven** - Comunicación asíncrona mediante eventos
4. **Stateless Services** - Servicios sin estado para escalabilidad
5. **Circuit Breaker** - Resiliencia ante fallos
6. **Observability** - Logs, métricas y trazas distribuidas
7. **Security First** - Autenticación y autorización en cada capa

---

## 🔧 Stack Tecnológico (Últimas Versiones)

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | 22.x LTS | Runtime principal |
| **TypeScript** | 5.5.x | Lenguaje |
| **Fastify** | 4.x | Framework HTTP (más rápido que Express) |
| **Prisma** | 5.x | ORM y migraciones |
| **tRPC** | 11.x | RPC type-safe entre servicios |
| **Zod** | 3.x | Validación de esquemas |
| **JWT** | 9.x | Autenticación |

### Bases de Datos
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **PostgreSQL** | 16.x | Base de datos principal |
| **Redis** | 7.x | Cache y sesiones |
| **MongoDB** | 7.x | Documentos (logs, auditoría) |

### Mensajería
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **RabbitMQ** | 3.13.x | Message broker |
| **Apache Kafka** | 3.7.x | Event streaming (alternativa) |

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.3.x | UI Library |
| **Next.js** | 15.x | Framework React |
| **TanStack Query** | 5.x | Data fetching |
| **Zustand** | 4.x | State management |
| **Tailwind CSS** | 4.x | Estilos |
| **shadcn/ui** | Latest | Componentes |

### DevOps
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Docker** | 25.x | Containerización |
| **Kubernetes** | 1.30.x | Orquestación |
| **Helm** | 3.x | Package manager K8s |
| **Prometheus** | 2.x | Métricas |
| **Grafana** | 10.x | Visualización |
| **Jaeger** | 1.x | Trazas distribuidas |
| **ELK Stack** | 8.x | Logs |

---

## 🏢 Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTES                            │
│   Web App (Next.js)  │  Mobile App  │  Admin Dashboard     │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────┐
│                      API GATEWAY                            │
│         (Kong / Nginx / Traefik / Express Gateway)         │
│   - Rate Limiting  - Auth  - Routing  - Load Balancing    │
└─────┬──────────────────────────────────────────────────────┘
      │
      ├─────────────────────────────────────────────────────┐
      │                                                     │
      ▼                                                     ▼
┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐
│   Auth      │  │    Users     │  │  Patients  │  │ Appointments │
│  Service    │  │   Service    │  │  Service   │  │   Service    │
│             │  │              │  │            │  │              │
│ - Login     │  │ - CRUD Users │  │ - CRUD Pts │  │ - Agendar   │
│ - JWT       │  │ - Roles      │  │ - Firma    │  │ - Cancelar  │
│ - Refresh   │  │ - Permisos   │  │ - Historia │  │ - Bloqueos  │
└──────┬──────┘  └──────┬───────┘  └─────┬──────┘  └──────┬───────┘
       │                │                │                 │
       │         ┌──────┴────────┬───────┴─────────┬───────┘
       │         │               │                 │
       ▼         ▼               ▼                 ▼
┌──────────┐  ┌─────────┐  ┌──────────┐  ┌────────────┐
│PostgreSQL│  │  Redis  │  │PostgreSQL│  │ PostgreSQL │
│  Auth    │  │ (Cache) │  │ Patients │  │   Citas    │
└──────────┘  └─────────┘  └──────────┘  └────────────┘

      │
      ├─────────────────────────────────────────────────────┐
      │                                                     │
      ▼                                                     ▼
┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐
│Consultations │  │ Prescriptions│  │  Clinical│  │Notifications│
│   Service    │  │   Service    │  │  History │  │  Service    │
│              │  │              │  │  Service │  │             │
│ - Signos     │  │ - Recetas    │  │ - Antec. │  │ - Email     │
│ - Diagnóstico│  │ - Medicamen. │  │ - Consen.│  │ - WhatsApp  │
│ - Tratamiento│  │ - Folio      │  │          │  │ - SMS       │
└──────┬───────┘  └──────┬───────┘  └────┬─────┘  └──────┬─────┘
       │                 │                │                │
       ▼                 ▼                ▼                ▼
┌──────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐
│PostgreSQL│  │ PostgreSQL │  │PostgreSQL│  │   Redis    │
│ Consultas│  │  Recetas   │  │ Historia │  │   Queue    │
└──────────┘  └────────────┘  └──────────┘  └────────────┘

      │
      ├─────────────────────────────┐
      │                             │
      ▼                             ▼
┌──────────┐            ┌────────────────┐
│  Files   │            │    Reports     │
│ Service  │            │    Service     │
│          │            │                │
│ - S3/Min.│            │ - Analytics    │
│ - Fotos  │            │ - Dashboard    │
│ - Firmas │            │ - Export PDF   │
└────┬─────┘            └────────┬───────┘
     │                           │
     ▼                           ▼
┌─────────┐            ┌────────────────┐
│  MinIO  │            │   PostgreSQL   │
│   S3    │            │  (Read Replicas)│
└─────────┘            └────────────────┘

            ┌─────────────────────┐
            │   MESSAGE BROKER    │
            │  RabbitMQ / Kafka   │
            │                     │
            │ - Event Bus         │
            │ - Pub/Sub           │
            │ - Dead Letter Queue │
            └─────────────────────┘
```

---

## 📦 Microservicios Detallados

### 1. 🔐 Auth Service (Puerto 3001)
**Responsabilidad:** Autenticación y autorización

**Endpoints:**
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña
- `GET /api/auth/verify` - Verificar token

**Base de Datos:** PostgreSQL (usuarios básicos, tokens)
**Cache:** Redis (refresh tokens, blacklist)

**Eventos que emite:**
- `user.logged_in`
- `user.logged_out`
- `user.registered`

---

### 2. 👥 Users Service (Puerto 3002)
**Responsabilidad:** Gestión de usuarios y empleados

**Endpoints:**
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/users/:id/roles` - Roles del usuario
- `GET /api/employees` - Listar empleados
- `POST /api/employees` - Crear empleado

**Base de Datos:** PostgreSQL (usuarios, empleados, roles)

**Eventos que emite:**
- `user.created`
- `user.updated`
- `user.deleted`
- `employee.created`

---

### 3. 🏥 Patients Service (Puerto 3003)
**Responsabilidad:** Gestión de pacientes

**Endpoints:**
- `GET /api/patients` - Listar pacientes
- `GET /api/patients/:id` - Obtener paciente
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente
- `GET /api/patients/:id/history` - Historial del paciente
- `POST /api/patients/:id/signature` - Guardar firma

**Base de Datos:** PostgreSQL (pacientes)

**Eventos que emite:**
- `patient.created`
- `patient.updated`
- `patient.signature_uploaded`

---

### 4. 📅 Appointments Service (Puerto 3004)
**Responsabilidad:** Gestión de citas y disponibilidad

**Endpoints:**
- `GET /api/appointments` - Listar citas
- `GET /api/appointments/:id` - Obtener cita
- `POST /api/appointments` - Agendar cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Cancelar cita
- `GET /api/appointments/availability` - Ver disponibilidad
- `POST /api/appointments/blocks` - Bloquear horarios
- `GET /api/appointments/calendar/:date` - Calendario

**Base de Datos:** PostgreSQL (citas, bloqueos)

**Eventos que emite:**
- `appointment.created` → Notifications Service
- `appointment.confirmed` → Notifications Service
- `appointment.cancelled` → Notifications Service
- `appointment.completed`

**Eventos que escucha:**
- `consultation.created` → Marca cita como atendida

---

### 5. 🩺 Consultations Service (Puerto 3005)
**Responsabilidad:** Consultas médicas

**Endpoints:**
- `GET /api/consultations` - Listar consultas
- `GET /api/consultations/:id` - Obtener consulta
- `POST /api/consultations` - Crear consulta
- `PUT /api/consultations/:id` - Actualizar consulta
- `POST /api/consultations/:id/photos` - Subir fotos
- `GET /api/consultations/patient/:patientId` - Consultas del paciente

**Base de Datos:** PostgreSQL (consultas, fotos)

**Eventos que emite:**
- `consultation.created`
- `consultation.photo_uploaded`

---

### 6. 💊 Prescriptions Service (Puerto 3006)
**Responsabilidad:** Recetas médicas

**Endpoints:**
- `GET /api/prescriptions` - Listar recetas
- `GET /api/prescriptions/:id` - Obtener receta
- `POST /api/prescriptions` - Crear receta
- `PUT /api/prescriptions/:id` - Actualizar receta
- `GET /api/prescriptions/folio/:folio` - Buscar por folio
- `GET /api/prescriptions/patient/:patientId` - Recetas del paciente
- `GET /api/prescriptions/:id/pdf` - Generar PDF

**Base de Datos:** PostgreSQL (recetas, medicamentos)

**Eventos que emite:**
- `prescription.created` → Notifications Service
- `prescription.pdf_generated`

---

### 7. 📋 Clinical History Service (Puerto 3007)
**Responsabilidad:** Historial clínico y antecedentes

**Endpoints:**
- `GET /api/clinical-history/patient/:patientId` - Historial del paciente
- `POST /api/clinical-history` - Agregar antecedente
- `PUT /api/clinical-history/:id` - Actualizar antecedente
- `DELETE /api/clinical-history/:id` - Eliminar antecedente
- `POST /api/clinical-history/consent` - Guardar consentimiento
- `GET /api/clinical-history/consent/:patientId` - Consentimientos

**Base de Datos:** PostgreSQL (historial, consentimientos)

**Eventos que emite:**
- `clinical_history.updated`
- `consent.signed`

---

### 8. 📧 Notifications Service (Puerto 3008)
**Responsabilidad:** Envío de notificaciones

**Endpoints:**
- `POST /api/notifications/email` - Enviar email
- `POST /api/notifications/whatsapp` - Enviar WhatsApp
- `POST /api/notifications/sms` - Enviar SMS
- `GET /api/notifications/templates` - Plantillas

**Base de Datos:** Redis (cola de mensajes)
**Integraciones:** SendGrid, Twilio, WhatsApp Business API

**Eventos que escucha:**
- `appointment.created` → Enviar confirmación
- `appointment.reminder` → Enviar recordatorio
- `prescription.created` → Enviar notificación

---

### 9. 📁 Files Service (Puerto 3009)
**Responsabilidad:** Almacenamiento de archivos

**Endpoints:**
- `POST /api/files/upload` - Subir archivo
- `GET /api/files/:id` - Obtener archivo
- `DELETE /api/files/:id` - Eliminar archivo
- `GET /api/files/url/:id` - URL temporal
- `POST /api/files/signature` - Guardar firma digital

**Storage:** MinIO (S3-compatible) o AWS S3

**Eventos que emite:**
- `file.uploaded`
- `file.deleted`

---

### 10. 📊 Reports Service (Puerto 3010)
**Responsabilidad:** Reportes y analytics

**Endpoints:**
- `GET /api/reports/dashboard` - Dashboard principal
- `GET /api/reports/appointments` - Reporte de citas
- `GET /api/reports/revenue` - Reporte de ingresos
- `GET /api/reports/patients` - Reporte de pacientes
- `GET /api/reports/export/pdf` - Exportar PDF
- `GET /api/reports/export/excel` - Exportar Excel

**Base de Datos:** PostgreSQL (read replicas)

---

### 11. 🌐 API Gateway (Puerto 3000)
**Responsabilidad:** Punto de entrada único

**Funciones:**
- Enrutamiento a microservicios
- Autenticación (verificar JWT)
- Rate limiting
- Load balancing
- Request/Response transformation
- Circuit breaker
- Logging y monitoring

**Tecnología:** Kong / Express Gateway / Traefik

---

## 🔄 Comunicación Entre Servicios

### Síncrona (Request/Response)
**Tecnología:** tRPC 11.x
- Type-safe
- No necesita generar código
- Auto-completado en IDE

```typescript
// appointments-service llama a patients-service
const patient = await patientsClient.getPatient.query({ id: patientId });
```

### Asíncrona (Event-Driven)
**Tecnología:** RabbitMQ 3.13.x

**Exchanges:**
- `dental.topic` - Eventos del dominio
- `dental.fanout` - Broadcast
- `dental.direct` - Mensajes directos

**Ejemplo de flujo:**
```
1. Appointment Service → RabbitMQ: "appointment.created"
2. Notifications Service ← RabbitMQ: Escucha y envía email
3. Reports Service ← RabbitMQ: Actualiza estadísticas
```

---

## 🗄️ Estrategia de Base de Datos

### Database Per Service Pattern

Cada microservicio tiene su propia base de datos PostgreSQL:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  auth-service   │  │ patients-service │  │appointments-srv │
│                 │  │                  │  │                 │
│ ┌─────────────┐ │  │ ┌──────────────┐ │  │ ┌─────────────┐ │
│ │PostgreSQL   │ │  │ │ PostgreSQL   │ │  │ │PostgreSQL   │ │
│ │ auth_db     │ │  │ │ patients_db  │ │  │ │ appts_db    │ │
│ └─────────────┘ │  │ └──────────────┘ │  │ └─────────────┘ │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Shared Data Pattern
Para datos de catálogos compartidos:

**Opción 1:** Service per catalog
```
catalog-service → cat_sucursales, cat_roles, cat_servicios
```

**Opción 2:** Replicar catálogos (recomendado para alto rendimiento)
```
Cada servicio tiene copia local de catálogos
Sincronización vía eventos
```

---

## 🔒 Seguridad

### Autenticación
1. **Cliente** → API Gateway: `Authorization: Bearer <JWT>`
2. **API Gateway** → Auth Service: Verificar token
3. **API Gateway** → Microservicio: Forward con user context

### Autorización
```typescript
// Middleware en cada microservicio
async function authorize(roles: string[]) {
  // Verificar que el usuario tenga el rol requerido
  if (!roles.includes(req.user.role)) {
    throw new ForbiddenError();
  }
}
```

### Comunicación Inter-Service
- **mTLS (Mutual TLS)** para servicios internos
- **Service Mesh (Istio/Linkerd)** opcional para producción

---

## 📈 Observabilidad

### Logs
**Stack:** ELK (Elasticsearch, Logstash, Kibana)
- Logs centralizados
- Búsqueda full-text
- Dashboards personalizados

### Métricas
**Stack:** Prometheus + Grafana
```
- Request rate
- Error rate
- Response time
- CPU/Memory usage
- Database connections
```

### Trazas Distribuidas
**Stack:** Jaeger / Zipkin
```
Request ID propagation
End-to-end tracing
Performance bottlenecks
```

### Health Checks
```
GET /health      → Basic health
GET /health/live → Liveness probe (K8s)
GET /health/ready → Readiness probe (K8s)
```

---

## 🚀 Deployment

### Docker Compose (Desarrollo)
```yaml
version: '3.8'
services:
  api-gateway:
    build: ./services/api-gateway
    ports: ["3000:3000"]
  
  auth-service:
    build: ./services/auth-service
    depends_on: [postgres-auth, redis]
  
  # ... más servicios
```

### Kubernetes (Producción)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appointments-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: appointments-service
  template:
    spec:
      containers:
      - name: appointments
        image: dental-white/appointments:v1.0.0
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

## 📊 Escalabilidad

### Horizontal Scaling
```
appointments-service:
  - Instancia 1 (Pod 1)
  - Instancia 2 (Pod 2)
  - Instancia 3 (Pod 3)
  └─ Load Balancer
```

### Database Scaling
```
PostgreSQL:
  - Master (Read/Write)
  - Replica 1 (Read-only)
  - Replica 2 (Read-only)
```

### Cache Strategy
```
Redis:
  - L1: Local cache (in-memory)
  - L2: Redis (distributed)
  - TTL: 5 minutos para datos frecuentes
```

---

## 🔄 CI/CD Pipeline

```
┌─────────┐    ┌──────┐    ┌────────┐    ┌────────┐
│  Git    │───▶│ Build│───▶│  Test  │───▶│ Deploy │
│ Commit  │    │Docker│    │ E2E/Int│    │  K8s   │
└─────────┘    └──────┘    └────────┘    └────────┘
```

**Herramientas:**
- GitHub Actions / GitLab CI
- Docker Hub / Harbor
- Kubernetes / Helm
- ArgoCD (GitOps)

---

## 📚 Próximos Pasos

1. ✅ Definir arquitectura ← **COMPLETADO**
2. ⏳ Crear estructura de carpetas
3. ⏳ Configurar Docker Compose
4. ⏳ Implementar API Gateway
5. ⏳ Implementar Auth Service
6. ⏳ Implementar demás servicios
7. ⏳ Configurar RabbitMQ
8. ⏳ Implementar tRPC para comunicación
9. ⏳ Configurar Observabilidad
10. ⏳ Deployment en Kubernetes

---

**Versión:** 1.0
**Última actualización:** Abril 2026
**Estado:** 📐 Diseño Arquitectónico Completo
