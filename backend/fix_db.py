#!/usr/bin/env python3
"""
Corregir empleado_id en base de datos - crear empleado 8 para el doctor
"""
import sys
sys.path.insert(0, '/home/dragon3030/Sistema_Gestion_original/backend')

from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    print("=" * 60)
    print("CORRECCIÓN BASE DE DATOS")
    print("=" * 60)

    # 1. Verificar empleado 8
    result = db.execute(text("SELECT id, usuario_id, puesto FROM empleados WHERE id = 8")).fetchone()
    if result:
        print(f"\n1. Empleado 8 YA EXISTE: id={result[0]}, usuario_id={result[1]}, puesto={result[2]}")
    else:
        print("\n1. Empleado 8 NO EXISTE - Creando...")
        
        # Obtener usuario doctor
        user = db.execute(text("SELECT id, email FROM usuarios WHERE email = 'doctor@dentalwhite.com'")).fetchone()
        if not user:
            print("   ERROR: No se encontró usuario doctor@dentalwhite.com")
            exit(1)
        
        print(f"   Usuario: id={user[0]}, email={user[1]}")
        
        # Crear empleado 8
        db.execute(text("""
            INSERT INTO empleados (id, usuario_id, numero_empleado, puesto, activo, sucursal_id)
            VALUES (8, {}, 'EMP-008', 'Doctor', true, 1)
        """.format(user[0])))
        db.commit()
        print("   Empleado 8 CREADO exitosamente")

    # 2. Verificar citas con empleado_id=8
    print("\n2. Verificando citas con empleado_id=8...")
    citas = db.execute(text("SELECT COUNT(*) FROM citas WHERE empleado_id = 8")).fetchone()
    print(f"   Citas con empleado_id=8: {citas[0]}")

    print("\n" + "=" * 60)
    print("BASE DE DATOS ACTUALIZADA")
    print("=" * 60)

except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()