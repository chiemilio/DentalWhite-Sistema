# 🚀 Setup de Microservicios - Dental White

## 📁 Estructura del Proyecto

```
dental-white/
├── apps/                              # Aplicaciones frontend
│   └── web/                          # Next.js 15 App
│       ├── src/
│       │   ├── app/                  # App Router (Next.js 15)
│       │   ├── components/
│       │   ├── lib/
│       │   └── styles/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       └── Dockerfile
│
├── services/                          # Microservicios backend
│   ├── api-gateway/                  # API Gateway (Fastify 4.x)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── config/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── auth-service/                 # Servicio de Autenticación
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── models/              # Prisma models
│   │   │   ├── utils/
│   │   │   └── events/              # RabbitMQ events
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── users-service/                # Servicio de Usuarios
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── patients-service/             # Servicio de Pacientes
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── appointments-service/         # Servicio de Citas
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── consultations-service/        # Servicio de Consultas
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── prescriptions-service/        # Servicio de Recetas
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── clinical-history-service/     # Servicio de Historial Clínico
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── notifications-service/        # Servicio de Notificaciones
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── files-service/                # Servicio de Archivos
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── reports-service/              # Servicio de Reportes
│       ├── src/
│       ├── package.json
│       └── Dockerfile
│
├── packages/                          # Paquetes compartidos
│   ├── shared-types/                 # Tipos TypeScript compartidos
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── database.ts
│   │   │   ├── api.ts
│   │   │   └── events.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/                 # Utilidades compartidas
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── event-bus/                    # Cliente de RabbitMQ
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── publisher.ts
│   │   │   └── subscriber.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── trpc-client/                  # Cliente tRPC para inter-service
│       ├── src/
│       │   ├── index.ts
│       │   └── routers/
│       ├── package.json
│       └── tsconfig.json
│
├── k8s/                               # Manifiestos de Kubernetes
│   ├── namespaces/
│   ├── deployments/
│   ├── services/
│   ├── configmaps/
│   ├── secrets/
│   └── ingress/
│
├── monitoring/                        # Configuración de monitoring
│   ├── prometheus.yml
│   └── grafana/
│       └── dashboards/
│
├── database/                          # Esquemas de base de datos
│   ├── postgresql_schema_completo.sql
│   └── migrations/
│
├── docs/                              # Documentación
│   ├── api/
│   ├── architecture/
│   └── deployment/
│
├── .env.example                       # Variables de entorno ejemplo
├── .gitignore
├── docker-compose-microservices.yml   # Docker Compose
├── package-microservices.json         # Root package.json
├── turbo.json                         # Configuración de Turborepo
├── tsconfig.json                      # TypeScript config base
└── README_MICROSERVICES.md            # Este archivo
```

---

## 📦 Versiones de Tecnologías (Abril 2026)

### Runtime y Lenguajes
```json
{
  "node": "22.0.0",
  "pnpm": "9.6.0",
  "typescript": "5.5.4"
}
```

### Backend Frameworks
```json
{
  "fastify": "4.28.1",
  "prisma": "5.18.0",
  "@prisma/client": "5.18.0",
  "@trpc/server": "11.0.0",
  "zod": "3.23.8"
}
```

### Frontend
```json
{
  "react": "18.3.1",
  "next": "15.0.0",
  "@tanstack/react-query": "5.51.1",
  "zustand": "4.5.4",
  "tailwindcss": "4.0.0",
  "shadcn-ui": "latest"
}
```

### Bases de Datos
```json
{
  "postgresql": "16.3",
  "redis": "7.2.5",
  "mongodb": "7.0.12"
}
```

### Mensajería
```json
{
  "rabbitmq": "3.13.6",
  "amqplib": "0.10.4"
}
```

### DevOps
```json
{
  "docker": "25.0.0",
  "kubernetes": "1.30.0",
  "helm": "3.15.0"
}
```

### Monitoring
```json
{
  "prometheus": "2.53.1",
  "grafana": "10.4.5",
  "jaeger": "1.58.1"
}
```

---

## 🔧 Instalación Local

### 1. Prerrequisitos

