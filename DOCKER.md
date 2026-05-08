# 🐳 GUÍA DE DOCKER - DENTAL WHITE

Documentación completa para ejecutar el sistema Dental White con Docker.

---

## 📋 TABLA DE CONTENIDO

1. [Prerequisitos](#prerequisitos)
2. [Archivos de Configuración](#archivos-de-configuración)
3. [Comandos Básicos](#comandos-básicos)
4. [Modo Desarrollo](#modo-desarrollo)
5. [Modo Producción](#modo-producción)
6. [Variables de Entorno](#variables-de-entorno)
7. [Autenticación JWT](#autenticación-jwt)
8. [Troubleshooting](#troubleshooting)

---

## ✅ PREREQUISITOS

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Git** (opcional, para clonar el repositorio)

### Verificar instalación:

```bash
docker --version
docker-compose --version
```

---

## 📁 ARCHIVOS DE CONFIGURACIÓN

El proyecto incluye los siguientes archivos Docker:

```
dental-white/
├── Dockerfile                  # Imagen de producción
├── Dockerfile.dev             # Imagen de desarrollo
├── docker-compose.yml         # Orquestación para producción
├── docker-compose.dev.yml     # Orquestación para desarrollo
├── .dockerignore              # Archivos excluidos de la imagen
├── nginx.conf                 # Configuración de Nginx
├── .env.example               # Plantilla de variables de entorno
└── package.json               # Scripts NPM para Docker
```

**Archivos de Documentación:**
- `DOCKER.md` - Esta guía
- `JWT_DOCUMENTATION.md` - Documentación completa de JWT
- `JWT_QUICKSTART.md` - Guía rápida de JWT
- `VARIABLES_DEL_SISTEMA.md` - Variables del sistema

---

## 🚀 COMANDOS BÁSICOS

### Scripts NPM disponibles:

```bash
# Construir imagen Docker
pnpm run docker:build

# Ejecutar contenedor directamente
pnpm run docker:run

# Levantar con Docker Compose (producción)
pnpm run docker:up

# Detener contenedores
pnpm run docker:down

# Modo desarrollo con hot reload
pnpm run docker:dev

# Ver logs en tiempo real
pnpm run docker:logs
```

---

## 💻 MODO DESARROLLO

### Opción 1: Usar script NPM (recomendado)

```bash
pnpm run docker:dev
```

### Opción 2: Comando directo

```bash
docker-compose -f docker-compose.dev.yml up
```

### Características del modo desarrollo:

- ✅ **Hot Reload** - Los cambios en el código se reflejan automáticamente
- ✅ **Volúmenes montados** - Tu código local sincronizado con el contenedor
- ✅ **Puerto 5173** - Acceso vía `http://localhost:5173`
- ✅ **Node Modules** - Aislados en volumen separado para mejor rendimiento

### Detener modo desarrollo:

```bash
# Con Ctrl+C o:
docker-compose -f docker-compose.dev.yml down
```

---

## 🏭 MODO PRODUCCIÓN

### Opción 1: Docker Compose (recomendado)

```bash
# Levantar en background
pnpm run docker:up

# O manualmente:
docker-compose up -d
```

### Opción 2: Docker directo

```bash
# Construir imagen
pnpm run docker:build

# O manualmente:
docker build -t dental-white:latest .

# Ejecutar contenedor
pnpm run docker:run

# O manualmente:
docker run -d -p 3000:80 --name dental-white dental-white:latest
```

### Características del modo producción:

- ✅ **Build optimizado** - Código minificado y optimizado
- ✅ **Nginx** - Servidor web de alto rendimiento
- ✅ **Caché de assets** - Assets estáticos con cache de 1 año
- ✅ **Compresión Gzip** - Respuestas comprimidas
- ✅ **Health checks** - Monitoreo automático del contenedor
- ✅ **Puerto 3000** - Acceso vía `http://localhost:3000`

### Acceder a la aplicación:

```
http://localhost:3000
```

### Ver logs:

```bash
# Con NPM script
pnpm run docker:logs

# O manualmente
docker-compose logs -f dental-white-app
```

### Detener y eliminar:

```bash
# Detener
pnpm run docker:down

# Detener y eliminar volúmenes
docker-compose down -v
```

---

## 🗄️ BASE DE DATOS (Opcional)

El archivo `docker-compose.yml` incluye configuración comentada para PostgreSQL.

### Para habilitar la base de datos:

1. Descomentar las secciones en `docker-compose.yml`:
   - `dental-white-db`
   - `adminer` (opcional - administrador web)

2. Levantar los servicios:

```bash
docker-compose up -d
```

### Acceder a la base de datos:

```
Host: localhost
Puerto: 5432
Database: dental_white
Usuario: dental_admin
Password: dental_secure_password_123
```

### Acceder a Adminer (administrador web):

```
http://localhost:8080
```

---

## 🔐 AUTENTICACIÓN JWT

El sistema Dental White incluye autenticación JWT (JSON Web Tokens) completamente implementada.

### Variables de Entorno JWT

Crear archivo `.env` con las siguientes variables:

```bash
# JWT Configuration
VITE_JWT_SECRET=dental-white-super-secret-key-2026
VITE_JWT_EXPIRATION=24h
VITE_JWT_REFRESH_BEFORE=300
VITE_JWT_ISSUER=dental-white-system
VITE_JWT_AUDIENCE=dental-white-users
```

### Generar Secret Seguro para Producción

```bash
# Generar una clave secreta segura
openssl rand -base64 32

# Usar en .env
VITE_JWT_SECRET=tu_clave_generada_aqui
```

### Credenciales de Prueba

El sistema incluye usuarios de prueba:

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | admin@dentalwhite.com | admin123 |
| **Recepción** | recepcion@dentalwhite.com | recep123 |
| **Doctor** | doctor@dentalwhite.com | doctor123 |
| **Paciente** | paciente@example.com | paciente123 |

### Verificar JWT en Docker

```bash
# Acceder al contenedor
docker exec -it dental-white-frontend sh

# Ver localStorage (en navegador)
# Abrir DevTools > Console
localStorage.getItem('dental_white_token')

# Decodificar token
const token = localStorage.getItem('dental_white_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

### Documentación JWT

Para más información sobre JWT:
- Ver `JWT_DOCUMENTATION.md` - Documentación completa
- Ver `JWT_QUICKSTART.md` - Guía rápida de inicio

---

## 🔧 VARIABLES DE ENTORNO

### Crear archivo `.env`:

```bash
# Archivo: .env
NODE_ENV=production
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Dental White
VITE_APP_VERSION=0.0.1

# Database (si usas PostgreSQL)
POSTGRES_DB=dental_white
POSTGRES_USER=dental_admin
POSTGRES_PASSWORD=dental_secure_password_123
```

### Usar en Docker Compose:

```yaml
services:
  dental-white-app:
    env_file:
      - .env
```

---

## 📊 ESTRUCTURA DE LA IMAGEN

### Stages del Dockerfile de producción:

```
1. BASE
   └─ Node 20 Alpine + pnpm

2. DEPS
   └─ Instalación de dependencias

3. BUILDER
   └─ Build de la aplicación (vite build)

4. RUNNER
   └─ Nginx Alpine + archivos compilados
```

### Tamaño de imagen optimizado:

- **Imagen final**: ~25-30 MB (solo Nginx + build)
- **Multi-stage build**: Descarta dependencias de desarrollo
- **Alpine Linux**: Imagen base mínima

---

## 🔍 COMANDOS ÚTILES

### Inspeccionar contenedores:

```bash
# Listar contenedores activos
docker ps

# Listar todos los contenedores
docker ps -a

# Inspeccionar contenedor
docker inspect dental-white-frontend
```

### Acceder a un contenedor:

```bash
# Shell interactivo
docker exec -it dental-white-frontend sh

# Ver logs en tiempo real
docker logs -f dental-white-frontend
```

### Gestión de imágenes:

```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi dental-white:latest

# Limpiar imágenes sin usar
docker image prune -a
```

### Gestión de volúmenes:

```bash
# Listar volúmenes
docker volume ls

# Eliminar volumen específico
docker volume rm dental-white-db-data

# Limpiar volúmenes sin usar
docker volume prune
```

---

## 🩺 HEALTH CHECKS

### Verificar estado del contenedor:

```bash
docker ps
```

Busca la columna **STATUS**:
- `Up X minutes (healthy)` ✅ - Todo bien
- `Up X minutes (unhealthy)` ❌ - Hay problemas

### Endpoint de health check:

```bash
curl http://localhost:3000/health
# Respuesta esperada: "healthy"
```

---

## 🐛 TROUBLESHOOTING

### Problema: Puerto ya en uso

```bash
# Error: "port is already allocated"

# Solución 1: Cambiar puerto en docker-compose.yml
ports:
  - "3001:80"  # Cambiar 3000 por otro puerto

# Solución 2: Detener proceso que usa el puerto
# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Problema: Build falla

```bash
# Limpiar caché de Docker
docker builder prune

# Rebuild sin caché
docker-compose build --no-cache
```

### Problema: Cambios no se reflejan (desarrollo)

```bash
# Reiniciar contenedor de desarrollo
docker-compose -f docker-compose.dev.yml restart

# Reconstruir completamente
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

### Problema: Contenedor se detiene inmediatamente

```bash
# Ver logs de error
docker logs dental-white-frontend

# Ejecutar en modo interactivo para debug
docker run -it dental-white:latest sh
```

### Problema: Permisos en Linux

```bash
# Si hay errores de permisos, agregar usuario a grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar
```

---

## 🔒 SEGURIDAD

### Recomendaciones para producción:

1. **Cambiar contraseñas por defecto**
   ```bash
   # Usar variables de entorno o secrets
   POSTGRES_PASSWORD=${SECURE_PASSWORD}
   ```

2. **Usar HTTPS**
   ```nginx
   # Configurar SSL en nginx.conf
   server {
       listen 443 ssl;
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
   }
   ```

3. **Limitar recursos**
   ```yaml
   # En docker-compose.yml
   services:
     dental-white-app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

4. **No exponer puertos innecesarios**
   ```yaml
   # Solo exponer lo necesario
   # Comentar adminer y postgres si no se usan
   ```

---

## 📈 MONITOREO Y LOGS

### Ver logs en tiempo real:

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f dental-white-app

# Últimas 100 líneas
docker-compose logs --tail=100 dental-white-app
```

### Estadísticas de recursos:

```bash
# Ver uso de CPU, memoria, red
docker stats dental-white-frontend
```

---

## 🚀 DESPLIEGUE EN PRODUCCIÓN

### Opciones de hosting:

1. **AWS ECS/Fargate**
2. **Google Cloud Run**
3. **Azure Container Instances**
4. **DigitalOcean App Platform**
5. **Heroku Container Registry**
6. **Servidor VPS con Docker**

### Ejemplo: Push a Docker Hub

```bash
# Login
docker login

# Tag de imagen
docker tag dental-white:latest username/dental-white:0.0.1

# Push
docker push username/dental-white:0.0.1
```

### Ejemplo: Deploy en servidor VPS

```bash
# En el servidor
git clone <repository>
cd dental-white
docker-compose up -d

# Actualizar
git pull
docker-compose down
docker-compose up -d --build
```

---

## 📞 SOPORTE

Para problemas o preguntas:

- **Email**: contacto@dentalwhite.com
- **Documentación**: Ver `VARIABLES_DEL_SISTEMA.md`
- **GitHub Issues**: (si aplica)

---

## 📝 COMANDOS RÁPIDOS

```bash
# DESARROLLO
pnpm run docker:dev          # Iniciar desarrollo
Ctrl+C                       # Detener

# PRODUCCIÓN
pnpm run docker:up           # Iniciar producción
pnpm run docker:down         # Detener
pnpm run docker:logs         # Ver logs

# LIMPIEZA
docker system prune -a       # Limpiar todo Docker
docker-compose down -v       # Eliminar contenedores y volúmenes
```

---

**Versión del documento:** 1.0  
**Última actualización:** 25 de febrero de 2026  
**Sistema:** Dental White v0.0.1