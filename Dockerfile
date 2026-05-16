# Dockerfile para Dental White

# Imagen base con Node.js v22
FROM node:22-alpine AS base

# Instalar pnpm (versión compatible con Node 22)
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# ========================================
# STAGE 1: Dependencias
# ========================================
FROM base AS deps

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# ========================================
# STAGE 2: Builder
# ========================================
FROM base AS builder

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN pnpm run build

# ========================================
# STAGE 3: Runner (Producción)
# ========================================
FROM nginx:alpine AS runner

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]