# 🚀 Quick Start - Dental White Microservices

Guía rápida para poner en marcha el sistema de microservicios Dental White.

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** >= 22.0.0
- **pnpm** >= 9.6.0
- **Docker** >= 25.0.0
- **Docker Compose** >= 2.24.0

```bash
# Verificar versiones
node --version  # v22.x.x
pnpm --version  # 9.6.0
docker --version  # Docker version 25.x.x
docker compose version  # Docker Compose version v2.24.x
```

## 🎯 Inicio Rápido (Opción 1: Docker Compose)

La forma más rápida de ejecutar todo el sistema:

### 1. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.microservices.example .env

# Editar si es necesario (opcional para desarrollo)
# Las variables por defecto funcionan para desarrollo local
```

### 2. Levantar infraestructura y servicios

```bash
# Levantar toda la infraestructura y microservicios
docker compose -f docker-compose-microservices.yml up -d

# Ver logs en tiempo real
docker compose -f docker-compose-microservices.yml logs -f

# Ver logs de un servicio específico
docker compose -f docker-compose-microservices.yml logs -f auth-service
```

### 3. Verificar que todo esté funcionando

```bash
# Health check del auth service
curl http://localhost:3001/api/v1/auth/health

# Verificar PostgreSQL
docker exec -it dental-postgres psql -U dental_admin -d dental_white -c "\l"

# Verificar Redis
docker exec -it dental-redis redis-cli -a dental_redis_2026 ping

# Verificar RabbitMQ Management UI
# Abrir en navegador: http://localhost:15672
# Usuario: dental_admin
# Contraseña: dental_rabbit_2026
```

### 4. Ejecutar migraciones

```bash
# Auth Service
docker exec -it dental-auth-service pnpm migrate:deploy
```

### 5. Acceder a las interfaces

- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672 (dental_admin / dental_rabbit_2026)
- **MinIO Console**: http://localhost:9001 (dental_admin / dental_minio_secret_2026)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:4000 (admin / dental_grafana_2026)
- **Jaeger UI**: http://localhost:16686

## 🛠️ Desarrollo Local (Opción 2: Sin Docker)

Para desarrollo activo con hot-reload:

### 1. Levantar solo la infraestructura

```bash
# Modificar docker-compose para comentar los servicios
# O crear un docker-compose-infra.yml solo con:
# - postgres
# - redis
# - rabbitmq
# - minio
# - mongodb

docker compose -f docker-compose-microservices.yml up -d postgres redis rabbitmq minio mongodb
```

### 2. Configurar cada microservicio

```bash
# Auth Service
cd services/auth-service
cp .env.example .env
pnpm install
pnpm generate
pnpm migrate
pnpm dev
```

### 3. Ejecutar en modo desarrollo

```bash
# Desde la raíz del proyecto (usando Turborepo)
pnpm install
pnpm dev

# Esto ejecutará todos los servicios en modo desarrollo con hot-reload
```

## 📦 Estructura de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| API Gateway | 3000 | http://localhost:3000 |
| Auth Service | 3001 | http://localhost:3001 |
| Users Service | 3002 | http://localhost:3002 |
| Patients Service | 3003 | http://localhost:3003 |
| Appointments Service | 3004 | http://localhost:3004 |
| Consultations Service | 3005 | http://localhost:3005 |
| Prescriptions Service | 3006 | http://localhost:3006 |
| Clinical History Service | 3007 | http://localhost:3007 |
| Notifications Service | 3008 | http://localhost:3008 |
| Files Service | 3009 | http://localhost:3009 |
| Reports Service | 3010 | http://localhost:3010 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| RabbitMQ AMQP | 5672 | localhost:5672 |
| RabbitMQ Management | 15672 | http://localhost:15672 |
| MinIO API | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |
| MongoDB | 27017 | localhost:27017 |
| Prometheus | 9090 | http://localhost:9090 |
| Grafana | 4000 | http://localhost:4000 |
| Jaeger UI | 16686 | http://localhost:16686 |

## 🧪 Probar el Auth Service

### Registrar un usuario

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dentalwhite.com",
    "password": "Admin123456"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dentalwhite.com",
    "password": "Admin123456"
  }'
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "expiresIn": 604800000
  }
}
```

### Verificar token

```bash
export TOKEN="tu-access-token-aqui"

curl -X GET http://localhost:3001/api/v1/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

## 🗄️ Bases de Datos Creadas

El script `database/init-databases.sql` crea automáticamente:

- ✅ `dental_auth` - Autenticación
- ✅ `dental_users` - Usuarios y empleados
- ✅ `dental_patients` - Pacientes
- ✅ `dental_appointments` - Citas
- ✅ `dental_consultations` - Consultas
- ✅ `dental_prescriptions` - Recetas
- ✅ `dental_clinical_history` - Historiales clínicos
- ✅ `dental_white` - Catálogos compartidos y reportes

## 📊 Monitoreo

### Prometheus Metrics

```bash
# Ver métricas de un servicio
curl http://localhost:3001/metrics
```

### Grafana Dashboards

1. Abrir http://localhost:4000
2. Login: admin / dental_grafana_2026
3. Importar dashboards desde `monitoring/grafana/dashboards/`

### Jaeger Tracing

1. Abrir http://localhost:16686
2. Seleccionar servicio (e.g., auth-service)
3. Ver trazas distribuidas de las peticiones

## 🔧 Comandos Útiles

```bash
# Ver estado de todos los contenedores
docker compose -f docker-compose-microservices.yml ps

# Detener todo
docker compose -f docker-compose-microservices.yml down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker compose -f docker-compose-microservices.yml down -v

# Reconstruir un servicio
docker compose -f docker-compose-microservices.yml up -d --build auth-service

# Ver logs de todos los servicios
docker compose -f docker-compose-microservices.yml logs -f

# Ejecutar comando en un contenedor
docker exec -it dental-auth-service sh

# Limpiar todo Docker
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```bash
# Encontrar proceso usando el puerto
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

### Error: No se puede conectar a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs de PostgreSQL
docker logs dental-postgres

# Reiniciar PostgreSQL
docker restart dental-postgres
```

### Error: Prisma Client no generado

```bash
cd services/auth-service
pnpm generate
```

### Limpiar y reiniciar desde cero

```bash
# Detener todo
docker compose -f docker-compose-microservices.yml down -v

# Eliminar node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Reinstalar
pnpm install

# Levantar de nuevo
docker compose -f docker-compose-microservices.yml up -d
```

## 📚 Siguiente Paso

Una vez que el sistema esté funcionando, consulta:

- **MICROSERVICES_ARCHITECTURE.md** - Arquitectura detallada
- **MICROSERVICES_SETUP.md** - Guía completa de configuración
- **services/auth-service/README.md** - Documentación del Auth Service

## 🎉 ¡Listo!

El sistema Dental White en microservicios está corriendo. Puedes empezar a desarrollar o integrar el frontend.

```bash
# Verificar que todo funcione
curl http://localhost:3001/api/v1/auth/health

# Respuesta esperada:
# {"success":true,"service":"auth-service","timestamp":"2026-04-21T..."}
```
