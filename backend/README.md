# Dental White - Backend API

API REST desarrollada con FastAPI para el sistema de gestión de clínica dental.

## Tecnologías

- **Python**: 3.12+
- **FastAPI**: 0.115+
- **SQLAlchemy**: 2.0+ (ORM)
- **PostgreSQL**: 17+
- **Alembic**: Migraciones de base de datos
- **Pydantic**: Validación de datos
- **JWT**: Autenticación con tokens
- **Uvicorn**: Servidor ASGI

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependencias (auth, DB)
│   │   └── v1/
│   │       ├── auth.py          # Endpoints de autenticación
│   │       ├── users.py         # CRUD de usuarios
│   │       ├── patients.py      # CRUD de pacientes
│   │       ├── employees.py     # CRUD de empleados
│   │       ├── appointments.py  # CRUD de citas
│   │       ├── consultations.py # CRUD de consultas
│   │       ├── prescriptions.py # CRUD de recetas
│   │       ├── clinical_history.py # Historial clínico
│   │       └── catalogos.py     # Endpoints de catálogos
│   ├── core/
│   │   └── security.py          # JWT, password hashing
│   ├── models/                  # Modelos SQLAlchemy
│   ├── schemas/                 # Schemas Pydantic
│   ├── config.py                # Configuración
│   ├── database.py              # Setup de DB
│   └── main.py                  # Aplicación FastAPI
├── alembic/                     # Migraciones
├── requirements.txt             # Dependencias
├── .env.example                 # Ejemplo de variables de entorno
└── Dockerfile                   # Imagen Docker
```

## Instalación Local

### 1. Requisitos Previos

- Python 3.12+
- PostgreSQL 17+
- pip

### 2. Clonar e Instalar Dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```env
DATABASE_URL=postgresql://dental_admin:tu_password@localhost:5432/dental_white
SECRET_KEY=tu_clave_secreta_muy_segura_minimo_32_caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGINS=http://localhost,http://localhost:80
ENVIRONMENT=development
```

### 4. Crear Base de Datos

```bash
createdb dental_white
```

### 5. Ejecutar Migraciones

```bash
# Crear migración inicial
alembic revision --autogenerate -m "Initial migration"

# Aplicar migraciones
alembic upgrade head
```

### 6. Ejecutar Servidor de Desarrollo

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La API estará disponible en: http://localhost:8000

- **Documentación Swagger**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc

## Instalación con Docker

### Opción 1: Solo Backend + PostgreSQL

```bash
docker-compose up -d postgres backend
```

### Opción 2: Stack Completo

```bash
# Desde el directorio raíz del proyecto
docker-compose up -d
```

Esto levantará:
- PostgreSQL (puerto 5432)
- pgAdmin (puerto 5050)
- Backend API (puerto 8000)
- Frontend Nginx (puerto 80)

## Endpoints Principales

### Autenticación

- `POST /api/v1/auth/login` - Login de usuario
- `POST /api/v1/auth/register` - Registro de usuario
- `GET /api/v1/auth/me` - Información del usuario actual

### Catálogos

- `GET /api/v1/catalogos/tipos-paciente`
- `GET /api/v1/catalogos/sucursales`
- `GET /api/v1/catalogos/nacionalidades`
- `GET /api/v1/catalogos/roles`
- `GET /api/v1/catalogos/especialidades`
- `GET /api/v1/catalogos/servicios`
- `GET /api/v1/catalogos/medios-contacto`
- `GET /api/v1/catalogos/estados-cita`
- `GET /api/v1/catalogos/tipos-antecedente`

### Usuarios

- `GET /api/v1/users` - Listar usuarios
- `GET /api/v1/users/{id}` - Obtener usuario
- `PUT /api/v1/users/{id}` - Actualizar usuario
- `DELETE /api/v1/users/{id}` - Desactivar usuario

### Pacientes

- `GET /api/v1/patients` - Listar pacientes
- `GET /api/v1/patients/{id}` - Obtener paciente
- `POST /api/v1/patients` - Crear paciente
- `PUT /api/v1/patients/{id}` - Actualizar paciente
- `DELETE /api/v1/patients/{id}` - Eliminar paciente

### Citas

- `GET /api/v1/appointments` - Listar citas (con filtros)
- `GET /api/v1/appointments/{id}` - Obtener cita
- `POST /api/v1/appointments` - Crear cita
- `PUT /api/v1/appointments/{id}` - Actualizar cita
- `DELETE /api/v1/appointments/{id}` - Cancelar cita

### Consultas

- `GET /api/v1/consultations` - Listar consultas
- `GET /api/v1/consultations/{id}` - Obtener consulta
- `POST /api/v1/consultations` - Crear consulta
- `PUT /api/v1/consultations/{id}` - Actualizar consulta

### Recetas

- `GET /api/v1/prescriptions` - Listar recetas
- `GET /api/v1/prescriptions/{id}` - Obtener receta
- `GET /api/v1/prescriptions/folio/{folio}` - Obtener por folio
- `POST /api/v1/prescriptions` - Crear receta

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación.

### Obtener Token

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "usuario@example.com",
  "nombre_completo": "Juan Pérez",
  "rol": "Admin"
}
```

