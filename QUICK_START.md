# 🚀 Quick Start - Dental White

Guía rápida para levantar el stack completo de Dental White (Backend FastAPI + PostgreSQL + Frontend).

## 📋 Prerrequisitos

- Docker 20.10+
- Docker Compose 1.29+
- Git

## 🎯 Inicio Rápido con Docker (Recomendado)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd dental-white
```

### 2. Configurar Variables de Entorno

```bash
# Copiar ejemplo de .env para backend
cp backend/.env.example backend/.env

# Editar backend/.env si es necesario (valores por defecto funcionan para desarrollo)
```

### 3. Levantar Stack Completo

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
# Crear migración inicial (solo primera vez)
docker-compose exec backend alembic revision --autogenerate -m "Initial migration"

# Aplicar migraciones
docker-compose exec backend alembic upgrade head
```

### 5. Acceder a los Servicios

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **pgAdmin**: http://localhost:5050
  - Email: `admin@dentalwhite.com`
  - Password: `admin123`

## 🛠️ Desarrollo Local (Sin Docker)

### Backend

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
# Editar .env con DATABASE_URL apuntando a tu PostgreSQL local

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload
```

### Base de Datos (Local)

```bash
# Crear base de datos
createdb dental_white

# O con psql
psql -U postgres
CREATE DATABASE dental_white;
\q
```

### Frontend

```bash
cd frontend

# Abrir index.html en navegador
# O usar un servidor HTTP simple:
python3 -m http.server 8080
# Acceder en: http://localhost:8080
```

## 📦 Servicios en Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend (Nginx) | 80, 443 | Aplicación web (HTML + Alpine.js + Tailwind) |
| Backend (FastAPI) | 8000 | API REST |
| PostgreSQL | 5432 | Base de datos |
| pgAdmin | 5050 | Administrador de BD web |

## 🧪 Probar la API

### Health Check

```bash
curl http://localhost:8000/health
```

### Registrar Primer Usuario

Primero necesitas insertar datos en las tablas de catálogos. Conectar a PostgreSQL:

```bash
# Via psql
psql -h localhost -U dental_admin -d dental_white
# Password: dental_secret_2026

# O via pgAdmin en http://localhost:5050
```

Insertar datos de catálogos:

```sql
-- Insertar rol SuperAdmin
INSERT INTO cat_roles (nombre, permisos, activo) VALUES 
('SuperAdmin', '{"all": true}', true),
('Admin', '{"users": true, "patients": true}', true),
('Doctor', '{"consultations": true, "prescriptions": true}', true),
('Recepcionista', '{"appointments": true}', true),
('Paciente', '{"view_own": true}', true);

-- Insertar nacionalidad
INSERT INTO cat_nacionalidades (nombre, activo) VALUES 
('Mexicana', true),
('Estadounidense', true),
('Otra', true);

-- Insertar otros catálogos según sea necesario
-- Ver CATALOGOS_Y_STACK.md para datos completos
```

Luego registrar usuario via API:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dentalwhite.com",
    "password": "Admin123!",
    "nombre": "Admin",
    "apellido_paterno": "Sistema",
    "rol_id": 1,
    "activo": true
  }'
```

### Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dentalwhite.com",
    "password": "Admin123!"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "admin@dentalwhite.com",
  "nombre_completo": "Admin Sistema",
  "rol": "SuperAdmin"
}
```

### Usar Token

```bash
export TOKEN="tu-access-token-aqui"

curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

## 📁 Estructura del Proyecto

```
dental-white/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── api/         # Endpoints
│   │   │   ├── deps.py  # Dependencies (auth, DB)
│   │   │   └── v1/      # API v1
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── patients.py
│   │   │       ├── employees.py
│   │   │       ├── appointments.py
│   │   │       ├── consultations.py
│   │   │       ├── prescriptions.py
│   │   │       ├── clinical_history.py
│   │   │       └── catalogos.py
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── core/        # Security, config
│   ├── alembic/         # Migraciones
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # HTML + Alpine.js + Tailwind
├── nginx/              # Configuración Nginx
├── database/           # Scripts SQL
└── docker-compose.yml  # Orquestación Docker
```

