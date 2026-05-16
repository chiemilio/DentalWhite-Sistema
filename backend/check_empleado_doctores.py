#!/usr/bin/env python3
from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print('=== VERIFICAR QUE EMPLEADO_ID EN CITAS SEA DOCTOR ===')
print()

# Citas con empleado_id
result = db.execute(text('''
    SELECT c.id, c.empleado_id, e.puesto, e.usuario_id
    FROM citas c
    LEFT JOIN empleados e ON c.empleado_id = e.id
    LIMIT 10
''')).fetchall()

print('Citas (primeros 10):')
for r in result:
    print(f'  cita_id={r[0]}, empleado_id={r[1]}, puesto={r[2]}, usuario_id={r[3]}')

print()
print('Empleados que NO son doctores:')
result = db.execute(text("SELECT id, usuario_id, puesto FROM empleados WHERE puesto NOT LIKE '%doctor%'")).fetchall()
for r in result:
    print(f'  id={r[0]}, usuario_id={r[1]}, puesto={r[2]}')

print()
print('Empleados doctores:')
result = db.execute(text("SELECT id, usuario_id, puesto FROM empleados WHERE puesto LIKE '%doctor%'")).fetchall()
for r in result:
    print(f'  id={r[0]}, usuario_id={r[1]}, puesto={r[2]}')

db.close()