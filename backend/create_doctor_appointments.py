"""
Crear citas de prueba para el doctor
"""
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.user import User
from app.models.patient import Patient
from datetime import date, time

db = SessionLocal()

try:
    print("=== CREAR CITAS DE PRUEBA ===\n")
    
    # Buscar usuario doctor
    user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    if not user:
        print("No se encontró usuario doctor@dentalwhite.com")
        
        # Buscar cualquier usuario con rol doctor
        doctors = db.query(User).filter(User.rol_id == 3).all()
        if doctors:
            user = doctors[0]
            print(f"Usando primer doctor encontrado: {user.email}")
        else:
            print("No hay doctores en el sistema")
            exit()
    
    print(f"Usuario: {user.id} - {user.email}")
    
    # Buscar empleado
    emp = db.query(Employee).filter(Employee.usuario_id == user.id).first()
    if not emp:
        print("No hay empleado para este usuario")
        
        # Crear empleado si no existe
        emp = Employee(
            usuario_id=user.id,
            numero_empleado='DOC-001',
            puesto='Doctor',
            activo=True
        )
        db.add(emp)
        db.commit()
        db.refresh(emp)
        print(f"Empleado creado: {emp.id}")
    else:
        print(f"Empleado: {emp.id} - {emp.puesto}")
    
    # Obtener pacientes
    patients = db.query(Patient).limit(5).all()
    if not patients:
        print("No hay pacientes")
        exit()
    
    print(f"Pacientes disponibles: {len(patients)}")
    
    # Crear citas para hoy
    today = date.today()
    print(f"\nFecha hoy: {today}")
    
    # Eliminar citas existentes del empleado (para limpio)
    db.query(Appointment).filter(Appointment.empleado_id == emp.id).delete()
    
    # Crear citas
    citas_data = [
        {"hora": time(9, 0), "estado": 2},   # Confirmada
        {"hora": time(10, 30), "estado": 2}, # Confirmada
        {"hora": time(14, 0), "estado": 2},  # Confirmada
    ]
    
    for i, data in enumerate(citas_data):
        cita = Appointment(
            paciente_id=patients[i % len(patients)].id,
            empleado_id=emp.id,
            servicio_id=1,
            sucursal_id=1,
            estado_cita_id=data["estado"],  # 2 = Confirmada
            fecha=today,
            hora=data["hora"],
            duracion_minutos=30,
            motivo_consulta=f"Consulta de prueba #{i+1}",
            activo=True
        )
        db.add(cita)
    
    db.commit()
    print(f"\n✓ Creadas {len(citas_data)} citas confirmadas para hoy")
    
    # Verificar citas creadas
    citas = db.query(Appointment).filter(
        Appointment.empleado_id == emp.id,
        Appointment.fecha == today
    ).all()
    print(f"Citas en BD para empleado {emp.id} hoy: {len(citas)}")
    for c in citas:
        print(f"  Cita {c.id}: {c.fecha} {c.hora} - estado={c.estado_cita_id}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()