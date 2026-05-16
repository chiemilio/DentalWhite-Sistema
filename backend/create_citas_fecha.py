#!/usr/bin/env python3
"""
Crear citas para el doctor en fecha 2026-05-08
"""
import sys
sys.path.insert(0, '/home/dragon3030/Sistema_Gestion_original/backend')

from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.employee import Employee
from app.models.user import User
from datetime import date, time

db = SessionLocal()
try:
    print("=" * 60)
    print("CREAR CITAS PARA EL DOCTOR - 2026-05-08")
    print("=" * 60)

    # Usuario doctor
    user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    print(f"\n1. Usuario: id={user.id}, email={user.email}")

    # Empleado
    emp = db.query(Employee).filter(Employee.usuario_id == user.id).first()
    print(f"   Empleado: id={emp.id}")

    # Fecha objetivo
    target_date = date(2026, 5, 8)

    # Eliminar citas existentes
    db.query(Appointment).filter(
        Appointment.empleado_id == emp.id,
        Appointment.fecha == target_date
    ).delete()
    db.commit()
    print(f"\n2. Eliminadas citas para {target_date}")

    # Paciente
    paciente = db.query(Patient).first()

    # Crear 4 citas
    horas = [(9, 0), (10, 30), (14, 0), (16, 0)]
    for h, m in horas:
        cita = Appointment(
            paciente_id=paciente.id,
            empleado_id=emp.id,
            servicio_id=1,
            sucursal_id=1,
            estado_cita_id=2,
            fecha=target_date,
            hora=time(h, m),
            duracion_minutos=30,
            motivo_consulta=f"Consulta {h}:{m:02d}",
            activo=True
        )
        db.add(cita)

    db.commit()
    print(f"\n3. Creadas {len(horas)} citas para {target_date}")

    # Verificar
    citas = db.query(Appointment).filter(
        Appointment.empleado_id == emp.id,
        Appointment.fecha == target_date,
        Appointment.estado_cita_id == 2
    ).all()
    print(f"\n4. VERIFICACIÓN:")
    for c in citas:
        print(f"   - ID={c.id}, {c.fecha} {c.hora}")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()