```bash
# Instalar Node.js 22.x
nvm install 22
nvm use 22

# Instalar pnpm 9.x
npm install -g pnpm@9.6.0

# Instalar Docker y Docker Compose
# https://docs.docker.com/get-docker/

# Verificar versiones
node --version    # v22.0.0
pnpm --version    # 9.6.0
docker --version  # 25.0.0
```

### 2. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/dentalwhite/microservices.git
cd microservices

# Copiar variables de entorno
cp .env.example .env

# Instalar dependencias (con workspaces)
pnpm install
```

### 3. Configurar Variables de Entorno

Editar `.env`:

```env
# ============================================
# BASE DE DATOS
# ============================================
POSTGRES_USER=dental_admin
POSTGRES_PASSWORD=dental_secret_2026
POSTGRES_DB=dental_white
DATABASE_URL=postgresql://dental_admin:dental_secret_2026@localhost:5432/dental_white

# ============================================
# REDIS
# ============================================
REDIS_PASSWORD=dental_redis_2026
REDIS_URL=redis://:dental_redis_2026@localhost:6379

# ============================================
# RABBITMQ
# ============================================
RABBITMQ_USER=dental_admin
RABBITMQ_PASS=dental_rabbit_2026
RABBITMQ_VHOST=dental_vhost
RABBITMQ_URL=amqp://dental_admin:dental_rabbit_2026@localhost:5672/dental_vhost

# ============================================
# JWT
# ============================================
JWT_SECRET=dental_jwt_super_secret_key_2026_change_in_production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# ============================================
# MINIO (S3)
# ============================================
MINIO_ROOT_USER=dental_admin
MINIO_ROOT_PASSWORD=dental_minio_secret_2026
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=dental-files
S3_REGION=us-east-1

# ============================================
# SERVICIOS EXTERNOS
# ============================================

# SendGrid (Email)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@dentalwhite.com

# Twilio (WhatsApp y SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_PHONE_FROM=+15017122661

# ============================================
# FRONTEND
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# ============================================
# MONITORING
# ============================================
PROMETHEUS_PORT=9090
GRAFANA_PORT=4000
JAEGER_PORT=16686
```

### 4. Iniciar Infraestructura

```bash
# Levantar bases de datos y message broker
docker-compose -f docker-compose-microservices.yml up -d postgres redis rabbitmq minio mongodb

# Verificar que estén corriendo
docker ps
```

### 5. Ejecutar Migraciones

```bash
# Migrar cada servicio (en orden de dependencias)
cd services/auth-service
pnpm prisma migrate dev
cd ../..

cd services/users-service
pnpm prisma migrate dev
cd ../..

cd services/patients-service
pnpm prisma migrate dev
cd ../..

# ... repetir para cada servicio
```

### 6. Seed de Datos Iniciales

```bash
# Ejecutar seeds
pnpm seed
```

### 7. Iniciar Microservicios

**Opción A: Con Docker Compose (Recomendado)**
```bash
# Levantar todos los servicios
docker-compose -f docker-compose-microservices.yml up -d

# Ver logs
docker-compose -f docker-compose-microservices.yml logs -f

# Detener todo
docker-compose -f docker-compose-microservices.yml down
```

**Opción B: Desarrollo Local (con Turborepo)**
```bash
# Iniciar todos en modo desarrollo (hot reload)
pnpm dev

# O iniciar servicios específicos
pnpm dev --filter=auth-service
pnpm dev --filter=api-gateway
pnpm dev --filter=web
```

### 8. Verificar Servicios

```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# Prometheus
open http://localhost:9090

# Grafana
open http://localhost:4000
# User: admin, Pass: dental_grafana_2026

# Jaeger UI
open http://localhost:16686

# RabbitMQ Management
open http://localhost:15672
# User: dental_admin, Pass: dental_rabbit_2026

# MinIO Console
open http://localhost:9001
# User: dental_admin, Pass: dental_minio_secret_2026
```

---

## 🏗️ Crear un Nuevo Microservicio

### 1. Generar Estructura

```bash
# Crear carpeta del servicio
mkdir -p services/mi-nuevo-servicio/src

