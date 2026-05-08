"""Check cat_servicios for prices"""
from app.database import SessionLocal
from sqlalchemy import inspect

db = SessionLocal()
inspector = inspect(db.bind)

print("=== CAMPOS EN cat_servicios ===")
columns = inspector.get_columns("cat_servicios")
for c in columns:
    print(f"  {c['name']}: {c['type']}")

db.close()