### Usar Token en Requests

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Control de Acceso por Roles

Los endpoints están protegidos por roles:

- **SuperAdmin**: Acceso completo a todo
- **Admin**: Gestión de usuarios, pacientes, empleados
- **Doctor**: Consultas, recetas, historial clínico
- **Recepcionista**: Citas, pacientes básico
- **Paciente**: Solo sus propios datos (limitado)

## Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **Patient**: Perfiles de pacientes
- **Employee**: Perfiles de empleados
- **Appointment**: Citas médicas
- **Consultation**: Consultas médicas
- **Prescription**: Recetas médicas
- **ClinicalHistory**: Historial clínico

### Catálogos

9 tablas de catálogo para datos maestros (roles, especialidades, servicios, etc.)

### Diagrama ER

Ver `database/ER_DIAGRAM.md` para el diagrama completo.

## Testing

```bash
# Ejecutar tests
pytest

# Con coverage
pytest --cov=app tests/

# Tests específicos
pytest tests/api/test_auth.py
```

## Migraciones de Base de Datos

```bash
# Crear nueva migración
alembic revision --autogenerate -m "Descripción"

# Aplicar migraciones
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver historial
alembic history
```

## Comandos Docker

```bash
# Build
docker-compose build backend

# Start
docker-compose up -d backend

# Logs
docker-compose logs -f backend

# Shell en contenedor
docker-compose exec backend bash

# Ejecutar migraciones en Docker
docker-compose exec backend alembic upgrade head
```

## Producción

### Variables de Entorno para Producción

```env
ENVIRONMENT=production
DATABASE_URL=postgresql://user:password@production-host:5432/dental_white
SECRET_KEY=clave_super_secreta_generada_aleatoriamente_min_32_chars
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 1 día
CORS_ORIGINS=https://dentalwhite.com,https://app.dentalwhite.com
LOG_LEVEL=WARNING
```

### Deploy con Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx Reverse Proxy

Ver `nginx/nginx.conf` para configuración de producción con SSL/TLS.

## Logs

Los logs se configuran según `LOG_LEVEL` en `.env`:

- **DEBUG**: Desarrollo (muy verboso)
- **INFO**: General
- **WARNING**: Producción (recomendado)
- **ERROR**: Solo errores críticos

## Mantenimiento

### Backup de Base de Datos

```bash
pg_dump -U dental_admin -h localhost dental_white > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
psql -U dental_admin -h localhost dental_white < backup_20260421.sql
```

## Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio de Bitbucket.

## Licencia

Propiedad de Dental White © 2026
