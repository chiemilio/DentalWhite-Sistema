# 🦷 DENTAL WHITE - Sistema de Gestión Dental v3.0

## ⚡ INICIO RÁPIDO - ¿Cuál Stack Elegir?

Este proyecto tiene **DOS opciones de arquitectura** completamente documentadas:

---

## 🅰️ OPCIÓN A: Monolítico (Python/FastAPI) ⭐ RECOMENDADO

**Stack:** Python 3.12 + FastAPI + PostgreSQL 17 + Alpine.js + Tailwind CSS 4

### ✅ Ideal para:
- ✅ Startups y clínicas pequeñas-medianas (1-5 sucursales)
- ✅ Presupuesto limitado ($30/mes en producción)
- ✅ Equipo pequeño (1-3 desarrolladores)
- ✅ Necesidad de lanzar rápido (2-3 meses)
- ✅ Usuarios concurrentes < 500

### 📊 Características:
- **Costo:** ~$30/mes en producción
- **Tiempo desarrollo:** 8-12 semanas
- **Complejidad:** Baja
- **Performance:** Excelente (sin overhead de red)
- **Deployment:** Simple (Docker Compose en 1 VPS)

### 📚 Documentación:
- **[STACK_FINAL.md](./STACK_FINAL.md)** ← EMPEZAR AQUÍ
- **[DECISION_STACK.md](./DECISION_STACK.md)** ← Comparación completa

### 🚀 Quick Start:
```bash
# 1. Clonar repositorio
git clone <repo-url> dental-white
cd dental-white

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar con Docker Compose
docker compose up -d

# 4. Acceder
# Frontend: http://localhost
# Backend API: http://localhost/api/docs (Swagger)
# pgAdmin: http://localhost:5050
```

---

## 🅱️ OPCIÓN B: Microservicios (Node.js/TypeScript)

**Stack:** Node.js 22 + TypeScript + Fastify + Prisma + Next.js 15 + Kubernetes

### ⚠️ Ideal para:
- ⚠️ Empresas grandes (10+ sucursales, multi-nacional)
- ⚠️ Presupuesto holgado ($500+/mes en infraestructura)
- ⚠️ Equipo grande (5-10+ desarrolladores + DevOps)
- ⚠️ Escalabilidad horizontal ilimitada
- ⚠️ Usuarios concurrentes > 1000

### 📊 Características:
- **Costo:** ~$420/mes en producción
- **Tiempo desarrollo:** 24-36 semanas
- **Complejidad:** Muy alta
- **Performance:** Bueno (con latencia entre servicios)
- **Deployment:** Complejo (Kubernetes + Helm)

### 📚 Documentación:
- **[MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)**
- **[MICROSERVICES_SETUP.md](./MICROSERVICES_SETUP.md)**
- **[QUICK_START.md](./QUICK_START.md)**
- **[services/auth-service/](./services/auth-service/)** ← Auth Service YA implementado

### 🚀 Quick Start:
```bash
# Levantar infraestructura completa
docker compose -f docker-compose-microservices.yml up -d

# Verificar servicios
curl http://localhost:3001/api/v1/auth/health

# Acceder
# Auth Service: http://localhost:3001
# RabbitMQ: http://localhost:15672
# Grafana: http://localhost:4000
# Jaeger: http://localhost:16686
```

**Estado:** Auth Service implementado ✅ | 10 servicios pendientes ⏳

---

## 📊 COMPARACIÓN RÁPIDA

| Aspecto | Opción A: Monolítico | Opción B: Microservicios |
|---------|---------------------|---------------------------|
| **Costo/mes** | $30 | $420 |
| **Tiempo dev** | 2-3 meses | 6-9 meses |
| **Complejidad** | ⭐ Baja | ⭐⭐⭐⭐⭐ Muy Alta |
| **Team size** | 1-3 devs | 5-10+ devs |
| **Deployment** | 1 comando | Complejo (K8s) |
| **Escalabilidad** | Vertical (hasta ~500 users) | Horizontal (ilimitada) |
| **Mantenimiento** | Fácil | Complejo |