cd services/mi-nuevo-servicio
```

### 2. package.json

```json
{
  "name": "@dental/mi-nuevo-servicio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "start": "node dist/index.js",
    "test": "vitest",
    "lint": "eslint src --ext .ts",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "generate": "prisma generate",
    "studio": "prisma studio"
  },
  "dependencies": {
    "fastify": "^4.28.1",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/rate-limit": "^9.1.0",
    "@prisma/client": "^5.18.0",
    "zod": "^3.23.8",
    "amqplib": "^0.10.4",
    "ioredis": "^5.4.1",
    "pino": "^9.3.2",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/amqplib": "^0.10.5",
    "prisma": "^5.18.0",
    "tsx": "^4.16.2",
    "tsup": "^8.2.3",
    "typescript": "^5.5.4",
    "vitest": "^2.0.4"
  }
}
```

### 3. src/index.ts

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import { connectRabbitMQ } from './events/connection';
import { setupRoutes } from './routes';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

const prisma = new PrismaClient();

// Plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Health check
fastify.get('/health', async () => ({
  status: 'ok',
  service: 'mi-nuevo-servicio',
  timestamp: new Date().toISOString(),
}));

// Routes
setupRoutes(fastify, prisma);

// Start server
const start = async () => {
  try {
    // Connect to RabbitMQ
    await connectRabbitMQ();
    
    // Start Fastify
    await fastify.listen({
      port: Number(process.env.PORT) || 3011,
      host: '0.0.0.0',
    });
    
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 3011}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});
```

### 4. Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model MiModelo {
  id        Int      @id @default(autoincrement())
  campo1    String
  campo2    String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("mi_tabla")
}
```

### 5. Dockerfile

```dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.6.0
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm@9.6.0
RUN pnpm prisma generate
RUN pnpm build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify
COPY --from=builder --chown=fastify:nodejs /app/dist ./dist
COPY --from=builder --chown=fastify:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=fastify:nodejs /app/package.json ./
USER fastify
EXPOSE 3011
CMD ["node", "dist/index.js"]
```

---

## 🔄 Comunicación Entre Servicios

### tRPC (Síncrona)

```typescript
// En packages/trpc-client/src/routers/patients.ts
import { z } from 'zod';
import { procedure, router } from '../trpc';

export const patientsRouter = router({
  getPatient: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // Llamar al microservicio
      const response = await fetch(`http://patients-service:3003/api/patients/${input.id}`);
      return response.json();
    }),
});

// Uso en otro servicio
import { patientsRouter } from '@dental/trpc-client';

const patient = await patientsRouter.getPatient.query({ id: 123 });
```

### RabbitMQ (Asíncrona)

```typescript
// Publicar evento
import { publishEvent } from '@dental/event-bus';

await publishEvent('appointment.created', {
  id: 123,
  patientId: 456,
  date: '2026-04-21',
});

// Escuchar eventos
import { subscribeToEvent } from '@dental/event-bus';

subscribeToEvent('appointment.created', async (data) => {
  console.log('Nueva cita creada:', data);
  // Enviar notificación
  await sendNotification(data);
});
```

---

## 🚀 Deployment

### Kubernetes

```bash
# Crear namespace
kubectl create namespace dental-white

# Aplicar manifiestos
kubectl apply -f k8s/

# Verificar pods
kubectl get pods -n dental-white

# Ver logs
kubectl logs -f -n dental-white deployment/auth-service
```

### Helm

```bash
# Instalar con Helm
helm install dental-white ./helm-charts/dental-white -n dental-white

# Actualizar
helm upgrade dental-white ./helm-charts/dental-white -n dental-white

# Desinstalar
helm uninstall dental-white -n dental-white
```

---

## 📊 Monitoring

### Prometheus Metrics

Cada servicio expone métricas en `/metrics`:

```bash
curl http://localhost:3001/metrics
```

### Grafana Dashboards

Importar dashboards en `monitoring/grafana/dashboards/`

### Distributed Tracing

Ver trazas en Jaeger UI: http://localhost:16686

---

## 🔒 Seguridad

### Secretos

```bash
# Kubernetes secrets
kubectl create secret generic dental-secrets \
  --from-literal=jwt-secret=xxx \
  --from-literal=db-password=xxx \
  -n dental-white
```

### mTLS

Configurar en Service Mesh (Istio/Linkerd)

---

**Versión:** 1.0  
**Última actualización:** Abril 2026  
**Estado:** 📝 Guía de Setup Completa
