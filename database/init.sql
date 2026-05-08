-- Script de inicialización de base de datos para Dental White
-- PostgreSQL 17+

-- Este script se ejecuta automáticamente al crear el contenedor de PostgreSQL
-- Solo si la base de datos no existe

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para búsquedas de texto

-- Crear índices adicionales después de que Alembic cree las tablas
-- (Este script se ejecuta antes que Alembic, por lo que los índices se crean después)

-- Nota: La estructura de tablas se crea mediante Alembic migrations
-- Este archivo solo contiene configuraciones iniciales y extensiones

-- Configurar timezone
SET timezone = 'America/Mexico_City';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos dental_white inicializada correctamente';
END $$;
