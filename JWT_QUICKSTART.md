# 🚀 JWT QUICKSTART - DENTAL WHITE

Guía rápida para empezar a usar JWT en 5 minutos.

---

## ✅ YA ESTÁ IMPLEMENTADO

El sistema JWT **ya está funcionando** en tu aplicación. No necesitas hacer nada adicional para usarlo.

---

## 🔐 CREDENCIALES DE PRUEBA

Usa estas credenciales para probar el sistema JWT:

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | admin@dentalwhite.com | admin123 |
| **Recepción** | recepcion@dentalwhite.com | recep123 |
| **Doctor** | doctor@dentalwhite.com | doctor123 |
| **Paciente** | paciente@example.com | paciente123 |

---

## 📝 FLUJO BÁSICO

### 1. Iniciar Sesión

Al hacer login, el sistema automáticamente:
1. ✅ Genera un token JWT
2. ✅ Lo guarda en localStorage
3. ✅ Restaura la sesión automáticamente al recargar

### 2. Verificar Token

Abre la consola del navegador y ejecuta:

```javascript
// Ver el token actual
localStorage.getItem('dental_white_token')

// Decodificar el token (sin verificar)
const token = localStorage.getItem('dental_white_token');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log(payload);

// Resultado esperado:
// {
//   userId: "1",
//   email: "admin@dentalwhite.com",
//   role: "admin",
//   name: "Administrador Principal",
//   iat: 1708900000,
//   exp: 1708986400,
//   iss: "dental-white-system",
//   aud: "dental-white-users"
// }
```

### 3. Renovación Automática

El sistema **renueva automáticamente** el token 5 minutos antes de expirar.

No necesitas hacer nada. Verás una notificación cuando se renueve:
> ✅ "Sesión renovada automáticamente"

---

## 🛠️ USO EN TU CÓDIGO

### Hook useAuth

```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Hola {user?.name}</p>
          <p>Tu rol: {user?.role}</p>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      ) : (
        <button onClick={() => login('email', 'password')}>Login</button>
      )}
    </div>
  );
}
```

### Proteger Rutas

```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor']}>
      <SecretPage />
    </ProtectedRoute>
  );
}
```

### Verificar Permisos

```typescript
import { usePermissions } from './components/ProtectedRoute';

function Menu() {
  const { isAdmin, isDoctor, hasRole } = usePermissions();

  return (
    <nav>
      {isAdmin() && <a href="/admin">Panel Admin</a>}
      {hasRole(['doctor', 'admin']) && <a href="/patients">Pacientes</a>}
    </nav>
  );
}
```

---

## 📦 ARCHIVOS CREADOS

```
✅ /src/app/utils/jwt.ts              - Utilidades JWT
✅ /src/app/context/AuthContext.tsx   - Context con JWT
✅ /src/app/components/ProtectedRoute.tsx - Rutas protegidas
✅ /src/app/hooks/useTokenRefresh.ts  - Renovación automática
✅ /JWT_DOCUMENTATION.md              - Documentación completa
✅ /.env.example                      - Variables de entorno
```

---

## ⚙️ CONFIGURACIÓN (Opcional)

### Cambiar tiempo de expiración

Crea un archivo `.env` en la raíz:

```env
# Token expira en 12 horas (en lugar de 24h por defecto)
VITE_JWT_EXPIRATION=12h

# Refrescar 10 minutos antes (en lugar de 5 min)
VITE_JWT_REFRESH_BEFORE=600
```

### Cambiar Secret Key (IMPORTANTE EN PRODUCCIÓN)

```env
# Generar secret seguro:
# openssl rand -base64 32

VITE_JWT_SECRET=tu_clave_super_segura_aqui
```

---

## 🔍 DEBUGGING

### Ver información del token

```typescript
import { useTokenInfo } from './hooks/useTokenRefresh';

function TokenDebug() {
  const { hasToken, timeRemaining, expiresAt, isExpired } = useTokenInfo();

  return (
    <div>
      <p>¿Tiene token?: {hasToken ? 'Sí' : 'No'}</p>
      <p>Tiempo restante: {Math.floor(timeRemaining / 60)} minutos</p>
      <p>Expira: {expiresAt?.toLocaleString()}</p>
      <p>¿Expirado?: {isExpired ? 'Sí' : 'No'}</p>
    </div>
  );
}
```

### Logs en consola

Abre las DevTools y verás logs como:

```
Token valid for 1439 more minutes
Token expiring in 290s, refreshing...
Token refreshed successfully
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Token expirado

Si ves el error "Token expirado":
1. Cierra sesión
2. Vuelve a iniciar sesión
3. El nuevo token durará 24 horas

### Sesión no se restaura

```javascript
// Limpiar storage y recargar
localStorage.clear();
location.reload();
```

### Ver estado de autenticación

```javascript
// En consola del navegador
const token = localStorage.getItem('dental_white_token');
console.log('Token:', token ? 'Existe' : 'No existe');

// Decodificar
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Usuario:', payload.name);
  console.log('Rol:', payload.role);
  console.log('Expira:', new Date(payload.exp * 1000).toLocaleString());
}
```

---

## 📚 MÁS INFORMACIÓN

- **Documentación completa**: Ver `JWT_DOCUMENTATION.md`
- **Variables del sistema**: Ver `VARIABLES_DEL_SISTEMA.md`
- **Docker**: Ver `DOCKER.md`

---

## ✨ FUNCIONALIDADES INCLUIDAS

- ✅ Login con JWT
- ✅ Registro de usuarios
- ✅ Verificación de tokens
- ✅ Renovación automática antes de expirar
- ✅ Persistencia en localStorage
- ✅ Restauración de sesión al recargar
- ✅ Rutas protegidas por rol
- ✅ Hook de permisos
- ✅ Notificaciones toast
- ✅ Loading states
- ✅ Logout seguro

---

## 🎉 ¡LISTO!

El sistema JWT está **100% funcional**. Solo inicia sesión y disfruta de la seguridad automática.

**Próximos pasos sugeridos:**
1. Conectar con backend real
2. Implementar refresh tokens
3. Añadir autenticación de 2 factores
4. Integrar con Supabase

---

**Versión:** 1.0  
**Fecha:** 25 de febrero de 2026  
**Sistema:** Dental White v0.0.1