### 🎯 RECOMENDACIÓN

Para **Dental White** (3 sucursales, ~50 usuarios, presupuesto limitado):

👉 **Opción A - Monolítico** es la elección correcta

**Razones:**
- ✅ ROI 10x mejor ($10K vs $100K en año 1)
- ✅ Lanzamiento en 3 meses vs 9 meses
- ✅ Mantenimiento por equipo pequeño
- ✅ Performance más que suficiente
- ✅ Siempre se puede migrar a microservicios en el futuro

---

## 📚 DOCUMENTACIÓN COMPLETA

### Para Opción A (Monolítico) - RECOMENDADO

1. **[STACK_FINAL.md](./STACK_FINAL.md)** - Stack tecnológico completo
2. **[DECISION_STACK.md](./DECISION_STACK.md)** - Comparación y decisión
3. **[database/ESTRUCTURA_COMPLETA.md](./database/ESTRUCTURA_COMPLETA.md)** - Base de datos
4. **[RESPONSIVE_GUIDE.md](./RESPONSIVE_GUIDE.md)** - Diseño responsive

### Para Opción B (Microservicios)

1. **[MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)** - Arquitectura
2. **[MICROSERVICES_SETUP.md](./MICROSERVICES_SETUP.md)** - Setup
3. **[QUICK_START.md](./QUICK_START.md)** - Inicio rápido
4. **[services/auth-service/README.md](./services/auth-service/README.md)** - Auth Service

### Documentación General

- **[README_V3.md](./README_V3.md)** - Versión 3.0 detallada
- **[CATALOGOS_Y_STACK.md](./CATALOGOS_Y_STACK.md)** - Catálogos de BD
- **[CHANGELOG_V3.md](./CHANGELOG_V3.md)** - Changelog completo
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Índice completo

---

## 🎬 SIGUIENTE PASO

### Si eliges Opción A (Monolítico):

```bash
# 1. Leer documentación
cat STACK_FINAL.md

# 2. Configurar entorno
cp .env.example .env

# 3. Levantar servicios
docker compose up -d

# 4. Empezar a desarrollar backend FastAPI
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Si eliges Opción B (Microservicios):

```bash
# 1. Leer documentación
cat QUICK_START.md

# 2. Configurar entorno
cp .env.microservices.example .env

# 3. Levantar toda la infraestructura
docker compose -f docker-compose-microservices.yml up -d

# 4. Verificar auth service
curl http://localhost:3001/api/v1/auth/health

# 5. Explorar código del auth service
cd services/auth-service
cat README.md
```

---

## 💡 ¿Necesitas Ayuda para Decidir?

Lee **[DECISION_STACK.md](./DECISION_STACK.md)** para un análisis completo que incluye:

- ✅ Comparación detallada de 20 criterios
- ✅ Análisis de costo total (año 1 y operativo)
- ✅ Recomendación por contexto de negocio
- ✅ Plan de migración gradual (si decides cambiar en el futuro)
- ✅ Caso de uso específico para Dental White

---

## 📞 CONTACTO Y SOPORTE

**Proyecto:** Dental White - Sistema de Gestión Dental  
**Versión:** 3.0.0  
**Fecha:** Abril 2026  
**Opciones:** 2 stacks tecnológicos completamente documentados  

**Doctor:** Dr. Faustino Vázquez Rodríguez  
**Sucursales:** Pénjamo, Valle de Santiago, Abasolo (Guanajuato, México)  

---

## 📄 LICENCIA

© 2026 Dental White - Todos los derechos reservados

---

<div align="center">

**🚀 ¡Comienza con Opción A (Monolítico) para un lanzamiento rápido y económico! 🚀**

Lee [STACK_FINAL.md](./STACK_FINAL.md) para empezar

</div>
