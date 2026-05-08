# 🔐 DOCUMENTACIÓN JWT - DENTAL WHITE

Sistema completo de autenticación con JSON Web Tokens (JWT) implementado en el sistema Dental White.

---

## 📋 TABLA DE CONTENIDO

1. [Introducción](#introducción)
2. [Estructura del Sistema](#estructura-del-sistema)
3. [Utilidades JWT](#utilidades-jwt)
4. [AuthContext con JWT](#authcontext-con-jwt)
5. [Componentes de Protección](#componentes-de-protección)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Flujo de Autenticación](#flujo-de-autenticación)
8. [Configuración](#configuración)
9. [Seguridad](#seguridad)
10. [Ejemplos de Uso](#ejemplos-de-uso)
11. [Integración con Backend](#integración-con-backend)

---

## 🎯 INTRODUCCIÓN

### ¿Qué es JWT?

JSON Web Token (JWT) es un estándar abierto (RFC 7519) que define una forma compacta y autocontenida de transmitir información de manera segura entre partes como un objeto JSON.

### Ventajas de JWT

✅ **Stateless** - No requiere almacenar sesiones en el servidor  
✅ **Escalable** - Ideal para microservicios y aplicaciones distribuidas  
✅ **Seguro** - Firmado digitalmente (HMAC o RSA)  
✅ **Portable** - Funciona en web, móvil y APIs  
✅ **Autodescriptivo** - Contiene toda la información del usuario  

### Estructura de un JWT

Un JWT consta de tres partes separadas por puntos:

```
xxxxx.yyyyy.zzzzz
```

1. **Header** (Encabezado) - Algoritmo y tipo de token
2. **Payload** (Carga útil) - Datos del usuario (claims)
3. **Signature** (Firma) - Firma digital para verificar autenticidad

---

## 📁 ESTRUCTURA DEL SISTEMA

```
src/
├── app/
│   ├── utils/
│   │   └── jwt.ts                    # Utilidades JWT principales
│   ├── context/
│   │   └── AuthContext.tsx           # Context con JWT integrado
│   ├── components/
│   │   ├── ProtectedRoute.tsx        # Componente de rutas protegidas
│   │   ├── Login.tsx                 # Login con JWT
│   │   └── Register.tsx              # Registro con JWT
│   └── hooks/
│       └── useTokenRefresh.ts        # Hook de renovación automática
└── variables-sistema.js              # Configuración del sistema
```

---

## 🛠️ UTILIDADES JWT

### Archivo: `/src/app/utils/jwt.ts`

#### Funciones Principales

##### 1. `generateToken(payload, expiresIn)`

Genera un nuevo token JWT.

```typescript
const token = await generateToken({
  userId: '1',
  email: 'user@example.com',
  role: 'patient',
  name: 'Juan Pérez',
}, '24h');
```

**Parámetros:**
- `payload`: Datos del usuario (userId, email, role, name, etc.)
- `expiresIn`: Tiempo de expiración (default: '24h')

**Retorna:** `string` - Token JWT

---

##### 2. `verifyToken(token)`

Verifica y decodifica un token JWT.

```typescript
try {
  const payload = await verifyToken(token);
  console.log(payload.userId, payload.email);
} catch (error) {
  console.error('Token inválido o expirado');
}
```

**Parámetros:**
- `token`: Token JWT a verificar

**Retorna:** `JWTPayload` - Payload decodificado  
**Throws:** Error si el token es inválido o expirado

---

##### 3. `decodeTokenUnsafe(token)`

Decodifica un token SIN verificar la firma (solo para inspección).

```typescript
const payload = decodeTokenUnsafe(token);
console.log(payload); // Datos sin verificar
```

⚠️ **ADVERTENCIA:** No usar para autenticación, solo para leer datos.

---

##### 4. `isTokenExpired(token)`

Verifica si un token está expirado.

```typescript
if (isTokenExpired(token)) {
  console.log('Token expirado');
}
```

---

##### 5. `refreshToken(oldToken)`

Genera un nuevo token con los mismos datos.

```typescript
const newToken = await refreshToken(oldToken);
saveToken(newToken);
```

---

##### 6. `saveToken(token)` y `getStoredToken()`

Gestiona el almacenamiento del token en localStorage.

```typescript
// Guardar
saveToken(token);

// Obtener
const token = getStoredToken();

// Eliminar
removeToken();
```

---

##### 7. `getTokenTimeRemaining(token)`

Obtiene el tiempo restante del token en segundos.

```typescript
const seconds = getTokenTimeRemaining(token);
const minutes = Math.floor(seconds / 60);
console.log(`Expira en ${minutes} minutos`);
```

---

### Interfaz JWTPayload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'patient' | 'receptionist' | 'doctor' | 'admin';
  name: string;
  workCenter?: string;
  specialty?: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
  iss?: string; // Issuer
  aud?: string; // Audience
}
```

---

## 🔐 AUTHCONTEXT CON JWT

### Archivo: `/src/app/context/AuthContext.tsx`

#### Funcionalidades

1. **Login con JWT**
   - Genera token al iniciar sesión
   - Guarda token en localStorage
   - Restaura sesión automáticamente

2. **Logout**
   - Elimina token del storage
   - Limpia estado del usuario

3. **Restauración de Sesión**
   - Verifica token al cargar la aplicación
   - Restaura datos del usuario si el token es válido

#### Uso del AuthContext

```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, token, login, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogin = async () => {
    const success = await login('user@example.com', 'password123');
    if (success) {
      console.log('Login exitoso');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Bienvenido {user?.name}</h1>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      )}
    </div>
  );
}
```

---

## 🛡️ COMPONENTES DE PROTECCIÓN

### ProtectedRoute

Componente para proteger rutas que requieren autenticación.

#### Uso Básico

```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

#### Con Roles Específicos

```typescript
<ProtectedRoute allowedRoles={['admin', 'doctor']}>
  <AdminPanel />
</ProtectedRoute>
```

#### Con Fallback Personalizado

```typescript
<ProtectedRoute 
  allowedRoles={['admin']}
  fallback={<div>Acceso denegado</div>}
>
  <SecretContent />
</ProtectedRoute>
```

---

### Hook usePermissions

Hook para verificar permisos del usuario.

```typescript
import { usePermissions } from './components/ProtectedRoute';

function MyComponent() {
  const { 
    hasRole, 
    isAdmin, 
    isDoctor, 
    canAccessDashboard 
  } = usePermissions();

  return (
    <div>
      {isAdmin() && <button>Panel Admin</button>}
      {hasRole(['doctor', 'admin']) && <button>Ver Expedientes</button>}
      {canAccessDashboard('patient') && <button>Mi Dashboard</button>}
    </div>
  );
}
```

---

## 🔄 HOOKS PERSONALIZADOS

### useTokenRefresh

Hook que renueva automáticamente el token antes de expirar.

#### Uso

```typescript
import { useTokenRefresh } from './hooks/useTokenRefresh';

function App() {
  // Refresca el token 5 minutos antes de expirar
  useTokenRefresh({
    refreshBeforeExpiry: 300, // 5 minutos
    checkInterval: 60000,     // Verificar cada 1 minuto
    showNotifications: true,  // Mostrar toast
  });

  return <YourApp />;
}
```

#### Opciones

- `refreshBeforeExpiry`: Segundos antes de expiración para refrescar (default: 300)
- `checkInterval`: Intervalo de verificación en ms (default: 60000)
- `showNotifications`: Mostrar notificaciones (default: true)

---

### useTokenInfo

Hook para obtener información del token actual.

```typescript
import { useTokenInfo } from './hooks/useTokenRefresh';

function TokenStatus() {
  const { hasToken, timeRemaining, expiresAt, isExpired } = useTokenInfo();

  if (!hasToken) {
    return <div>No hay sesión activa</div>;
  }

  const minutes = Math.floor(timeRemaining / 60);

  return (
    <div>
      <p>Token expira en: {minutes} minutos</p>
      <p>Fecha de expiración: {expiresAt?.toLocaleString()}</p>
      {isExpired && <p className="text-red-500">Token expirado</p>}
    </div>
  );
}
```

---

## 🔄 FLUJO DE AUTENTICACIÓN

### 1. Login

```mermaid
Usuario → Login Form → AuthContext.login()
  ↓
Verificar credenciales en mockUsers
  ↓
Generar JWT con generateToken()
  ↓
Guardar en localStorage con saveToken()
  ↓
Actualizar estado (user, token, isAuthenticated)
  ↓
Mostrar Dashboard
```

### 2. Restauración de Sesión

```mermaid
App carga → useEffect en AuthContext
  ↓
getStoredToken() desde localStorage
  ↓
¿Token existe?
  ├─ Sí → verifyToken()
  │   ├─ Válido → Restaurar usuario
  │   └─ Inválido → removeToken()
  └─ No → Mostrar login
```

### 3. Renovación Automática

```mermaid
useTokenRefresh hook activo
  ↓
Verificar cada 1 minuto (configurable)
  ↓
getTokenTimeRemaining()
  ↓
¿Expira pronto? (< 5 min)
  ├─ Sí → refreshToken()
  │   ├─ Éxito → saveToken(newToken)
  │   └─ Error → logout()
  └─ No → Continuar
```

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# JWT Secret Key (CAMBIAR EN PRODUCCIÓN)
VITE_JWT_SECRET=dental-white-super-secret-key-2026

# Token expiration time
VITE_JWT_EXPIRATION=24h

# Refresh token before expiry (seconds)
VITE_JWT_REFRESH_BEFORE=300

# API URL (para backend futuro)
VITE_API_URL=http://localhost:3001
```

### Configuración en jwt.ts

```typescript
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'default-secret';
const JWT_ISSUER = 'dental-white-system';
const JWT_AUDIENCE = 'dental-white-users';
```

---

## 🔒 SEGURIDAD

### Mejores Prácticas

#### 1. Secret Key Seguro

```bash
# Generar secret seguro
openssl rand -base64 32
```

```env
VITE_JWT_SECRET=tu_clave_super_segura_aqui
```

#### 2. HTTPS en Producción

```nginx
# nginx.conf
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

#### 3. Tiempo de Expiración Razonable

```typescript
// Tokens de corta duración
generateToken(payload, '2h');  // 2 horas

// Refresh tokens de larga duración
generateRefreshToken(payload, '7d'); // 7 días
```

#### 4. Validación en Cada Request

```typescript
// Verificar token en cada operación sensible
const token = getStoredToken();
if (!token || isTokenExpired(token)) {
  logout();
  return;
}
```

#### 5. No Almacenar Datos Sensibles

```typescript
// ❌ NO HACER
generateToken({
  userId: '1',
  password: 'secret123',  // ❌ NUNCA
  creditCard: '1234',     // ❌ NUNCA
});

// ✅ CORRECTO
generateToken({
  userId: '1',
  email: 'user@example.com',
  role: 'patient',
  name: 'Juan Pérez',
});
```

---

## 💡 EJEMPLOS DE USO

### Ejemplo 1: Login Completo

```typescript
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { toast } from 'sonner';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Bienvenido!');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={loading}>
        {loading ? 'Iniciando...' : 'Login'}
      </button>
    </form>
  );
}
```

### Ejemplo 2: Dashboard Protegido

```typescript
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor']}>
      <div>
        <h1>Panel de {user?.role}</h1>
        <p>Bienvenido {user?.name}</p>
      </div>
    </ProtectedRoute>
  );
}
```

### Ejemplo 3: Verificar Token Manualmente

```typescript
import { getStoredToken, verifyToken } from './utils/jwt';

async function checkAuth() {
  const token = getStoredToken();
  
  if (!token) {
    console.log('No hay token');
    return false;
  }

  try {
    const payload = await verifyToken(token);
    console.log('Usuario autenticado:', payload.name);
    return true;
  } catch (error) {
    console.error('Token inválido');
    return false;
  }
}
```

### Ejemplo 4: Mostrar Tiempo de Sesión

```typescript
import { useTokenInfo } from './hooks/useTokenRefresh';

function SessionTimer() {
  const { timeRemaining, expiresAt } = useTokenInfo();
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="session-timer">
      <p>Sesión expira en: {minutes}m {seconds}s</p>
      <p>Expira: {expiresAt?.toLocaleTimeString()}</p>
    </div>
  );
}
```

---

## 🌐 INTEGRACIÓN CON BACKEND

### Cuando tengas un backend real con Node.js/Express:

#### 1. Endpoint de Login

```javascript
// Backend - Node.js/Express
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verificar usuario en base de datos
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Generar JWT
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user });
});
```

#### 2. Middleware de Autenticación

```javascript
// Backend - Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = payload;
    next();
  });
}

// Usar en rutas protegidas
app.get('/api/appointments', authenticateToken, (req, res) => {
  // req.user contiene el payload del token
  res.json({ appointments: [...] });
});
```

#### 3. Frontend con API

```typescript
// Frontend - API Service
import { getStoredToken } from './utils/jwt';

async function fetchAppointments() {
  const token = getStoredToken();
  
  const response = await fetch('http://localhost:3001/api/appointments', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expirado o inválido
    logout();
    throw new Error('Sesión expirada');
  }

  return await response.json();
}
```

---

## 📊 ESTRUCTURA DEL TOKEN

### Ejemplo de Token JWT Real

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJhZG1pbkBkZW50YWx3aGl0ZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiQWRtaW5pc3RyYWRvciBQcmluY2lwYWwiLCJpYXQiOjE3MDg5MDAwMDAsImV4cCI6MTcwODk4NjQwMCwiaXNzIjoiZGVudGFsLXdoaXRlLXN5c3RlbSIsImF1ZCI6ImRlbnRhbC13aGl0ZS11c2VycyJ9.
signature_here
```

### Decodificado:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "1",
  "email": "admin@dentalwhite.com",
  "role": "admin",
  "name": "Administrador Principal",
  "iat": 1708900000,
  "exp": 1708986400,
  "iss": "dental-white-system",
  "aud": "dental-white-users"
}
```

---

## 🚀 COMANDOS ÚTILES

```bash
# Instalar dependencias JWT
pnpm install jose js-base64

# Verificar token en consola del navegador
localStorage.getItem('dental_white_token')

# Decodificar token manualmente
const token = localStorage.getItem('dental_white_token');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log(payload);

# Limpiar token
localStorage.removeItem('dental_white_token');
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [x] Instalar librerías JWT (`jose`, `js-base64`)
- [x] Crear utilidades JWT (`jwt.ts`)
- [x] Actualizar AuthContext con JWT
- [x] Implementar Login con JWT
- [x] Implementar Register con JWT
- [x] Crear componente ProtectedRoute
- [x] Crear hook usePermissions
- [x] Crear hook useTokenRefresh
- [x] Configurar variables de entorno
- [ ] Integrar con backend (próximo paso)
- [ ] Implementar refresh tokens
- [ ] Añadir tests unitarios

---

## 📞 SOPORTE

Para problemas o preguntas:

- **Email**: contacto@dentalwhite.com
- **Documentación Sistema**: Ver `VARIABLES_DEL_SISTEMA.md`
- **Documentación Docker**: Ver `DOCKER.md`

---

**Versión del documento:** 1.0  
**Última actualización:** 25 de febrero de 2026  
**Sistema:** Dental White v0.0.1  
**Librerías:** jose v6.1.3, js-base64 v3.7.8
