"""
Script para crear citas de prueba confirmadas para el médico actual
"""
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.user import User
from app.models.service import Service
from app.models.sucursal import Sucursal
from datetime import date, time, timedelta

db = SessionLocal()

try:
    # Buscar el empleado del médico con email doctor@dentalwhite.com
    user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    if not user:
        print("No se encontró usuario con email doctor@dentalwhite.com")
        exit(1)
    
    print(f"Usuario encontrado: {user.id} - {user.email}")
    
    employee = db.query(Employee).filter(Employee.usuario_id == user.id).first()
    if not employee:
        print(f"No se encontró empleado para usuario {user.id}")
        exit(1)
    
    print(f"Empleado encontrado: {employee.id} - Puesto: {employee.puesto}")
    
    # Obtener servicios
    servicios = db.query(Service).limit(5).all()
    if not servicios:
        print("No hay servicios en la base de datos")
        exit(1)
    
    print(f"Servicios disponibles: {len(servicios)}")
    
    # Obtener sucursales
    sucursales = db.query(Sucursal).limit(5).all()
    if not sucursales:
        print("No hay sucursales en la base de datos")
        exit(1)
    
    print(f"Sucursales disponibles: {len(sucursales)}")
    
    # Obtener pacientes
    from app.models.patient import Patient
    pacientes = db.query(Patient).limit(10).all()
    if not pacientes:
        print("No hay pacientes en la base de datos")
        exit(1)
    
    print(f"Pacientes disponibles: {len(pacientes)}")
    
    # Crear citas de prueba
    today = date.today()
    citas_data = [
        {"fecha": today, "hora": time(9, 0), "dias": 0},
        {"fecha": today, "hora": time(10, 0), "dias": 0},
        {"fecha": today, "hora": time(11, 30), "dias": 0},
        {"fecha": today, "hora": time(14, 0), "dias": 0},
        {"fecha": today + timedelta(days=1), "hora": time(9, 30), "dias": 1},
        {"fecha": today + timedelta(days=1), "hora": time(11, 0), "dias": 1},
        {"fecha": today + timedelta(days=2), "hora": time(10, 0), "dias": 2},
        {"fecha": today + timedelta(days=3), "hora": time(15, 0), "dias": 3},
    ]
    
    citas_creadas = []
    for i, data in enumerate(citas_data):
        cita = Appointment(
            paciente_id=pacientes[i % len(pacientes)].id,
            empleado_id=employee.id,
            servicio_id=servicios[i % len(servicios)].id,
            sucursal_id=sucursales[0].id,
            estado_cita_id=2,  # Confirmada
            fecha=data["fecha"],
            hora=data["hora"],
            duracion_minutos=30,
            motivo_consulta=f"Consulta de prueba #{i+1}",
            notas=f"Cita de prueba confirmada #{i+1}",
            activo=True
        )
        db.add(cita)
        citas_creadas.append(cita)
    
    db.commit()
    print(f"\n¡Creadas {len(citas_creadas)} citas confirmadas para el médico!")
    for c in citas_creadas:
        print(f"  Cita {c.id}: {c.fecha} {c.hora} - Estado: {c.estado_cita_id}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()