#!/usr/bin/env python3
"""
Corregir empleado_id: primero cambiar citas, luego empleado
"""
import sys
sys.path.insert(0, '/home/dragon3030/Sistema_Gestion_original/backend')

from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    print("=" * 60)
    print("CORRECCIÓN: empleado 4 -> 8")
    print("=" * 60)

    # 1. Verificar empleado 4 tiene usuario_id=8
    result = db.execute(text("SELECT id, usuario_id, puesto FROM empleados WHERE id = 4")).fetchone()
    if result:
        print(f"\n1. Empleado 4: id={result[0]}, usuario_id={result[1]}, puesto={result[2]}")
    
    # 2. Primero actualizar TODAS las citas de empleado_id=4 a 8
    print("\n2. Actualizando citas (4 -> 8)...")
    db.execute(text("UPDATE citas SET empleado_id = 8 WHERE empleado_id = 4"))
    db.commit()
    print("   Citas actualizadas")

    # 3. Ahora actualizar el empleado
    print("\n3. Actualizando empleado (4 -> 8)...")
    db.execute(text("UPDATE empleados SET id = 8 WHERE id = 4"))
    db.commit()
    print("   Empleado actualizado")

    # 4. Verificar
    print("\n4. VERIFICACIÓN:")
    emp = db.execute(text("SELECT id, usuario_id, puesto FROM empleados WHERE id = 8")).fetchone()
    if emp:
        print(f"   Empleado 8: usuario_id={emp[1]}, puesto={emp[2]}")
    
    citas = db.execute(text("SELECT COUNT(*) FROM citas WHERE empleado_id = 8")).fetchone()
    print(f"   Citas con empleado_id=8: {citas[0]}")

    # Citas de hoy confirmadas
    from datetime import date
    today = date.today()
    citas_hoy = db.execute(text(f"""
        SELECT id, fecha, hora FROM citas 
        WHERE empleado_id = 8 AND fecha = '{today}' AND estado_cita_id = 2
    """)).fetchall()
    print(f"   Citas HOY confirmadas: {len(citas_hoy)}")
    for c in citas_hoy:
        print(f"      - ID={c[0]}, {c[1]} {c[2]}")

    print("\n" + "=" * 60)
    print("LISTO: Doctor tiene usuario_id=8 y empleado_id=8")
    print("=" * 60)

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()