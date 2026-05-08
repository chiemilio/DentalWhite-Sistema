# Auth Service - Dental White

Servicio de autenticación para el sistema Dental White.

## Características

- ✅ Autenticación JWT con Access y Refresh Tokens
- ✅ Rate limiting con Redis
- ✅ Eventos asíncronos con RabbitMQ
- ✅ Base de datos PostgreSQL con Prisma
- ✅ Validación con Zod
- ✅ Logging estructurado con Pino
- ✅ Seguridad con Helmet y CORS

## Requisitos

- Node.js >= 22.0.0
- pnpm >= 9.0.0
- PostgreSQL 16
- Redis 7
- RabbitMQ 3.13

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente de Prisma
pnpm generate

# Ejecutar migraciones
pnpm migrate

# Iniciar en desarrollo
pnpm dev
```

## Scripts

- `pnpm dev` - Inicia el servidor en modo desarrollo
- `pnpm build` - Compila TypeScript a JavaScript
- `pnpm start` - Inicia el servidor en producción
- `pnpm migrate` - Ejecuta migraciones de Prisma
- `pnpm generate` - Genera cliente de Prisma
- `pnpm studio` - Abre Prisma Studio
- `pnpm test` - Ejecuta tests

## Endpoints

### POST /api/v1/auth/login
Inicia sesión de usuario

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "uuid...",
    "expiresIn": 604800000
  }
}
```

### POST /api/v1/auth/register
Registra un nuevo usuario

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### POST /api/v1/auth/refresh
Renueva el access token

**Body:**
```json
{
  "refreshToken": "uuid..."
}
```

### POST /api/v1/auth/logout
Cierra sesión (requiere autenticación)

**Headers:**
```
Authorization: Bearer {accessToken}
```

### GET /api/v1/auth/verify
Verifica si el token es válido (requiere autenticación)

### GET /api/v1/auth/health
Health check del servicio

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

## Eventos Publicados

- `auth.user.logged_in` - Usuario inició sesión
- `auth.user.logged_out` - Usuario cerró sesión
- `auth.user.registered` - Nuevo usuario registrado
- `auth.password.changed` - Contraseña cambiada
- `auth.token.refreshed` - Token renovado
- `auth.login.failed` - Intento de login fallido

## Docker

```bash
# Build
docker build -t dental-auth-service .

# Run
docker run -p 3001:3001 --env-file .env dental-auth-service
```

## Licencia

Propietario - Dental White © 2026
