# 📚 ÍNDICE DE DOCUMENTACIÓN - DENTAL WHITE

Guía completa de toda la documentación disponible en el sistema Dental White.

---

## 🎯 INICIO RÁPIDO

¿Primera vez con el sistema? Comienza aquí:

1. **[README.md](./README.md)** - Visión general del proyecto
2. **[JWT_QUICKSTART.md](./JWT_QUICKSTART.md)** - Autenticación en 5 minutos
3. **[DOCKER.md](./DOCKER.md#comandos-rápidos)** - Ejecutar con Docker

---

## 📖 DOCUMENTACIÓN PRINCIPAL

### 🏠 [README.md](./README.md)
**Visión general completa del proyecto**

**Contenido:**
- ✅ Características del sistema
- ✅ Tecnologías utilizadas
- ✅ Inicio rápido (3 opciones)
- ✅ Estructura del proyecto
- ✅ Roles de usuario
- ✅ Credenciales de prueba
- ✅ Scripts disponibles
- ✅ Roadmap de funcionalidades

**Ideal para:**
- Nuevos desarrolladores en el proyecto
- Entender qué hace el sistema
- Conocer las tecnologías

**Tiempo de lectura:** ~10 minutos

---

### 🔐 [JWT_DOCUMENTATION.md](./JWT_DOCUMENTATION.md)
**Documentación completa de autenticación JWT**

**Contenido:**
- ✅ Introducción a JWT
- ✅ Estructura del sistema JWT
- ✅ Utilidades y funciones
- ✅ AuthContext con JWT
- ✅ Componentes de protección
- ✅ Hooks personalizados
- ✅ Flujo de autenticación
- ✅ Configuración de seguridad
- ✅ Ejemplos de uso
- ✅ Integración con backend
- ✅ Solución de problemas

**Ideal para:**
- Entender cómo funciona JWT
- Implementar autenticación
- Debugging de tokens
- Integrar con backend

**Tiempo de lectura:** ~30 minutos  
**Longitud:** 10,000+ palabras

---

### 🚀 [JWT_QUICKSTART.md](./JWT_QUICKSTART.md)
**Guía rápida de JWT para empezar en 5 minutos**

**Contenido:**
- ✅ Credenciales de prueba
- ✅ Flujo básico de autenticación
- ✅ Verificar tokens
- ✅ Uso en código
- ✅ Debugging rápido
- ✅ Solución de problemas comunes

**Ideal para:**
- Empezar rápido con JWT
- Referencia rápida
- Testing de autenticación

**Tiempo de lectura:** ~5 minutos

---

### 🐳 [DOCKER.md](./DOCKER.md)
**Guía completa de Docker y despliegue**

**Contenido:**
- ✅ Prerequisitos
- ✅ Archivos de configuración
- ✅ Comandos básicos
- ✅ Modo desarrollo
- ✅ Modo producción
- ✅ Variables de entorno
- ✅ Autenticación JWT en Docker
- ✅ Troubleshooting
- ✅ Seguridad
- ✅ Despliegue en producción

**Ideal para:**
- Ejecutar el sistema con Docker
- Desplegar en producción
- Configurar entornos
- DevOps

**Tiempo de lectura:** ~20 minutos

---

### 📋 [VARIABLES_DEL_SISTEMA.md](./VARIABLES_DEL_SISTEMA.md)
**Variables y configuración del sistema**

**Contenido:**
- ✅ Información general
- ✅ Usuarios y roles
- ✅ Sucursales
- ✅ Servicios dentales
- ✅ Pacientes
- ✅ Empleados
- ✅ Citas
- ✅ Expedientes médicos
- ✅ Configuración de tema
- ✅ Dependencias
- ✅ Assets e imágenes
- ✅ Credenciales de acceso

**Ideal para:**
- Conocer todas las variables
- Configurar el sistema
- Referencia de datos
- Desarrollo de features

**Tiempo de lectura:** ~15 minutos

---

## 📦 ARCHIVOS DE CONFIGURACIÓN

### ⚙️ [variables-sistema.json](./variables-sistema.json)
**Variables del sistema en formato JSON**

**Uso:**
```javascript
import config from './variables-sistema.json';
console.log(config.systemInfo.name);
```

**Contiene:**
- Información del sistema
- Contacto
- Director
- Usuarios mock
- Sucursales
- Servicios
- Pacientes
- Empleados
- Configuración de tema
- Assets

**Ideal para:**
- Importar en JavaScript/TypeScript
- Usar en Python/PHP
- APIs y backends
- Configuración general

---

### 📝 [variables-sistema.js](./variables-sistema.js)
**Variables del sistema en formato JavaScript**

**Uso:**
```javascript
import { SYSTEM_INFO, SERVICES, USER_ROLES } from './variables-sistema.js';
console.log(SYSTEM_INFO.name);
```

**Contiene:**
- Exports nombrados
- Constantes tipadas
- Documentación inline
- Default export

**Ideal para:**
- Proyectos JavaScript/TypeScript
- Tree-shaking
- Imports selectivos
- IntelliSense

---

### 🔒 [.env.example](./.env.example)
**Plantilla de variables de entorno**

**Contiene:**
- Configuración JWT
- URLs de API
- Información de la app
- Features flags
- Storage keys
- Seguridad
- Logging

**Uso:**
```bash
cp .env.example .env
nano .env  # Editar valores
```

**Ideal para:**
- Configurar nuevo entorno
- Documentar variables requeridas
- Referencia de configuración

---

## 🎓 GUÍAS POR CASO DE USO

### 🆕 **Soy nuevo en el proyecto**

1. Lee [README.md](./README.md) - Visión general
2. Ejecuta con [DOCKER.md](./DOCKER.md#inicio-rápido) - `pnpm run docker:dev`
3. Prueba login con [JWT_QUICKSTART.md](./JWT_QUICKSTART.md#credenciales-de-prueba)
4. Explora las [credenciales de prueba](#credenciales-de-prueba)

---

### 🔐 **Necesito implementar autenticación**

1. Lee [JWT_QUICKSTART.md](./JWT_QUICKSTART.md) - Conceptos básicos
2. Revisa [JWT_DOCUMENTATION.md](./JWT_DOCUMENTATION.md) - Guía completa
3. Consulta [variables-sistema.js](./variables-sistema.js) - Usuarios mock
4. Usa el [AuthContext](./src/app/context/AuthContext.tsx) - Ya implementado

---

### 🐳 **Necesito desplegar en producción**

1. Lee [DOCKER.md](./DOCKER.md#modo-producción) - Producción
2. Configura [.env.example](./.env.example) - Variables
3. Revisa [DOCKER.md](./DOCKER.md#seguridad) - Seguridad
4. Sigue [DOCKER.md](./DOCKER.md#despliegue-en-producción) - Deploy

---

### 🎨 **Necesito personalizar el sistema**

1. Consulta [VARIABLES_DEL_SISTEMA.md](./VARIABLES_DEL_SISTEMA.md) - Configuración
2. Edita [variables-sistema.js](./variables-sistema.js) - Variables
3. Modifica estilos en `/src/styles/theme.css`
4. Actualiza colores en [variables-sistema.js](./variables-sistema.js#tema-y-colores)

---

### 🔧 **Necesito agregar un nuevo rol**

1. Define el rol en [AuthContext.tsx](./src/app/context/AuthContext.tsx)
2. Actualiza [variables-sistema.js](./variables-sistema.js#user_roles)
3. Crea dashboard en `/src/app/components/dashboards/`
4. Protege rutas con [ProtectedRoute](./src/app/components/ProtectedRoute.tsx)

---

### 🐛 **Tengo un problema**

1. Revisa [JWT_DOCUMENTATION.md](./JWT_DOCUMENTATION.md#troubleshooting) - Troubleshooting JWT
2. Consulta [DOCKER.md](./DOCKER.md#troubleshooting) - Troubleshooting Docker
3. Verifica [.env.example](./.env.example) - Variables configuradas
4. Revisa logs con `pnpm run docker:logs`

---

## 📊 MATRIZ DE DOCUMENTACIÓN

| Necesito... | Documento | Sección |
|-------------|-----------|---------|
| **Instalar el proyecto** | [README.md](./README.md) | Inicio Rápido |
| **Ejecutar con Docker** | [DOCKER.md](./DOCKER.md) | Comandos Básicos |
| **Hacer login** | [JWT_QUICKSTART.md](./JWT_QUICKSTART.md) | Credenciales |
| **Entender JWT** | [JWT_DOCUMENTATION.md](./JWT_DOCUMENTATION.md) | Introducción |
| **Generar tokens** | [JWT_DOCUMENTATION.md](./JWT_DOCUMENTATION.md) | Utilidades JWT |
| **Proteger rutas** | [JWT_DOCUMENTATION.md](./JWT_DOCUMENTATION.md) | Componentes |
| **Configurar variables** | [.env.example](./.env.example) | Todo el archivo |
| **Ver usuarios** | [variables-sistema.js](./variables-sistema.js) | MOCK_USERS |
| **Ver servicios** | [variables-sistema.js](./variables-sistema.js) | SERVICES |
| **Ver sucursales** | [variables-sistema.js](./variables-sistema.js) | WORK_CENTERS |
| **Configurar tema** | [variables-sistema.js](./variables-sistema.js) | THEME_COLORS |
| **Desplegar producción** | [DOCKER.md](./DOCKER.md) | Despliegue |
| **Solucionar errores** | Cada documento | Troubleshooting |

---

## 🔑 CREDENCIALES DE PRUEBA

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | admin@dentalwhite.com | admin123 |
| **Recepción** | recepcion@dentalwhite.com | recep123 |
| **Doctor** | doctor@dentalwhite.com | doctor123 |
| **Paciente** | paciente@example.com | paciente123 |

---

## 📁 ARCHIVOS POR CATEGORÍA

### **Documentación General**
- `README.md` - Visión general
- `DOCUMENTATION_INDEX.md` - Este archivo
- `ATTRIBUTIONS.md` - Créditos y licencias

### **Autenticación**
- `JWT_DOCUMENTATION.md` - Documentación completa
- `JWT_QUICKSTART.md` - Guía rápida

### **Infraestructura**
- `DOCKER.md` - Docker y despliegue

### **Configuración**
- `VARIABLES_DEL_SISTEMA.md` - Variables del sistema
- `variables-sistema.json` - Variables (JSON)
- `variables-sistema.js` - Variables (JavaScript)
- `.env.example` - Plantilla de entorno

### **Código Fuente**
- `/src/app/` - Código de la aplicación
- `/src/styles/` - Estilos globales

### **Docker**
- `Dockerfile` - Imagen producción
- `Dockerfile.dev` - Imagen desarrollo
- `docker-compose.yml` - Compose producción
- `docker-compose.dev.yml` - Compose desarrollo
- `nginx.conf` - Configuración Nginx

---

## 🎯 RUTAS RÁPIDAS

### **Para Desarrolladores**
```bash
# Ver código fuente
/src/app/

# Ver componentes
/src/app/components/

# Ver dashboards
/src/app/components/dashboards/

# Ver utilidades JWT
/src/app/utils/jwt.ts

# Ver AuthContext
/src/app/context/AuthContext.tsx
```

### **Para DevOps**
```bash
# Ver Dockerfiles
/Dockerfile
/Dockerfile.dev

# Ver Docker Compose
/docker-compose.yml
/docker-compose.dev.yml

# Ver Nginx
/nginx.conf

# Ver variables de entorno
/.env.example
```

### **Para Configuración**
```bash
# Variables del sistema
/variables-sistema.js
/variables-sistema.json

# Variables de entorno
/.env.example

# Tema y estilos
/src/styles/theme.css
```

---

## 📞 SOPORTE

Si no encuentras lo que buscas:

1. **Busca** en este índice
2. **Revisa** la sección de troubleshooting
3. **Consulta** los ejemplos de código
4. **Contacta** a contacto@dentalwhite.com

---

## ✅ CHECKLIST DE LECTURA

Para un entendimiento completo del sistema, lee en este orden:

- [ ] `README.md` - Visión general (10 min)
- [ ] `JWT_QUICKSTART.md` - JWT rápido (5 min)
- [ ] `DOCKER.md` - Sección "Inicio Rápido" (5 min)
- [ ] Prueba el sistema con Docker
- [ ] Haz login con credenciales de prueba
- [ ] `JWT_DOCUMENTATION.md` - JWT completo (30 min)
- [ ] `VARIABLES_DEL_SISTEMA.md` - Variables (15 min)
- [ ] Explora el código en `/src/app/`
- [ ] Lee `DOCKER.md` completo (20 min)
- [ ] Revisa `.env.example` para configuración

**Tiempo total estimado:** ~1.5 horas

---

## 🔄 ACTUALIZACIONES

Este índice se actualiza cada vez que:
- Se agrega nueva documentación
- Se actualiza funcionalidad importante
- Se agregan nuevas secciones
- Se detectan errores o mejoras

**Última actualización:** 25 de febrero de 2026  
**Versión del sistema:** 0.0.1

---

## 🎉 ¡LISTO!

Ahora tienes una visión completa de toda la documentación disponible.

**Próximo paso sugerido:**
1. Lee [README.md](./README.md)
2. Ejecuta `pnpm run docker:dev`
3. Prueba login en `http://localhost:5173`

---

<div align="center">

**📚 Documentación completa y actualizada 📚**

Hecho con ❤️ para Dental White

</div>
