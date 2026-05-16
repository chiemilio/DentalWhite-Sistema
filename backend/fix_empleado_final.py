#!/usr/bin/env python3
"""
Corregir empleado_id: cambiar id=4 a id=8 para coincidir con usuario_id del doctor
"""
import sys
sys.path.insert(0, '/home/dragon3030/Sistema_Gestion_original/backend')

from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    print("=" * 60)
    print("CORRECCIÓN: cambiar empleado id=4 a id=8")
    print("=" * 60)

    # 1. Ver empleados actuales
    print("\n1. Empleados actuales:")
    emps = db.execute(text("SELECT id, usuario_id, puesto FROM empleados ORDER BY id")).fetchall()
    for e in emps:
        print(f"   id={e[0]}, usuario_id={e[1]}, puesto={e[2]}")

    # 2. Verificar empleado 4 tiene usuario_id=8
    emp4 = db.execute(text("SELECT id, usuario_id FROM empleados WHERE id = 4")).fetchone()
    if not emp4:
        print("\nERROR: No existe empleado con id=4")
        exit(1)
    print(f"\n2. Empleado 4: id={emp4[0]}, usuario_id={emp4[1]}")

    # 3. Verificar citas del empleado 4
    citas_4 = db.execute(text("SELECT COUNT(*) FROM citas WHERE empleado_id = 4")).fetchone()
    print(f"\n3. Citas del empleado 4: {citas_4[0]}")

    if citas_4[0] > 0 and emp4[1] == 8:
        # Cambiar el id del empleado 4 a 8
        print("\n4. Cambiando id=4 a id=8...")
        db.execute(text("UPDATE empleados SET id = 8 WHERE id = 4"))
        db.commit()
        print("   Empleado actualizado")
    else:
        print("\n4. No se puede cambiar (verificar datos)")

    # 5. Verificar
    print("\n5. VERIFICACIÓN:")
    emp8 = db.execute(text("SELECT id, usuario_id, puesto FROM empleados WHERE id = 8")).fetchone()
    if emp8:
        print(f"   Empleado 8: id={emp8[0]}, usuario_id={emp8[1]}, puesto={emp8[2]}")
    
    citas_8 = db.execute(text("SELECT COUNT(*) FROM citas WHERE empleado_id = 8")).fetchone()
    print(f"   Citas con empleado_id=8: {citas_8[0]}")

    from datetime import date
    today = date.today()
    citas_hoy = db.execute(text(f"""
        SELECT id, fecha, hora FROM citas 
        WHERE empleado_id = 8 AND fecha = '{today}' AND estado_cita_id = 2
    """)).fetchall()
    print(f"\n   Citas HOY ({today}) confirmadas: {len(citas_hoy)}")
    for c in citas_hoy:
        print(f"      - ID={c[0]}, {c[1]} {c[2]}")

    print("\n" + "=" * 60)
    print("LISTO: empleado_id=8, usuario_id=8")
    print("=" * 60)

except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()