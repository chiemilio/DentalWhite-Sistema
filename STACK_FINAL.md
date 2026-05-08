# 🛠️ STACK TECNOLÓGICO FINAL - Dental White
## Sistema de Gestión Dental - Versión Monolítica

---

## 📊 ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENTE / NAVEGADOR                   │
│              HTTPS (Certificado SSL/TLS)                │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTPS (443)
┌─────────────────────────────────────────────────────────┐
│                   NGINX REVERSE PROXY                   │
│           ┌────────────────┬─────────────────┐          │
│           │   Frontend     │   Backend API   │          │
│           │   (Static)     │   (Proxy)       │          │
│           │   Port: 80     │   /api → 8000   │          │
│           └────────────────┴─────────────────┘          │
└─────────────────────────────────────────────────────────┘
         ↓                              ↓
┌─────────────────────┐      ┌─────────────────────┐
│     FRONTEND        │      │   BACKEND API       │
│  HTML + Tailwind    │      │   FastAPI (Python)  │
│  Alpine.js          │      │   Port: 8000        │
│  JavaScript Vanilla │      │                     │
└─────────────────────┘      └─────────────────────┘
                                        ↓
                         ┌──────────────────────────┐
                         │   PostgreSQL 17          │
                         │   Port: 5432             │
                         │   + pgAdmin (Container)  │
                         │   Port: 5050             │
                         └──────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     CI/CD PIPELINE                      │
│  Bitbucket → Pipelines → Build/Test → SSH Deploy       │
│  Git Branching + Pull Requests                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   CONTENEDORIZACIÓN                     │
│  Docker + Docker Compose en VPS                         │
│  - nginx container                                      │
│  - frontend container                                   │
│  - backend (FastAPI) container                          │
│  - postgres container                                   │
│  - pgadmin container                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 STACK TECNOLÓGICO COMPLETO

### 1️⃣ FRONTEND

| Tecnología | Versión | Propósito | ¿Por qué? |
|------------|---------|-----------|-----------|
| **HTML5** | - | Marcado semántico | ✅ Estándar web universal<br>✅ SEO-friendly<br>✅ Accesibilidad nativa<br>✅ Sin overhead de frameworks |
| **Tailwind CSS** | 4.x | Framework de estilos | ✅ Utility-first approach<br>✅ Build-time optimization<br>✅ Responsive por defecto<br>✅ Dark mode integrado<br>✅ Purge CSS automático |
| **JavaScript Vanilla** | ES2023+ | Interactividad | ✅ Sin dependencias<br>✅ Performance nativo<br>✅ Full control<br>✅ Mejor debugging |
| **Alpine.js** | 3.x | Reactividad ligera | ✅ Solo 15KB gzipped<br>✅ Sintaxis tipo Vue<br>✅ Declarativo en HTML<br>✅ Sin build step<br>✅ Integración perfecta con Tailwind |

#### Estructura del Frontend

```
frontend/
├── index.html                 # Landing page
├── login.html                 # Página de login
├── dashboard/
│   ├── admin.html            # Dashboard administrador
│   ├── doctor.html           # Dashboard médico
│   ├── receptionist.html     # Dashboard recepcionista
│   └── patient.html          # Dashboard paciente
├── assets/
│   ├── css/
│   │   ├── tailwind.css      # Estilos Tailwind
│   │   └── custom.css        # Estilos personalizados
│   ├── js/
│   │   ├── main.js           # JavaScript principal
│   │   ├── auth.js           # Manejo de autenticación
│   │   ├── api.js            # Cliente API
│   │   └── components/       # Componentes reutilizables
│   └── images/
│       ├── logo.svg
│       └── ...
└── Dockerfile                # Nginx + static files
```

