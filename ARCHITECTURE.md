# ARCHITECTURE.md — Dental White

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Frontend | React + TypeScript | 19.2.7 |
| Build | Vite | 6.x |
| UI | Tailwind CSS + shadcn/ui | 4.2.4 |
| Backend | FastAPI (Python) | 0.115.0 |
| ORM | SQLAlchemy | 2.0.35 |
| Migraciones | Alembic | 1.13.2 |
| DB | PostgreSQL | 17 |
| Auth | JWT (python-jose / jose) | HS256 |
| Deploy | Docker Compose | multi-service |
| Proxy | Nginx | reverse proxy + static |

## Arquitectura General

```
Browser ──► Nginx (:80)
              ├── /           ──► React SPA (static /usr/share/nginx/html)
              ├── /api/v1/*   ──► FastAPI backend (:8000)
              └── /uploads/*  ──► FastAPI backend (:8000)

FastAPI ──► PostgreSQL (:5432)
pgAdmin ──► PostgreSQL (:5050)
```

## Estructura del Proyecto

```
Sistema_Gestion_original/
├── src/app/                          # FRONTEND
│   ├── App.tsx                       # Root: AuthProvider > AvailabilityProvider > PatientProvider > Router
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── components/Login.tsx, Register.tsx, ProtectedRoute.tsx, SimpleCaptcha.tsx
│   │   │   └── context/AuthContext.tsx
│   │   ├── dashboard/components/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── DoctorDashboard.tsx
│   │   │   ├── ReceptionistDashboard.tsx
│   │   │   └── PatientDashboard.tsx (en patients/)
│   │   ├── appointments/components/
│   │   │   ├── BlockSchedule.tsx
│   │   │   └── NewAppointmentDialog.tsx
│   │   ├── patients/components/
│   │   │   ├── PatientDashboard.tsx
│   │   │   └── PatientDiagnosisView.tsx
│   │   └── medical-records/components/
│   │       ├── ClinicalHistoryForm.tsx
│   │       ├── ConsentForm.tsx
│   │       ├── MedicalPrescription.tsx
│   │       └── PrintableMedicalRecord.tsx
│   └── shared/
│       ├── context/AvailabilityContext.tsx, PatientContext.tsx
│       ├── hooks/useTokenRefresh.ts
│       ├── utils/api.ts, dateUtils.ts, jwt.ts, appointmentNotifications.ts
│       ├── data/mockData.ts
│       └── ui/  (shadcn/ui components)
│
├── backend/                          # BACKEND
│   ├── app/
│   │   ├── main.py                   # FastAPI app + CORS + rate limiting + 404 handler
│   │   ├── config.py                 # pydantic-settings
│   │   ├── database.py               # SQLAlchemy engine + session
│   │   ├── api/
│   │   │   ├── deps.py               # get_current_user, require_role
│   │   │   └── v1/
│   │   │       ├── __init__.py       # api_router = /api/v1
│   │   │       ├── auth.py           # /login, /register, /me, /refresh
│   │   │       ├── appointments.py   # CRUD + /register-and-appointment + /status
│   │   │       ├── patients.py       # CRUD + /search
│   │   │       ├── employees.py      # CRUD + /toggle-status
│   │   │       ├── consultations.py  # CRUD
│   │   │       ├── prescriptions.py  # CRUD + /folio
│   │   │       ├── clinical_history.py
│   │   │       ├── payments.py       # CRUD + /cita/{id} + /abonos
│   │   │       ├── catalogos.py      # /roles, /servicios, /sucursales, /estados-cita, /validar-disponibilidad
│   │   │       └── users.py          # CRUD
│   │   ├── models/                   # SQLAlchemy models
│   │   ├── schemas/                  # Pydantic schemas
│   │   └── core/security.py, rate_limit.py
│   ├── alembic/                      # Migraciones
│   └── seed_*.py                     # Scripts de datos iniciales
│
├── database/                         # SQL scripts + documentacion
│   ├── postgresql_schema_es.sql
│   ├── DIAGRAM.md, ESTRUCTURA_COMPLETA.md, MAPEO_CAMPOS.md
│   └── queries_examples.sql
│
├── docker-compose.yml                # postgres, pgadmin, backend, frontend
├── Dockerfile                        # Multi-stage: node build → nginx
├── nginx.conf
└── AGENTS.md
```

## Context Providers (React)

```
<AuthProvider>                          # user, token, login, logout, register
  <AvailabilityProvider>                # blockedDays, checkDisponibilidad, horarios
    <PatientProvider>                   # patients (mockData - NO backend)
      <AppContent />                    # State machine: landing → login → register → dashboard
    </PatientProvider>
  </AvailabilityProvider>
</AuthProvider>
```

## Autenticacion JWT

```
1. Login → POST /auth/login → { access_token, user }
2. Token guardado en localStorage('dental_white_token')
3. Cada request incluye Authorization: Bearer <token>
4. Backend: get_current_user() decodifica JWT → User object
5. require_role("Admin","Doctor",...) verifica permisos
6. useTokenRefresh hook renueva 5 min antes de expirar
```

**Roles del sistema**: SuperAdmin, Admin, Recepcionista, Doctor, Paciente

## Mapeo Frontend Roles → Backend Roles

| Backend (cat_roles) | Frontend (UserRole) |
|---------------------|---------------------|
| SuperAdmin | admin |
| Admin | admin |
| Recepcionista | receptionist |
| Doctor | doctor |
| Paciente | patient |

## Base de Datos — Tablas Principales

| Tabla | Descripcion |
|-------|-------------|
| usuarios | Usuarios del sistema (login + datos personales) |
| pacientes | Perfil de paciente (FK → usuarios) |
| empleados | Empleados/doctores (FK → usuarios, centros_trabajo) |
| citas | Citas dentales |
| pagos | Pagos de citas |
| consultas | Consultas medicas (1:1 con cita) |
| prescripciones | Recetas medicas |
| historial_clinico | Historial clinico general |
| centros_trabajo | Sucursales |
| servicios | Servicios dentales |
| cat_roles | Catalogo de roles |
| cat_estados_cita | Estados: Programada, Confirmada, Atendida, Cancelada |
| bloqueos_agenda | Bloqueos de horarios |

## Dependencias Python (requirements.txt)

```
fastapi==0.115.0
uvicorn==0.30.6
sqlalchemy==2.0.35
alembic==1.13.2
psycopg[binary]==3.2.4
pydantic-settings==2.5.2
python-jose[cryptography]==3.3.0
bcrypt==4.0.1
slowapi==0.1.9
python-multipart==0.0.9
```
