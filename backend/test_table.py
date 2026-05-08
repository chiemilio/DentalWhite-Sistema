"""Verify pagos table"""
from app.database import SessionLocal
from sqlalchemy import inspect

db = SessionLocal()
inspector = inspect(db.bind)

print("=== TABLA PAGOS ===")
columns = inspector.get_columns("pagos")
for c in columns:
    print(f"  {c['name']}: {c['type']}")

db.close()