#### Ejemplo de Código Frontend

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dental White - Dashboard</title>
    <link href="/assets/css/tailwind.css" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50">
    <!-- Alpine.js Component -->
    <div x-data="dashboard()" x-init="init()">
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-sky-600">Dental White</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span x-text="userName"></span>
                        <button @click="logout()" 
                                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <!-- Citas del día -->
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Citas de Hoy</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <template x-for="cita in citas" :key="cita.id">
                        <div class="border rounded p-4 hover:shadow-md transition">
                            <p class="font-semibold" x-text="cita.paciente_nombre"></p>
                            <p class="text-gray-600" x-text="cita.hora"></p>
                            <span class="inline-block px-2 py-1 text-xs rounded"
                                  :class="getStatusColor(cita.estado)"
                                  x-text="cita.estado"></span>
                        </div>
                    </template>
                </div>
            </div>
        </main>
    </div>

    <script src="/assets/js/auth.js"></script>
    <script src="/assets/js/api.js"></script>
    <script>
        function dashboard() {
            return {
                userName: '',
                citas: [],
                
                async init() {
                    // Verificar autenticación
                    if (!Auth.isAuthenticated()) {
                        window.location.href = '/login.html';
                        return;
                    }
                    
                    this.userName = Auth.getUserName();
                    await this.loadCitas();
                },
                
                async loadCitas() {
                    try {
                        const response = await API.get('/citas/today');
                        this.citas = response.data;
                    } catch (error) {
                        console.error('Error cargando citas:', error);
                    }
                },
                
                getStatusColor(estado) {
                    const colors = {
                        'Programada': 'bg-blue-100 text-blue-800',
                        'Confirmada': 'bg-green-100 text-green-800',
                        'En Curso': 'bg-yellow-100 text-yellow-800',
                        'Completada': 'bg-indigo-100 text-indigo-800',
                    };
                    return colors[estado] || 'bg-gray-100 text-gray-800';
                },
                
                logout() {
                    Auth.logout();
                    window.location.href = '/login.html';
                }
            }
        }
    </script>
</body>
</html>
```

---

### 2️⃣ BACKEND - FastAPI

| Tecnología | Versión | Propósito | ¿Por qué? |
|------------|---------|-----------|-----------|
| **Python** | 3.12+ | Lenguaje backend | ✅ Sintaxis limpia y legible<br>✅ Ecosistema maduro<br>✅ Excelente para data processing<br>✅ Type hints nativos |
| **FastAPI** | 0.115+ | Framework web | ✅ Alto rendimiento (async/await)<br>✅ Validación automática (Pydantic)<br>✅ OpenAPI/Swagger automático<br>✅ Type-safe<br>✅ Documentación interactiva |
| **SQLAlchemy** | 2.0+ | ORM | ✅ ORM más popular de Python<br>✅ Async support nativo<br>✅ Query builder potente<br>✅ Migrations con Alembic |
| **Pydantic** | 2.9+ | Validación | ✅ Type validation automática<br>✅ JSON serialization<br>✅ Settings management<br>✅ Integración perfecta con FastAPI |
| **Uvicorn** | 0.30+ | ASGI server | ✅ Alto rendimiento<br>✅ HTTP/2 support<br>✅ WebSocket support<br>✅ Auto-reload en desarrollo |
| **Alembic** | 1.13+ | Migrations | ✅ Versionado de schema<br>✅ Rollback fácil<br>✅ Auto-generación de migrations<br>✅ Integración con SQLAlchemy |

#### Estructura del Backend

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Entry point FastAPI
│   ├── config.py                  # Configuración (Settings)
│   ├── database.py                # Conexión DB + Session
│   ├── models/                    # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   ├── consultation.py
│   │   └── ...
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   └── ...
│   ├── api/                       # Endpoints
│   │   ├── __init__.py
│   │   ├── deps.py               # Dependencies (auth, db)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py           # /api/v1/auth
│   │       ├── users.py          # /api/v1/users
│   │       ├── patients.py       # /api/v1/patients
│   │       ├── appointments.py   # /api/v1/appointments
│   │       └── ...
│   ├── core/                      # Core functionality
│   │   ├── __init__.py
│   │   ├── security.py           # JWT, password hashing
│   │   └── permissions.py        # RBAC
│   └── utils/                     # Utilities
│       ├── __init__.py
│       ├── email.py
│       └── ...
├── alembic/                       # Migrations
│   ├── versions/
│   └── env.py
├── tests/                         # Tests
│   ├── __init__.py
│   ├── test_auth.py
│   └── ...
├── requirements.txt               # Dependencias
├── requirements-dev.txt           # Dev dependencies
├── Dockerfile                     # Container backend
├── .env.example                   # Variables de entorno
└── alembic.ini                    # Config Alembic
```

#### Ejemplo de Código Backend

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, patients, appointments
from app.config import settings

