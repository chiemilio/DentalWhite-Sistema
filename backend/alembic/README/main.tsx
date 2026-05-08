# Alembic Database Migrations

Este directorio contiene las migraciones de base de datos para Dental White.

## Comandos útiles

### Crear una nueva migración automática
```bash
alembic revision --autogenerate -m "Descripción del cambio"
```

### Aplicar migraciones
```bash
# Aplicar todas las migraciones pendientes
alembic upgrade head

# Aplicar hasta una revisión específica
alembic upgrade <revision>

# Aplicar una migración a la vez
alembic upgrade +1
```

### Revertir migraciones
```bash
# Revertir la última migración
alembic downgrade -1

# Revertir hasta una revisión específica
alembic downgrade <revision>

# Revertir todas las migraciones
alembic downgrade base
```

### Ver historial
```bash
# Ver historial de migraciones
alembic history

# Ver migración actual
alembic current

# Ver migraciones pendientes
alembic show head
```

## Estructura de migraciones

Las migraciones se generan automáticamente comparando los modelos de SQLAlchemy con el esquema actual de la base de datos.

Cada migración contiene:
- `upgrade()`: Función para aplicar los cambios
- `downgrade()`: Función para revertir los cambios
