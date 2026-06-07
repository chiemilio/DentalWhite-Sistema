#!/bin/bash
set -e

echo "=== Dental White - Entrypoint ==="
echo "Environment: $ENVIRONMENT"

# Esperar a que PostgreSQL esté disponible
if [ -n "$DATABASE_URL" ]; then
    echo "Waiting for database..."
    python -c "
import time, re
m = re.search(r'@([^:]+)', '$DATABASE_URL')
host = m.group(1) if m else 'localhost'
print(f'Database host: {host}')
"
    # Try to connect for up to 60 seconds
    for i in $(seq 1 30); do
        if python -c "
from sqlalchemy import create_engine
try:
    engine = create_engine('$DATABASE_URL')
    conn = engine.connect()
    conn.close()
    print('Database is ready!')
    exit(0)
except Exception as e:
    print(f'Attempt $i: {e}')
    exit(1)
" 2>/dev/null; then
            break
        fi
        sleep 2
    done
fi

# Ejecutar migraciones
echo "Running database migrations..."
alembic upgrade head

# Seed datos iniciales (idempotente)
echo "Seeding initial data..."
python seed_catalogs.py || echo "Seed catalogs skipped or already done"
python seed_users.py || echo "Seed users skipped or already done"
python seed_horarios.py || echo "Seed horarios skipped or already done"

# Iniciar servidor
echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
