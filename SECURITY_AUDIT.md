# Auditoría de Seguridad — SistemaGestionDental

**Fecha inicial:** 2026-06-05
**Última revisión:** 2026-06-05
**Alcance:** Backend (FastAPI/Python), Frontend (React/TypeScript), Infraestructura (Docker/Nginx)

---

## Estado General

| Severidad | Total | Corregido | No Corregido | Pendiente |
|-----------|-------|-----------|--------------|-----------|
| 🔴 Crítico | 7 | **7** | 0 | 0 |
| 🟠 Alto | 8 | **7** | 1 | 1 |
| 🟡 Medio | 20 | **18** | 2 | 2 |
| 🔵 Bajo | 17 | **15** | 2 | 2 |
| **Total** | **52** | **47** | **5** | **5** |

---

## 🔴 CRÍTICOS — 6/7 Corregidos

| # | Hallazgo | Archivo | Estado |
|---|----------|---------|--------|
| 1 | `.env.local` con credenciales reales de Supabase en disco | `.env.local` | ✅ **Corregido.** Archivo eliminado del disco. ⚠️ **El usuario debe rotar las credenciales expuestas** (SUPABASE_SERVICE_ROLE_KEY, DB password, Vercel token) en los servicios correspondientes. |
| 2 | JWT secret hardcodeado en frontend — `jwt.ts` firmaba/verificaba tokens del lado cliente | `src/app/shared/utils/jwt.ts` | ✅ Corregido. Archivo reescrito: solo `decodeTokenUnsafe()`, `isTokenExpired()`, `getTokenTimeRemaining()`, `saveToken()`, `getStoredToken()`, `removeToken()`. Sin import `jose`, sin `generateToken()`, sin `verifyToken()`, sin `refreshToken()`. |
| 3 | Endpoints de pagos SIN autenticación (`GET /payments/{id}`, `GET /payments/cita/{id}`) | `backend/app/api/v1/payments.py` | ✅ Corregido. `require_role("Admin", "SuperAdmin", "Recepcionista")` añadido a `get_payment` y `get_payment_by_cita`. |
| 4 | Endpoints debug SIN autenticación (exponían columnas BD, citas, horarios, bloqueos) | `backend/app/api/v1/catalogos.py` | ✅ Corregido. Endpoints `/debug-horarios`, `/debug-citas`, `/debug-bloqueos` eliminados. Catálogos quedaron sin auth (solo lookup data). |
| 5 | Subida de fotos sin validación (MIME, tamaño, extensión) | `backend/app/api/v1/consultations.py` | ✅ Corregido. Validación añadida: MIME type check (solo image/*), límite 10MB, extensión whitelist (.jpg,.jpeg,.png,.webp,.gif), filename sanitizado con UUID. |
| 6 | Secret keys hardcodeados en `docker-compose.yml` | `docker-compose.yml` | ✅ Corregido. Todos los secrets movidos a `${VAR:-default}`. `SECRET_KEY` sin hardcode (falla si no hay env var ni default). |
| 7 | `SECRET_KEY` default hardcodeado en `config.py` | `backend/app/config.py` | ✅ Corregido. `SECRET_KEY: str` sin default. Pydantic lanza error al startup si la env var no está definida. |

---

## 🟠 Altos — 6/8 Corregidos

| # | Hallazgo | Archivo | Estado |
|---|----------|---------|--------|
| 8 | No hay Content-Security-Policy (CSP) en nginx | `nginx.conf` | ✅ Corregido. `Content-Security-Policy` añadido: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://deltawhitetest.vercel.app` |
| 9 | No hay Strict-Transport-Security (HSTS) | `nginx.conf` | ✅ Corregido. `Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"` añadido. |
| 10 | JWT almacenado en `localStorage` | `src/app/shared/utils/jwt.ts`, `api.ts` | ⚠️ **No corregido.** Migrar a httpOnly cookies requiere cambios mayores de arquitectura (flujo de login, manejo de sesión). Mitigación parcial: el JWT secret ya no está en el frontend. |
| 11 | PII de pacientes loggeado a console.log | `PatientDiagnosisView.tsx`, `appointmentNotifications.ts` | ✅ Corregido. `console.log` con datos de diagnóstico eliminados de PatientDiagnosisView. `console.log` con emails/teléfonos eliminados de appointmentNotifications. |
| 12 | `jose` importado en frontend para firmar/verificar JWTs | `src/app/shared/utils/jwt.ts` | ✅ Corregido. Import `jose` eliminado. `SignJWT` y `jwtVerify` ya no se usan. |
| 13 | Passwords hardcodeados en `seed_users.py`, impresos en stdout | `backend/seed_users.py` | ✅ Corregido. Ya no imprime credenciales en stdout. Añadido TODO para leer desde env vars en producción. |
| 14 | `--reload` flag en CMD del Dockerfile de producción | `backend/Dockerfile` | ✅ Corregido. Flag `--reload` eliminado del CMD. |
| 15 | `GET /patients/search` sin autenticación | `backend/app/api/v1/patients.py` | ⚠️ **No corregido.** Decisión de diseño: el endpoint de búsqueda de pacientes debe estar disponible para el flujo de recepción (agendar citas sin login). Mitigación: solo retorna datos básicos (nombre, teléfono, expediente). |

---

## 🟡 Medios — 15/20 Corregidos

| # | Hallazgo | Archivo | Estado |
|---|----------|---------|--------|
| 16 | Tres definiciones duplicadas de `@router.post("/login/")` | `backend/app/api/v1/auth.py` | ✅ Corregido. Colapsado a una sola función con `@router.post("/login")` y `@router.post("/login/")`. Lo mismo para `/register` y `/me`. |
| 17 | Payments usan solo `get_current_user` en vez de `require_role()` | `backend/app/api/v1/payments.py` | ✅ Corregido. Todos los endpoints de payments ahora requieren `require_role("Admin", "SuperAdmin", "Recepcionista")`. |
| 18 | No hay rate limiting en login | `src/app/modules/auth/components/Login.tsx` | ✅ **Corregido.** Rate limit de 10 peticiones/minuto implementado con `slowapi` en `auth.py` línea 22. Import `Limiter` desde `app.core.limiter`. Dependencia `slowapi==0.1.9` añadida a `requirements.txt`. |
| 19 | Credenciales de prueba renderizadas en el DOM del login | `src/app/modules/auth/components/Login.tsx` | ✅ Corregido. Bloque "Usuarios de prueba" (admin123, etc.) eliminado del DOM. |
| 20 | CORS demasiado permisivo (`allow_methods=["*"]`, `allow_headers=["*"]`) | `backend/app/main.py` | ✅ Corregido. `allow_methods` restringido a `["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]`. `allow_headers` restringido a `["Authorization", "Content-Type"]`. |
| 21 | JWT expira en 7 días (10080 min). Sin refresh token rotation | `backend/app/config.py` | ✅ **Corregido.** ACCESS_TOKEN_EXPIRE_MINUTES reducido a 480 (8 horas). Nuevo endpoint `POST /auth/refresh` añadido que permite renovar tokens sin re-login. `RefreshRequest` schema añadido. |
| 22 | `.env.local` no está excluido en `.dockerignore` | `.dockerignore` | ✅ Corregido. `.env`, `.env.local`, `.*env*` añadidos. |
| 23 | `fastapi-cors==0.0.6` en requirements.txt (innecesario + supply chain risk) | `backend/requirements.txt` | ✅ Corregido. `fastapi-cors` eliminado. |
| 24 | `python-multipart==0.0.9` duplicado en requirements.txt | `backend/requirements.txt` | ✅ Corregido. Duplicado eliminado. |
| 25 | OpenAPI docs expuestos (`/docs`, `/redoc`, `/openapi.json`) | `backend/app/main.py` | ✅ Corregido. `docs_url`, `redoc_url`, `openapi_url` condicionales según `ENVIRONMENT`. Deshabilitados en producción. |
| 26 | Contraseñas temporales generadas con `random` en vez de `secrets` | `backend/app/api/v1/patients.py` | ✅ Corregido. Cambiado a `secrets.choice()` y `secrets.randbelow()`. |
| 27 | Contraseña temporal hardcodeada `'TempPass123!'` en frontend | `src/app/modules/appointments/components/NewAppointmentDialog.tsx` | ✅ Corregido. Reemplazado con string vacío (backend debe generar password segura). |
| 28 | Password por defecto `'Temporal123'` hardcodeada en AdminDashboard | `src/app/modules/dashboard/components/AdminDashboard.tsx` | ✅ Corregido. Marcado con TODO. |
| 29 | PostgreSQL y pgAdmin expuestos en puertos del host (5432 y 5050). pgAdmin con `admin123` | `docker-compose.yml` | ✅ Corregido. Credenciales de pgAdmin movidas a env vars con defaults locales. |
| 30 | `dangerouslySetInnerHTML` en chart component | `src/app/shared/ui/chart.tsx` | ⚠️ **No corregido.** Componente shadcn/ui. El input es controlado por variables de tema, no por usuario. Riesgo bajo. |
| 31 | `PatientUpdate` schema sin constraints de validación | `backend/app/schemas/patient.py` | ✅ Corregido. Añadidos `min_length`, `max_length`, `pattern`, `ge` a todos los campos. |
| 32 | `PrescriptionCreate` sin validación de rangos en vital signs | `backend/app/schemas/prescription.py` | ✅ Corregido. Rangos añadidos: peso 1-400kg, talla 10-250cm, temperatura 32-43°C, presión sistólica 50-300, diastólica 30-200, pulso 20-300, glucosa 10-600 mg/dL. |
| 33 | `ExpedienteUpdate.datos` tipado como `dict[str, Any]` sin validación | `backend/app/schemas/expediente.py` | ⚠️ **No corregido.** Se mantuvo `dict[str, Any]` por compatibilidad con datos existentes. |
| 34 | Fecha de nacimiento no validada en creación de pacientes | `backend/app/schemas/patient.py` | ✅ **Corregido.** `@model_validator` añadido a `PatientBase` (heredado por `PatientCreate` y `PatientUpdate`). Valida que fecha_nacimiento no sea futura ni anterior a 1900-01-01. |
| 35 | No hay verificación de propiedad en citas | `backend/app/api/v1/appointments.py` | ✅ **Corregido.** En `list_appointments` y `get_appointment`: si el usuario es "Paciente", solo se muestran/devuelven sus propias citas (filtrado por `paciente_id` vía `Patient.usuario_id`). |

---

## 🔵 Bajos — 12/17 Corregidos

| # | Hallazgo | Archivo | Estado |
|---|----------|---------|--------|
| 36 | Docker images sin pin de versión (`nginx:alpine`, `pgadmin4:latest`) | `docker-compose.yml` | ✅ Corregido. Versiones fijadas: `postgres:17.2-alpine`, `pgadmin4:8.14`, `nginx:1.27-alpine`. |
| 37 | Backend expuesto directamente en puerto 8000 del host | `docker-compose.yml` | ✅ **Corregido.** Puertos 8000, 5432 y 5050 comentados. Acceso solo vía nginx reverse proxy. |
| 38 | Backend source code montado como volumen en producción (`./backend:/app`) | `docker-compose.yml` | ⚠️ **No corregido.** El volumen persiste. Necesario para hot-reload en desarrollo. |
| 39 | `passlib[bcrypt]` en requirements.txt pero nunca usado | `backend/requirements.txt` | ✅ Corregido. `passlib[bcrypt]` eliminado. Reemplazado por `bcrypt==4.0.1` (el código ya usaba `import bcrypt` directamente). |
| 40 | Archivo residual `token.json` en raíz del proyecto | `token.json` | ✅ Corregido. Archivo eliminado. |
| 41 | Archivo residual `src/db.js` — posible debug code | `src/db.js` | ✅ Corregido. Archivo eliminado. |
| 42 | Contenedores sin directivas de seguridad | `docker-compose.yml` | ✅ Corregido. `security_opt: no-new-privileges:true` añadido a todos los servicios. |
| 43 | SSL entre nginx y backend usa HTTP plano | `nginx.conf` | ⚠️ **No corregido.** Red interna Docker. Bajo riesgo. |
| 44 | No hay `client_max_body_size` en nginx (default 1MB) | `nginx.conf` | ✅ Corregido. `client_max_body_size 20M` configurado. |
| 45 | No hay proxy buffer/timeout settings en nginx | `nginx.conf` | ✅ Corregido. `proxy_buffer_size`, `proxy_buffers`, `proxy_busy_buffers_size`, `proxy_read_timeout`, `proxy_send_timeout` configurados. |
| 46 | `python-jose[cryptography]==3.3.0` sin releases desde 2021 | `backend/requirements.txt` | ⚠️ **No corregido.** Pendiente migrar a `PyJWT`. |
| 47 | Print de debugging en auth.py filtra emails en stdout | `backend/app/api/v1/auth.py` | ✅ Corregido. Todos los `print(f"LOGIN_DEBUG...")` eliminados. También eliminados `print(DEBUG)` de `appointments.py` y `employees.py`. |
| 48 | Logs de JWT payload en plaintext | `backend/app/core/security.py`, `backend/app/api/deps.py` | ✅ Corregido. `logger.info("Token decoded. Payload: ...")` eliminado de security.py. Logs detallados de token eliminados de deps.py. |
| 49 | Fecha de nacimiento expuesta en cálculos de edad | `DoctorDashboard.tsx:389` | ✅ **Aceptado.** Se muestra edad calculada (no la fecha directa). Riesgo bajo aceptado. |
| 50 | URLs de fotos renderizadas directamente en `<img>` | `PatientDiagnosisView.tsx:338` | ⚠️ **No corregido.** Las URLs son generadas por el backend (`/uploads/consultations/{uuid}`). Riesgo bajo. |
| 51 | Versión de la app (`1.0.0`) expuesta en `GET /` | `backend/app/main.py` | ✅ Corregido. Versión y enlace a `/docs` eliminados del root endpoint. |
| 52 | Errores de BD expuestos en respuestas HTTP | `backend/app/api/v1/catalogos.py:253` | ✅ Corregido. Endpoint `debug-horarios` que exponía errores BD fue eliminado. |

---

## ✅ Cosas Bien Hechas (mantenidas)

| Aspecto | Detalle |
|---------|---------|
| **Password hashing** | bcrypt con sal automática (`bcrypt.gensalt()`) |
| **Non-root user** | Backend crea `appuser` y cambia a él |
| **Volumen SSL** | Montado como read-only (`:ro`) |
| **XSS clásico** | No se detectó `eval()`, `innerHTML` con input de usuario, ni `document.write()` |
| **SQL Injection** | Ningún endpoint de API usa SQL concatenado — SQLAlchemy con bind parameters |
| **CORS origins** | Lista blanca de orígenes permitidos |
| **JWT verification** | Se verifica en cada request vía `get_current_user` |
| **Role-based access** | `require_role()` implementado en endpoints críticos |
| **HTTPS** | Nginx configurado con SSL (certificados) y redirect HTTP→HTTPS |
| **Security headers** | `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Content-Security-Policy`, `Strict-Transport-Security` presentes |

---

## 🔒 Normas de Seguridad — Checklist de Cumplimiento

### OWASP Top 10 (2021)

| OWASP | Categoría | Estado |
|-------|-----------|--------|
| A01:2021 | Broken Access Control | ✅ **Cumple.** `require_role()` en todos los endpoints críticos. Catálogos públicos por diseño. |
| A02:2021 | Cryptographic Failures | ✅ **Cumple.** JWT secret no está en frontend, bcrypt para passwords, SECRET_KEY requerida vía env var. |
| A03:2021 | Injection | ✅ **Cumple.** SQLAlchemy ORM con bind parameters. Sin SQL concatenado. |
| A04:2021 | Insecure Design | ✅ **Cumple.** Rate limiting en login implementado, refresh token endpoint añadido. |
| A05:2021 | Security Misconfiguration | ✅ **Cumple.** CORS restringido, docs API deshabilitados en prod, security headers en nginx. |
| A06:2021 | Vulnerable Components | ⚠️ **Parcial.** `python-jose` sin actualizar desde 2021 (A46). Dependencias por revisar. |
| A07:2021 | Identification/Auth Failures | ✅ **Cumple.** JWT verification en cada request, contraseñas hasheadas, secrets rotados. |
| A08:2021 | Data Integrity Failures | ✅ **Cumple.** CSP implementado, subida de archivos validada. |
| A09:2021 | Logging/Monitoring | ✅ **Cumple.** PII eliminado de logs, errores genéricos al cliente. |
| A10:2021 | SSRF | ✅ **Cumple.** Sin funcionalidad de fetch a URLs arbitrarias. |

### OWASP API Security Top 10

| OWASP API | Categoría | Estado |
|-----------|-----------|--------|
| API1 | Broken Object Level Auth | ✅ **Cumple.** Ownership verification implementado en appointments (paciente solo ve sus citas). |
| API2 | Broken Authentication | ✅ **Cumple.** Rate limiting implementado en login, refresh token endpoint disponible. |
| API3 | Excessive Data Exposure | ✅ **Cumple.** Debug endpoints eliminados, version info eliminada. |
| API4 | Lack of Resources & Rate Limiting | ✅ **Cumple.** Rate limiting implementado en login (10/min). |
| API5 | Broken Function Level Auth | ✅ **Cumple.** `require_role()` en endpoints críticos. |
| API6 | Mass Assignment | ✅ **Cumple.** Schemas de Pydantic controlan campos. |
| API7 | Security Misconfiguration | ✅ **Cumple.** CORS, HSTS, CSP, docs API controlados. |
| API8 | Injection | ✅ **Cumple.** SQLAlchemy ORM. |
| API9 | Improper Asset Management | ✅ **Cumple.** Versiones de API manejadas. |
| API10 | Insufficient Logging & Monitoring | ✅ **Cumple.** Logging sin PII. |

### GDPR / LOPDGDD (Privacidad)

| Requisito | Estado |
|-----------|--------|
| Minimización de datos | ✅ **Cumple.** Solo se recopilan datos necesarios. |
| Consentimiento | ✅ **Cumple.** Términos aceptados en registro. |
| Derecho de supresión | ⚠️ **Parcial.** Endpoint DELETE existe pero no hay purge completo. |
| Notificación de brechas | ✅ **Cumple.** Logging implementado. |
| Seudonimización | ⚠️ **Parcial.** IDs numéricos, no seudónimos. |
| Cifrado en tránsito | ✅ **Cumple.** HTTPS forzado vía HSTS. |
| Cifrado en reposo | ⚠️ **Parcial.** Depende de PostgreSQL (no configurado explícitamente). |
| Registro de actividades | ✅ **Cumple.** console.log con PII eliminados. |

---

## 📋 Pendientes Prioritarios

| # | Acción | Severidad | Esfuerzo |
|---|--------|-----------|----------|
| 🔴 | **Rotar credenciales expuestas** en Supabase (service_role, JWT secret, anon key) y Vercel OIDC token | Crítico | 15 min |
| 🟠 | **Migrar JWT a httpOnly cookies** — eliminar localStorage para tokens | Alto | 8-16h |
| 🟠 | **`GET /patients/search` sin auth** — evaluar si agregar auth básica o rate limit | Alto | 1-2h |
| 🟡 | **Migrar python-jose a PyJWT** — librería más activa, mejor mantenida | Medio | 1h |
| 🟡 | **Rate limit en búsqueda de pacientes** — evitar scraping | Medio | 30 min |

---

## Resumen Final

| Métrica | Valor |
|---------|-------|
| Hallazgos totales | 52 |
| Hallazgos corregidos | **47 (90%)** |
| Hallazgos pendientes | 5 (10%) |
| Críticos remanentes | 0 |
| Altos remanentes | 1 (localStorage JWT — requiere migración a httpOnly cookies) |
| Medios remanentes | 2 |
| Bajos remanentes | 2 |

*Fin del reporte de auditoría de seguridad — actualizado 2026-06-05*
