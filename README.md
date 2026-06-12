# 🦷 DENTAL WHITE - Sistema de Gestión Dental

Sistema completo de gestión para clínicas dentales con autenticación JWT, dashboards diferenciados por roles, y gestión completa de pacientes, citas y expedientes médicos.

![Versión](https://img.shields.io/badge/version-0.0.1-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)
![JWT](https://img.shields.io/badge/JWT-Enabled-00b9f1.svg)

---

## 📋 TABLA DE CONTENIDO

1. [Características](#-características)
2. [Tecnologías](#-tecnologías)
3. [Inicio Rápido](#-inicio-rápido)
4. [Documentación](#-documentación)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Roles de Usuario](#-roles-de-usuario)
7. [Autenticación JWT](#-autenticación-jwt)
8. [Credenciales de Prueba](#-credenciales-de-prueba)
9. [Docker](#-docker)
10. [Variables de Entorno](#-variables-de-entorno)
11. [Contribuir](#-contribuir)
12. [Licencia](#-licencia)

---

## ✨ CARACTERÍSTICAS

### 🏥 **Landing Page Completa**
- ✅ Información de la clínica (Misión, Visión)
- ✅ Presentación del Dr. Faustino Vázquez Rodríguez
- ✅ Servicios por sucursal (sin precios públicos)
- ✅ Sección de promociones
- ✅ Diseño responsivo con colores institucionales azules
- ✅ Logo en formato rectangular

### 🔐 **Sistema de Autenticación JWT**
- ✅ Login seguro con tokens JWT
- ✅ Registro de pacientes con validación
- ✅ Renovación automática de tokens
- ✅ Persistencia de sesión
- ✅ Protección de rutas por rol
- ✅ CAPTCHA de seguridad

### 👤 **Dashboards Diferenciados**

#### **Panel de Paciente**
- Ver citas programadas
- Agendar nuevas citas
- Consultar expediente médico
- Historial de visitas

#### **Panel de Recepción**
- Gestión completa de citas
- Registro de pacientes
- **Manejo de pagos (completo o a cuotas)**
- **Campo de precio del servicio**
- Calendario de citas

#### **Panel de Médico**
- Ver citas asignadas
- **Consultar citas por día específico**
- Crear y editar expedientes médicos
- Diagnósticos y tratamientos
- Impresión de recetas y expedientes
- Vista de historia clínica completa

#### **Panel de Administrador**
- Gestión de empleados (alta, baja, edición)
- Reportes y estadísticas
- Control de sucursales
- Configuración del sistema
- Administración de servicios

### 📊 **Gestión Completa**
- **Citas**: Programación, confirmación, cancelación
- **Expedientes Digitales**: Historial clínico completo
- **Empleados**: Gestión por sucursal
- **Servicios**: Delimitados por sucursal
- **Reportes**: Estadísticas y análisis

---

## 🛠️ TECNOLOGÍAS

### **Frontend**
- **React** 19.2.7 - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS v4** - Estilos modernos
- **Shadcn/ui** - Componentes UI

### **Autenticación**
- **jose** - JWT para navegadores
- **js-base64** - Decodificación Base64

### **UI/UX**
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos
- **Recharts** - Gráficos
- **Sonner** - Notificaciones toast
- **Motion** - Animaciones

### **Formularios y Validación**
- **React Hook Form** - Gestión de formularios
- **Date-fns** - Manejo de fechas
- **Input OTP** - Códigos de verificación

### **Impresión y PDF**
- **jsPDF** - Generación de PDFs
- **html2canvas** - Capturas de pantalla

### **DevOps**
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación
- **Nginx** - Servidor web de producción
- **pnpm** - Gestión de paquetes

---

## 🚀 INICIO RÁPIDO

### **Opción 1: Desarrollo Local**

```bash
# Clonar repositorio
git clone <repository-url>
cd dental-white

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Abrir en navegador
http://localhost:5173
```

### **Opción 2: Docker (Desarrollo)**

```bash
# Levantar contenedor de desarrollo
pnpm run docker:dev

# Abrir en navegador
http://localhost:5173
```

### **Opción 3: Docker (Producción)**

```bash
# Construir y levantar
pnpm run docker:up

# Abrir en navegador
http://localhost:3000
```

---

## 📚 DOCUMENTACIÓN

| Documento | Descripción |
|-----------|-------------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitectura técnica, stack, estructura del proyecto |
| **[API_REFERENCE.md](./API_REFERENCE.md)** | Referencia completa de todos los endpoints (45+) |
| **[USER_FLOWS.md](./USER_FLOWS.md)** | Flujos de usuario por rol con estado de implementación |
| **[KNOWN_ISSUES.md](./KNOWN_ISSUES.md)** | Bugs conocidos y deuda técnica |
| **[VARIABLES_DEL_SISTEMA.md](./VARIABLES_DEL_SISTEMA.md)** | Variables y tipos del sistema |
| **[database/DIAGRAM.md](./database/DIAGRAM.md)** | Diagrama ER de la base de datos |
| **[database/ESTRUCTURA_COMPLETA.md](./database/ESTRUCTURA_COMPLETA.md)** | Estructura completa de BD (22 tablas) |

---

## 📁 ESTRUCTURA DEL PROYECTO

```
dental-white/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboards/          # Dashboards por rol
│   │   │   │   ├── PatientDashboard.tsx
│   │   │   │   ├── ReceptionistDashboard.tsx
│   │   │   │   ├── DoctorDashboard.tsx
│   │   │   │   └── AdminDashboard.tsx
│   │   │   ├── ui/                  # Componentes UI (Shadcn)
│   │   │   ├── LandingPage.tsx      # Página de inicio
│   │   │   ├── Login.tsx            # Login con JWT
│   │   │   ├── Register.tsx         # Registro
│   │   │   ├── ProtectedRoute.tsx   # Rutas protegidas
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Context con JWT
│   │   ├── hooks/
│   │   │   └── useTokenRefresh.ts   # Renovación automática
│   │   ├── utils/
│   │   │   └── jwt.ts               # Utilidades JWT
│   │   ├── data/
│   │   │   └── mockData.ts          # Datos de ejemplo
│   │   └── App.tsx                  # Componente principal
│   └── styles/                      # Estilos globales
├── public/                          # Assets estáticos
├── docker-compose.yml               # Docker producción
├── docker-compose.dev.yml           # Docker desarrollo
├── Dockerfile                       # Imagen producción
├── Dockerfile.dev                   # Imagen desarrollo
├── nginx.conf                       # Configuración Nginx
├── package.json                     # Dependencias
└── vite.config.ts                   # Configuración Vite
```

---

## 👥 ROLES DE USUARIO

El sistema maneja 4 roles diferentes:

### 🧑‍⚕️ **Paciente** (`patient`)
- Agendar citas
- Ver historial médico
- Consultar próximas citas
- Descargar expedientes

### 🗂️ **Recepcionista** (`receptionist`)
- Gestión de citas (CRUD)
- Registro de pacientes
- **Manejo de pagos (completo/cuotas)**
- **Campo de precio del servicio**
- Calendario general

### 👨‍⚕️ **Doctor** (`doctor`)
- Ver citas asignadas
- **Filtrar citas por día específico**
- Crear expedientes médicos
- Diagnósticos y tratamientos
- Generar recetas
- Imprimir expedientes

### 👨‍💼 **Administrador** (`admin`)
- Acceso total al sistema
- Gestión de empleados
- Reportes y estadísticas
- Configuración de sucursales
- Control de servicios

---

## 🔐 AUTENTICACIÓN JWT

### **Características**

✅ **Tokens seguros** - Firmados con HS256  
✅ **Expiración configurable** - Default: 24 horas  
✅ **Renovación automática** - Refresca 5 min antes de expirar  
✅ **Persistencia** - Almacenado en localStorage  
✅ **Restauración de sesión** - Al recargar la página  
✅ **Rutas protegidas** - Por rol de usuario  

### **Payload del Token**

```json
{
  "userId": "1",
  "email": "admin@dentalwhite.com",
  "role": "admin",
  "name": "Administrador Principal",
  "workCenter": "Sucursal Centro",
  "specialty": "Odontología General",
  "iat": 1708900000,
  "exp": 1708986400,
  "iss": "dental-white-system",
  "aud": "dental-white-users"
}
```

### **Uso Básico**

```typescript
// Login
const { login } = useAuth();
await login('user@example.com', 'password');

// Verificar autenticación
const { user, isAuthenticated } = useAuth();

// Proteger rutas
<ProtectedRoute allowedRoles={['admin', 'doctor']}>
  <AdminPanel />
</ProtectedRoute>

// Verificar permisos
const { isAdmin, hasRole } = usePermissions();
if (isAdmin()) { /* ... */ }
```

📖 **Más información**: Ver [JWT_QUICKSTART.md](./JWT_QUICKSTART.md)

---

## 🔑 CREDENCIALES DE PRUEBA

El sistema incluye usuarios de prueba para cada rol:

| Rol | Email | Password | Acceso |
|-----|-------|----------|--------|
| **👨‍💼 Admin** | admin@dentalwhite.com | admin123 | Panel completo + reportes |
| **🗂️ Recepción** | recepcion@dentalwhite.com | recep123 | Gestión de citas + pacientes |
| **👨‍⚕️ Doctor** | doctor@dentalwhite.com | doctor123 | Citas + expedientes médicos |
| **🧑‍⚕️ Paciente** | paciente@example.com | paciente123 | Portal del paciente |

---

## 🐳 DOCKER

### **Comandos Rápidos**

```bash
# Desarrollo (hot reload)
pnpm run docker:dev

# Producción
pnpm run docker:up

# Ver logs
pnpm run docker:logs

# Detener
pnpm run docker:down

# Reconstruir
pnpm run docker:build
```

### **Puertos**

- **Desarrollo**: `http://localhost:5173`
- **Producción**: `http://localhost:3000`
- **Adminer (DB)**: `http://localhost:8080` (si se habilita)

📖 **Más información**: Ver [DOCKER.md](./DOCKER.md)

---

## ⚙️ VARIABLES DE ENTORNO

### **Crear archivo `.env`**

```bash
# Copiar plantilla
cp .env.example .env

# Editar variables
nano .env
```

### **Variables Principales**

```env
# JWT
VITE_JWT_SECRET=dental-white-super-secret-key-2026
VITE_JWT_EXPIRATION=24h
VITE_JWT_REFRESH_BEFORE=300

# API (futuro backend)
VITE_API_URL=http://localhost:3001

# App
VITE_APP_NAME=Dental White
VITE_APP_VERSION=0.0.1
NODE_ENV=development
```

### **Generar Secret Seguro**

```bash
# Para producción, generar una clave única
openssl rand -base64 32
```

---

## 📊 CARACTERÍSTICAS DEL SISTEMA

### **Sucursales**

El sistema maneja 3 sucursales:

1. **Pénjamo** - Color: Sky Blue
   - Calle primero de mayo #9, Pénjamo Gto
   - Servicios: 7 (Limpieza, Ortodoncia, Endodoncia, etc.)

2. **Valle de Santiago** - Color: Blue
   - Centro, Valle de Santiago Gto
   - Servicios: 4 (Prótesis, Implantes, Cirugía, Periodoncia)

3. **Abasolo** - Color: Cyan
   - Centro, Abasolo Gto
   - Servicios: 4 (Odontopediatría, Diseño de Sonrisa, etc.)

### **Servicios**

Total de **15 servicios** delimitados por sucursal:
- Limpieza Dental
- Ortodoncia
- Endodoncia
- Extracción
- Blanqueamiento
- Prótesis Dentales
- Revisión General
- Implantes Dentales
- Cirugía Maxilofacial
- Periodoncia
- Odontopediatría
- Diseño de Sonrisa
- Coronas y Puentes
- Rehabilitación Oral

---

## 🎨 TEMA Y DISEÑO

### **Colores Institucionales**

```css
--primary: #0284c7;      /* Sky Blue 600 */
--secondary: #0ea5e9;    /* Sky Blue 500 */
--accent: #2563eb;       /* Blue 600 */
--background: #ffffff;
--destructive: #d4183d;
```

### **Tipografía**

- Font base: 16px
- Font weight medium: 500
- Font weight normal: 400

---

## 📦 SCRIPTS DISPONIBLES

```bash
# Desarrollo
pnpm dev              # Servidor desarrollo (Vite)
pnpm build            # Build de producción
pnpm preview          # Preview del build

# Docker
pnpm docker:build     # Construir imagen
pnpm docker:run       # Ejecutar contenedor
pnpm docker:up        # Docker Compose producción
pnpm docker:down      # Detener contenedores
pnpm docker:dev       # Docker Compose desarrollo
pnpm docker:logs      # Ver logs
```

---

## 🔄 FLUJO DE TRABAJO

### **1. Usuario No Autenticado**
```
Landing Page → Login/Register → Dashboard (según rol)
```

### **2. Login**
```
Ingresar credenciales → Generar JWT → Guardar token → Redirigir a Dashboard
```

### **3. Sesión Activa**
```
Token en localStorage → Verificar al cargar → Restaurar usuario → Renovar automáticamente
```

### **4. Panel de Recepción**
```
Ver citas → Crear nueva cita → Seleccionar paciente → 
Elegir servicio → Ingresar precio → Seleccionar pago (completo/cuotas) → Confirmar
```

### **5. Panel de Doctor**
```
Ver citas del día → Filtrar por fecha → Seleccionar paciente →
Ver expediente → Agregar diagnóstico → Generar receta → Imprimir
```

---

## 🤝 CONTRIBUIR

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 LICENCIA

Este proyecto es privado y propietario.

**Desarrollado para**: Dental White  
**Versión**: 0.0.1  
**Última actualización**: 25 de febrero de 2026

---

## 📞 CONTACTO

**Dental White**
- 📧 Email: contacto@dentalwhite.com
- 📧 Citas: citas@dentalwhite.com
- 📱 Teléfono: 55 1234 5678
- 📱 WhatsApp: +52 1 429 130 9742
- 📍 Dirección: Calle primero de mayo #9, Pénjamo Gto

---

## 🙏 AGRADECIMIENTOS

- **React Team** - Por React 18
- **Vercel** - Por Vite
- **Shadcn** - Por los componentes UI
- **Tailwind Labs** - Por Tailwind CSS v4
- **Radix UI** - Por los primitivos accesibles

---

## 📈 ROADMAP

### **Próximas Funcionalidades**

- [ ] Backend con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Integración con Supabase
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre doctor y paciente
- [ ] Recordatorios automáticos de citas
- [ ] Sistema de pagos en línea
- [ ] App móvil (React Native)
- [ ] Integración con WhatsApp Business
- [ ] Panel de reportes avanzados
- [ ] Exportación a Excel/PDF
- [ ] Sistema de inventario de materiales
- [ ] Gestión de proveedores

---

<div align="center">

**⭐ Si te gusta este proyecto, no olvides darle una estrella ⭐**

Hecho con ❤️ por el equipo de Dental White

</div>
