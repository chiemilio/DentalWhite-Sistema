#!/usr/bin/env python3
from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print('=== TODAS LAS TABLAS ===')
result = db.execute(text("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
""")).fetchall()

for r in result:
    print(f'  {r[0]}')

db.close()