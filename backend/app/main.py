"""
FastAPI Application - Dental White
Sistema de Gestión para Clínica Dental
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base
from app.api.v1 import api_router

# Crear tablas en base de datos
Base.metadata.create_all(bind=engine)

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST para sistema de gestión de clínica dental",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    redirect_slashes=False
)

# CORS desde settings (lee env var CORS_ORIGINS con fallback a defaults)
cors_origins = settings.cors_origins_list
# Siempre incluir el dominio de Vercel (fallback por si env var está mal)
vercel_url = "https://deltawhitetest.vercel.app"
if vercel_url not in cors_origins:
    cors_origins.append(vercel_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint - Verifica que la API esté funcionando
    """
    return JSONResponse(
        content={
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": "1.0.0"
        },
        status_code=200
    )


@app.get("/", tags=["Root"])
def root():
    """
    Root endpoint - Información básica de la API
    """
    return JSONResponse(
        content={
            "message": f"Bienvenido a {settings.PROJECT_NAME} API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health"
        },
        status_code=200
    )


# Incluir routers de API v1
app.include_router(api_router)


# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        content={"detail": "Recurso no encontrado"},
        status_code=404
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        content={"detail": "Error interno del servidor"},
        status_code=500
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )
