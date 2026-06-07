#!/bin/bash
set -e

# ============================================
# Dental White - Despliegue en Ubuntu Server
# ============================================
# Requisitos: docker, docker compose, git
# Uso: bash deploy-ubuntu.sh

echo "=== Dental White - Deploy Ubuntu ==="

# 1. Verificar requisitos
command -v docker >/dev/null 2>&1 || { echo "Error: docker no instalado"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Error: git no instalado"; exit 1; }

# 2. Variables
SERVER_DOMAIN="${SERVER_DOMAIN:-localhost}"
VITE_API_URL="${VITE_API_URL:-/api/v1}"

# 3. Construir frontend
echo "Construyendo frontend..."
npm install
VITE_API_URL=$VITE_API_URL npm run build

# 4. Crear .env desde .env.example si no existe
if [ ! -f .env ]; then
    echo "Creando .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  Edita .env con tus valores antes de continuar"
    echo "   Especialmente DATABASE_URL, SECRET_KEY y CORS_ORIGINS"
    exit 1
fi

# 5. Iniciar servicios
echo "Iniciando servicios con docker compose..."
docker compose up -d --build

# 6. Verificar estado
echo "Verificando servicios..."
sleep 5
docker compose ps

echo ""
echo "=== Despliegue completado ==="
echo "Frontend: http://$SERVER_DOMAIN"
echo "Backend API: http://$SERVER_DOMAIN/api/v1"
echo "Health: http://$SERVER_DOMAIN/health"
echo ""
echo "Para ver logs: docker compose logs -f"
echo "Para detener: docker compose down"
