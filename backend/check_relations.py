#!/usr/bin/env python3
from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print('=== RELACIONES DE TABLAS ===')
print()

# Tabla empleados
print('EMPLEADOS:')
result = db.execute(text('SELECT id, usuario_id, puesto FROM empleados ORDER BY id')).fetchall()
for r in result:
    print(f'  id={r[0]}, usuario_id={r[1]}, puesto={r[2]}')

print()
print('CITAS (muestra las primeras 5):')
result = db.execute(text('SELECT id, paciente_id, empleado_id, servicio_id, sucursal_id, estado_cita_id FROM citas LIMIT 5')).fetchall()
for r in result:
    print(f'  id={r[0]}, paciente_id={r[1]}, empleado_id={r[2]}, servicio_id={r[3]}, sucursal_id={r[4]}, estado={r[5]}')

print()
print('SERVICIOS:')
result = db.execute(text('SELECT id, nombre FROM cat_servicios')).fetchall()
for r in result:
    print(f'  id={r[0]}, nombre={r[1]}')

print()
print('SUCURSALES:')
result = db.execute(text('SELECT id, nombre FROM cat_sucursales')).fetchall()
for r in result:
    print(f'  id={r[0]}, nombre={r[1]}')

print()
print('PACIENTES (muestra los primeros 3):')
result = db.execute(text('SELECT id, usuario_id FROM pacientes LIMIT 3')).fetchall()
for r in result:
    print(f'  id={r[0]}, usuario_id={r[1]}')

db.close()