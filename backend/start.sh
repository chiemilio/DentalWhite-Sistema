#!/bin/bash
set -e

cd backend

# Ensure tables exist (Base.metadata.create_all runs at import)
echo "Starting backend..."

# Seed users and catalogs (idempotent - skips existing)
python seed_users.py
python seed_horarios.py

# Start server
uvicorn app.main:app --host 0.0.0.0 --port $PORT