## 🔧 Comandos Útiles

### Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs de un servicio específico
docker-compose logs -f backend

# Reconstruir un servicio
docker-compose up -d --build backend

# Ejecutar comando en contenedor
docker-compose exec backend bash
```

### Migraciones (Alembic)

```bash
# Crear nueva migración
docker-compose exec backend alembic revision --autogenerate -m "Descripción"

# Aplicar migraciones
docker-compose exec backend alembic upgrade head

# Revertir última migración
docker-compose exec backend alembic downgrade -1

# Ver historial
docker-compose exec backend alembic history
```

### Base de Datos

```bash
# Conectar a PostgreSQL
psql -h localhost -U dental_admin -d dental_white
# Password: dental_secret_2026

# Backup
docker-compose exec postgres pg_dump -U dental_admin dental_white > backup.sql

# Restore
docker-compose exec -T postgres psql -U dental_admin dental_white < backup.sql
```

## 🐛 Troubleshooting

### Error: Puerto 5432 ya en uso

```bash
# Detener PostgreSQL local
sudo systemctl stop postgresql

# O cambiar puerto en docker-compose.yml:
# ports:
#   - "5433:5432"
```

### Error: Base de datos no existe

```bash
# Recrear base de datos
docker-compose down -v  # Eliminar volúmenes
docker-compose up -d    # Recrear
```

### Error: Migraciones no se aplican

```bash
# Verificar conexión a DB
docker-compose exec backend python -c "from app.database import engine; print(engine.url)"

# Ver SQL de migración
docker-compose exec backend alembic upgrade head --sql

# Forzar upgrade
docker-compose exec backend alembic upgrade head
```

### Error: Permisos en pgAdmin

```bash
# Reiniciar pgAdmin
docker-compose restart pgadmin

# Limpiar volúmenes de pgAdmin
docker-compose down
docker volume rm dental_white_pgadmin_data
docker-compose up -d
```

## 📊 Endpoints Principales

### Autenticación

- `POST /api/v1/auth/login` - Login de usuario
- `POST /api/v1/auth/register` - Registro de usuario
- `GET /api/v1/auth/me` - Información del usuario actual

### Catálogos (GET)

- `/api/v1/catalogos/tipos-paciente`
- `/api/v1/catalogos/sucursales`
- `/api/v1/catalogos/nacionalidades`
- `/api/v1/catalogos/roles`
- `/api/v1/catalogos/especialidades`
- `/api/v1/catalogos/servicios`
- `/api/v1/catalogos/medios-contacto`
- `/api/v1/catalogos/estados-cita`
- `/api/v1/catalogos/tipos-antecedente`

### CRUD

- **Usuarios**: `/api/v1/users`
- **Pacientes**: `/api/v1/patients`
- **Empleados**: `/api/v1/employees`
- **Citas**: `/api/v1/appointments`
- **Consultas**: `/api/v1/consultations`
- **Recetas**: `/api/v1/prescriptions`
- **Historial Clínico**: `/api/v1/clinical-history`

Ver documentación completa en: http://localhost:8000/docs

## ✅ Checklist de Setup

- [ ] Levantar stack con Docker (`docker-compose up -d`)
- [ ] Aplicar migraciones (`alembic upgrade head`)
- [ ] Insertar datos de catálogos (roles, sucursales, etc.)
- [ ] Crear primer usuario administrador
- [ ] Verificar acceso a pgAdmin
- [ ] Probar login via API
- [ ] Desarrollar frontend

## 📚 Recursos Adicionales

- **Backend README**: [backend/README.md](backend/README.md)
- **Stack Decision**: [DECISION_STACK.md](DECISION_STACK.md)
- **Stack Final**: [STACK_FINAL.md](STACK_FINAL.md)
- **Catálogos**: [CATALOGOS_Y_STACK.md](CATALOGOS_Y_STACK.md)
- **API Docs**: http://localhost:8000/docs

## 🎉 ¡Listo!

El sistema Dental White está funcionando. Puedes acceder a:

- Frontend: http://localhost
- Backend API: http://localhost:8000/docs
- pgAdmin: http://localhost:5050

---

**Dental White** © 2026