app = FastAPI(
    title="Dental White API",
    description="Sistema de Gestión Dental",
    version="3.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(patients.router, prefix="/api/v1/patients", tags=["patients"])
app.include_router(appointments.router, prefix="/api/v1/appointments", tags=["appointments"])

@app.get("/")
async def root():
    return {"message": "Dental White API v3.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

```python
# app/models/patient.py
from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Patient(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo_paciente_id = Column(Integer, ForeignKey("cat_tipos_paciente.id"))
    sucursal_id = Column(Integer, ForeignKey("cat_sucursales.id"))
    
    fecha_nacimiento = Column(Date, nullable=False)
    curp = Column(String(18), unique=True)
    rfc = Column(String(13))
    direccion = Column(String(255))
    ciudad = Column(String(100))
    estado = Column(String(100))
    codigo_postal = Column(String(10))
    
    telefono_emergencia = Column(String(20))
    contacto_emergencia = Column(String(100))
    
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, default=datetime.utcnow)
    fecha_actualizacion = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    usuario = relationship("User", back_populates="paciente")
    tipo_paciente = relationship("TipoPaciente")
    sucursal = relationship("Sucursal")
    citas = relationship("Appointment", back_populates="paciente")
```

```python
# app/schemas/patient.py
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class PatientBase(BaseModel):
    fecha_nacimiento: date
    curp: Optional[str] = Field(None, max_length=18)
    rfc: Optional[str] = Field(None, max_length=13)
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    estado: Optional[str] = None
    codigo_postal: Optional[str] = None
    telefono_emergencia: Optional[str] = None
    contacto_emergencia: Optional[str] = None

class PatientCreate(PatientBase):
    usuario_id: int
    tipo_paciente_id: int
    sucursal_id: int

class PatientUpdate(PatientBase):
    pass

class PatientInDB(PatientBase):
    id: int
    usuario_id: int
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True

class PatientResponse(PatientInDB):
    usuario_nombre: str
    tipo_paciente_nombre: str
    sucursal_nombre: str
```

```python
# app/api/v1/patients.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[PatientResponse])
async def get_patients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener lista de pacientes"""
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener paciente por ID"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return patient

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crear nuevo paciente"""
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    patient: PatientUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Actualizar paciente"""
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    for key, value in patient.dict(exclude_unset=True).items():
        setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Eliminar paciente (soft delete)"""
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    db_patient.activo = False
    db.commit()
    return None
```

---

### 3️⃣ BASE DE DATOS

| Tecnología | Versión | Propósito | ¿Por qué? |
|------------|---------|-----------|-----------|
| **PostgreSQL** | 17+ | Base de datos principal | ✅ Última versión estable (2026)<br>✅ Performance mejorado<br>✅ JSONB optimizado<br>✅ Partitioning nativo<br>✅ Full-text search<br>✅ ACID compliant |
| **pgAdmin** | 4.x | Administración web | ✅ GUI completa<br>✅ Query tool potente<br>✅ Schema designer<br>✅ Backup/restore integrado<br>✅ Multi-database support |

#### Bases de Datos

**UNA SOLA BASE DE DATOS:** `dental_white`

```sql
-- Todas las tablas en una sola base de datos
dental_white/
├── Catálogos (9 tablas)
│   ├── cat_tipos_paciente
│   ├── cat_sucursales
│   ├── cat_nacionalidades
│   ├── cat_roles
│   ├── cat_especialidades
│   ├── cat_servicios
│   ├── cat_medios_contacto
│   ├── cat_estados_cita
│   └── cat_tipos_antecedentes
│
└── Tablas Principales (13 tablas)
    ├── usuarios
    ├── pacientes
    ├── empleados
    ├── citas
    ├── bloqueos_agenda
    ├── consultas
    ├── consultas_fotos
    ├── recetas
    ├── receta_medicamentos
    ├── sucursal_especialidades
    ├── empleado_especialidades
    ├── historial_clinico
    └── consentimientos_paciente
```

---

### 4️⃣ REVERSE PROXY - Nginx

| Tecnología | Versión | Propósito | ¿Por qué? |
|------------|---------|-----------|-----------|
| **Nginx** | 1.27+ | Reverse proxy + SSL | ✅ Alto rendimiento<br>✅ Load balancing<br>✅ SSL/TLS termination<br>✅ Caché de contenido estático<br>✅ Compresión gzip<br>✅ Rate limiting |

#### Configuración Nginx

```nginx
# /etc/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    # Upstream backend
    upstream backend {
        server backend:8000;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name dentalwhite.com www.dentalwhite.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name dentalwhite.com www.dentalwhite.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Frontend (static files)
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
            expires 1h;
            add_header Cache-Control "public, immutable";
        }

        # API proxy
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Login endpoint (more restrictive)
        location /api/v1/auth/login {
            limit_req zone=login_limit burst=3 nodelay;
            
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

### 5️⃣ CONTENEDORIZACIÓN - Docker

#### docker-compose.yml

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:17-alpine
    container_name: dental-postgres
    environment:
      POSTGRES_USER: dental_admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: dental_white
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init-database.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - dental-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dental_admin"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # pgAdmin
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: dental-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@dentalwhite.com
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
      PGADMIN_LISTEN_PORT: 80
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - dental-network
    depends_on:
      - postgres
    restart: unless-stopped

  # Backend (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dental-backend
    environment:
      DATABASE_URL: postgresql://dental_admin:${POSTGRES_PASSWORD}@postgres:5432/dental_white
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 10080
      CORS_ORIGINS: ${CORS_ORIGINS}
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - /app/__pycache__
    networks:
      - dental-network
    depends_on:
      postgres:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    restart: unless-stopped

  # Frontend (Nginx + Static files)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: dental-frontend
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    networks:
      - dental-network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:1.27-alpine
    container_name: dental-nginx
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./frontend:/usr/share/nginx/html:ro
    networks:
      - dental-network
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

networks:
  dental-network:
    driver: bridge

volumes:
  postgres_data:
  pgadmin_data:
```

#### Dockerfile Backend

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Dockerfile Frontend

```dockerfile
# frontend/Dockerfile
FROM nginx:1.27-alpine

# Copy static files
COPY . /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

### 6️⃣ CI/CD - Bitbucket Pipelines

#### bitbucket-pipelines.yml

```yaml
image: python:3.12

definitions:
  steps:
    - step: &test
        name: Run Tests
        caches:
          - pip
        script:
          - cd backend
          - pip install -r requirements.txt
          - pip install pytest pytest-cov
          - pytest tests/ --cov=app --cov-report=term-missing
        
    - step: &build
        name: Build Docker Images
        services:
          - docker
        script:
          - docker build -t dentalwhite/backend:$BITBUCKET_COMMIT ./backend
          - docker build -t dentalwhite/frontend:$BITBUCKET_COMMIT ./frontend
          - docker save dentalwhite/backend:$BITBUCKET_COMMIT -o backend.tar
          - docker save dentalwhite/frontend:$BITBUCKET_COMMIT -o frontend.tar
        artifacts:
          - backend.tar
          - frontend.tar
    
    - step: &deploy-production
        name: Deploy to Production
        deployment: production
        script:
          # Load docker images
          - docker load -i backend.tar
          - docker load -i frontend.tar
          
          # Tag as latest
          - docker tag dentalwhite/backend:$BITBUCKET_COMMIT dentalwhite/backend:latest
          - docker tag dentalwhite/frontend:$BITBUCKET_COMMIT dentalwhite/frontend:latest
          
          # Save images to transfer
          - docker save dentalwhite/backend:latest -o backend-latest.tar
          - docker save dentalwhite/frontend:latest -o frontend-latest.tar
          
          # Copy to VPS via SSH
          - pipe: atlassian/scp-deploy:1.2.1
            variables:
              USER: $PRODUCTION_USER
              SERVER: $PRODUCTION_SERVER
              REMOTE_PATH: /opt/dental-white/
              LOCAL_PATH: "*.tar docker-compose.yml .env.production"
          
          # Deploy on VPS
          - pipe: atlassian/ssh-run:0.4.1
            variables:
              SSH_USER: $PRODUCTION_USER
              SERVER: $PRODUCTION_SERVER
              COMMAND: |
                cd /opt/dental-white
                docker load -i backend-latest.tar
                docker load -i frontend-latest.tar
                cp .env.production .env
                docker compose down
                docker compose up -d
                docker image prune -af

pipelines:
  branches:
    develop:
      - step: *test
      - step: *build
    
    main:
      - step: *test
      - step: *build
      - step: *deploy-production

  pull-requests:
    '**':
      - step: *test
```

---

### 7️⃣ CONTROL DE VERSIONES - Git + Bitbucket

#### Estrategia de Branching

```
main (production)
  ↑
  └─ develop (staging)
       ↑
       ├─ feature/nombre-feature
       ├─ bugfix/nombre-bug
       └─ hotfix/nombre-hotfix
```

#### Flujo de Trabajo

1. **Feature Development**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nueva-funcionalidad
   # ... hacer cambios ...
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   # Crear Pull Request a develop
   ```

2. **Pull Request Process**
   - Crear PR en Bitbucket
   - Code review por al menos 1 persona
   - Pipeline automático (tests + build)
   - Merge a develop

3. **Release to Production**
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git tag -a v3.0.0 -m "Release v3.0.0"
   git push origin main --tags
   # Deploy automático a producción
   ```

---

## 📦 DEPENDENCIAS Y VERSIONES

### Backend (requirements.txt)

```txt
# FastAPI
fastapi==0.115.0
uvicorn[standard]==0.30.6
python-multipart==0.0.9

# Database
sqlalchemy==2.0.35
alembic==1.13.2
psycopg2-binary==2.9.9

# Validation
pydantic==2.9.2
pydantic-settings==2.5.2
email-validator==2.2.0

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9

# CORS
python-cors==1.0.0

# Utils
python-dotenv==1.0.1
```

### Frontend (package.json - solo para Tailwind build)

```json
{
  "name": "dental-white-frontend",
  "version": "3.0.0",
  "scripts": {
    "build:css": "tailwindcss -i ./assets/css/input.css -o ./assets/css/tailwind.css --minify"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/forms": "^0.5.9",
    "@tailwindcss/typography": "^0.5.15"
  }
}
```

---

## 🚀 DEPLOYMENT

### VPS Requirements

- **OS:** Ubuntu 24.04 LTS
- **CPU:** 2+ cores
- **RAM:** 4GB+ (8GB recomendado)
- **Disk:** 50GB SSD
- **Software:** Docker 27+, Docker Compose 2.x

### Setup Inicial en VPS

```bash
# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# 4. Configurar firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# 5. Crear directorio de aplicación
sudo mkdir -p /opt/dental-white
sudo chown $USER:$USER /opt/dental-white
cd /opt/dental-white

# 6. Clonar repositorio (o transferir archivos)
git clone git@bitbucket.org:usuario/dental-white.git .

# 7. Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores de producción

# 8. Obtener certificados SSL (Let's Encrypt)
sudo apt install certbot -y
sudo certbot certonly --standalone -d dentalwhite.com -d www.dentalwhite.com

# 9. Levantar servicios
docker compose up -d

# 10. Ver logs
docker compose logs -f
```

---

## 💰 COSTOS ESTIMADOS

| Recurso | Especificación | Costo Mensual (USD) |
|---------|---------------|---------------------|
| **VPS** | 2 vCPU, 4GB RAM, 50GB SSD (DigitalOcean/Linode) | $24 |
| **Domain** | .com domain | $12/año (~$1/mes) |
| **SSL Certificate** | Let's Encrypt | Gratis |
| **Bitbucket** | Free tier (5 users) | Gratis |
| **Backup Storage** | 50GB snapshot | $5 |
| **Total** | | **~$30/mes** |

---

## ✅ VENTAJAS DE ESTE STACK

### Para el Negocio
✅ **Muy bajo costo** (~$30/mes)  
✅ **Simplicidad** - Fácil de entender y mantener  
✅ **Rápido time to market**  
✅ **Sin vendor lock-in**  

### Para el Desarrollo
✅ **Stack simple** - Menos curva de aprendizaje  
✅ **Python** - Código limpio y legible  
✅ **FastAPI** - Documentación automática (Swagger)  
✅ **Alpine.js** - Reactivity sin complejidad  
✅ **Tailwind** - CSS utility-first  

### Para Operaciones
✅ **Un solo servidor** - Fácil de administrar  
✅ **Docker Compose** - Simple orchestration  
✅ **Backups fáciles** - Snapshots del VPS  
✅ **CI/CD integrado** - Bitbucket Pipelines  

---

## 📊 COMPARACIÓN: Monolítico vs Microservicios

| Aspecto | Monolítico (Este Stack) | Microservicios (Stack Anterior) |
|---------|-------------------------|----------------------------------|
| **Complejidad** | ⭐ Baja | ⭐⭐⭐⭐⭐ Muy Alta |
| **Costo** | $30/mes | $420/mes |
| **Tiempo desarrollo** | 2-3 meses | 6-9 meses |
| **Escalabilidad** | Vertical (limitada) | Horizontal (ilimitada) |
| **Mantenimiento** | Fácil | Complejo |
| **Deployment** | Simple (1 comando) | Complejo (K8s) |
| **Team size** | 1-3 devs | 5-10 devs |
| **Ideal para** | Startups, MVPs | Enterprise, high scale |

---

## 🎯 CONCLUSIÓN

Este stack monolítico es **ideal para Dental White** porque:

✅ **Bajo costo** - Perfecto para una clínica dental  
✅ **Simple** - Fácil de mantener con equipo pequeño  
✅ **Rápido** - FastAPI + PostgreSQL son muy eficientes  
✅ **Moderno** - Usa tecnologías actuales (Python 3.12, PostgreSQL 17, Tailwind 4)  
✅ **Escalable** - Puede manejar cientos de usuarios concurrentes  
✅ **Completo** - Incluye todo lo necesario (CI/CD, SSL, backups)  

**Versión:** 3.0.0 - Monolítico  
**Fecha:** 21 de Abril de 2026  
**Stack:** Python + FastAPI + PostgreSQL + Alpine.js  
**Arquitectura:** Monolítica con Docker Compose
