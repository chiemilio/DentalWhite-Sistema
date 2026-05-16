"""
Script para testear las citas con relaciones
"""
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.employee import Employee
from app.models.user import User
from sqlalchemy.orm import joinedload

db = SessionLocal()

try:
    print("=== Test 1: Citas sin filtro ===")
    citas = db.query(Appointment).limit(5).all()
    print(f"Total citas encontradas: {len(citas)}")
    for c in citas:
        print(f"  Cita {c.id}: estado={c.estado_cita_id}, empleado={c.empleado_id}")

    print("\n=== Test 2: Citas confirmadas ===")
    citas_confirmadas = db.query(Appointment).filter(Appointment.estado_cita_id == 2).all()
    print(f"Citas confirmadas: {len(citas_confirmadas)}")

    print("\n=== Test 3: Verificar relación de empleado ===")
    empleados = db.query(Employee).limit(3).all()
    for e in empleados:
        print(f"  Empleado {e.id}: usuario_id={e.usuario_id}")
        if e.usuario:
            print(f"    Usuario: {e.usuario.nombre} {e.usuario.apellido_paterno}")

    print("\n=== Test 4: Citas con joinedload ===")
    citas_load = db.query(Appointment).options(
        joinedload(Appointment.paciente).joinedload(Patient.usuario),
        joinedload(Appointment.empleado).joinedload(Employee.usuario),
        joinedload(Appointment.servicio),
        joinedload(Appointment.sucursal),
        joinedload(Appointment.estado_cita)
    ).filter(Appointment.estado_cita_id == 2).limit(5).all()
    
    print(f"Citas con joinedload: {len(citas_load)}")
    for c in citas_load:
        print(f"  Cita {c.id}")
        if c.paciente:
            print(f"    Paciente: {c.paciente.usuario.nombre if c.paciente.usuario else 'N/A'}")
        if c.empleado:
            print(f"    Empleado: {c.empleado.usuario.nombre if c.empleado.usuario else 'N/A'}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()