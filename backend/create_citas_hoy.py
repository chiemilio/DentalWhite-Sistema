#!/usr/bin/env python3
"""
Crear citas de HOY para el doctor
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
    print("CREAR CITAS DE HOY PARA EL DOCTOR")
    print("=" * 60)

    # Usuario doctor
    user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    print(f"\n1. Usuario: id={user.id}, email={user.email}")

    # Empleado
    emp = db.query(Employee).filter(Employee.usuario_id == user.id).first()
    if emp:
        print(f"   Empleado: id={emp.id}, puesto={emp.puesto}")
    else:
        print("   ERROR: No hay empleado")
        exit(1)

    # Eliminar citas existentes del doctor para HOY
    today = date.today()
    db.query(Appointment).filter(
        Appointment.empleado_id == emp.id,
        Appointment.fecha == today
    ).delete()
    db.commit()
    print(f"\n2. Eliminadas citas existentes para HOY ({today})")

    # Paciente
    paciente = db.query(Patient).first()
    if not paciente:
        print("ERROR: No hay pacientes")
        exit(1)
    print(f"   Paciente: id={paciente.id}")

    # Crear 4 citas para HOY
    horas = [(9, 0), (10, 30), (14, 0), (16, 0)]
    for h, m in horas:
        cita = Appointment(
            paciente_id=paciente.id,
            empleado_id=emp.id,
            servicio_id=1,
            sucursal_id=1,
            estado_cita_id=2,
            fecha=today,
            hora=time(h, m),
            duracion_minutos=30,
            motivo_consulta=f"Consulta {h}:{m:02d}",
            activo=True
        )
        db.add(cita)
    
    db.commit()
    print(f"\n3. Creadas {len(horas)} citas para HOY")

    # Verificar
    citas = db.query(Appointment).filter(
        Appointment.empleado_id == emp.id,
        Appointment.fecha == today,
        Appointment.estado_cita_id == 2
    ).all()
    print(f"\n4. VERIFICACIÓN:")
    print(f"   Citas HOY confirmadas: {len(citas)}")
    for c in citas:
        print(f"      - ID={c.id}, {c.fecha} {c.hora}")

    print("\n" + "=" * 60)
    print(f"ABRE EL NAVEGADOR EN LA FECHA: {today}")
    print("=" * 60)

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()