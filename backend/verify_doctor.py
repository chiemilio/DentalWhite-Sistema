"""
Verificar y crear empleado para el doctor
"""
from app.database import SessionLocal
from app.models.employee import Employee
from app.models.user import User
from app.models.appointment import Appointment
from datetime import date, time

db = SessionLocal()

print("="*60)
print("VERIFICACIÓN Y CREACIÓN DE EMPLEADO")
print("="*60)

try:
    # 1. Buscar usuario doctor
    print("\n1. Buscando usuario doctor@dentalwhite.com...")
    user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    
    if not user:
        print("   NO ENCONTRADO")
        # Buscar cualquier usuario
        users = db.query(User).all()
        print(f"   Usuarios en DB: {len(users)}")
        for u in users:
            print(f"   - ID {u.id}: {u.email} (rol_id={u.rol_id})")
        
        # Tomar el primer usuario
        if users:
            user = users[0]
            print(f"\n   Usando usuario: {user.email}")
        else:
            print("   No hay usuarios en la DB!")
            exit()
    else:
        print(f"   ENCONTRADO: ID={user.id}, email={user.email}, rol_id={user.rol_id}")
    
    # 2. Buscar empleado para este usuario
    print(f"\n2. Buscando empleado para usuario_id={user.id}...")
    emp = db.query(Employee).filter(Employee.usuario_id == user.id).first()
    
    if emp:
        print(f"   ENCONTRADO: Empleado ID={emp.id}, puesto={emp.puesto}")
    else:
        print("   NO ENCONTRADO - Creando empleado...")
        
        # Verificar si ya existe otro empleado doctor
        existing = db.query(Employee).filter(Employee.puesto.like('%Doctor%')).first()
        
        emp = Employee(
            usuario_id=user.id,
            numero_empleado=f'EMP-{user.id:03d}',
            puesto='Doctor',
            activo=True
        )
        db.add(emp)
        db.commit()
        db.refresh(emp)
        print(f"   CREADO: Empleado ID={emp.id}")
    
    # 3. Verificar citas del empleado
    print(f"\n3. Citas del empleado {emp.id}...")
    citas = db.query(Appointment).filter(Appointment.empleado_id == emp.id).all()
    print(f"   Total citas: {len(citas)}")
    
    for c in citas:
        print(f"   - Cita {c.id}: fecha={c.fecha}, hora={c.hora}, estado={c.estado_cita_id}")
    
    # 4. Crear citas de prueba si no hay
    print(f"\n4. Creando citas de prueba para HOY...")
    today = date.today()
    print(f"   Fecha: {today}")
    
    # Eliminar citas existentes del empleado para hoy
    db.query(Appointment).filter(
        Appointment.empleado_id == emp.id,
        Appointment.fecha == today
    ).delete()
    
    # Obtener un paciente
    from app.models.patient import Patient
    paciente = db.query(Patient).first()
    
    if paciente:
        print(f"   Paciente: {paciente.id}")
        
        horas = [(9, 0), (10, 30), (14, 0), (16, 0)]
        
        for h, m in horas:
            cita = Appointment(
                paciente_id=paciente.id,
                empleado_id=emp.id,
                servicio_id=1,
                sucursal_id=1,
                estado_cita_id=2,  # Confirmada
                fecha=today,
                hora=time(h, m),
                duracion_minutos=30,
                motivo_consulta=f"Consulta de prueba {h}:{m:02d}",
                activo=True
            )
            db.add(cita)
        
        db.commit()
        print(f"   CREADAS: {len(horas)} citas confirmadas para HOY")
        
        # Verificar
        citas_hoy = db.query(Appointment).filter(
            Appointment.empleado_id == emp.id,
            Appointment.fecha == today
        ).all()
        
        print(f"\n5. VERIFICACIÓN FINAL")
        print(f"   Empleado ID: {emp.id}")
        print(f"   Usuario ID: {user.id}")
        print(f"   Citas HOY: {len(citas_hoy)}")
        
        for c in citas_hoy:
            print(f"   - Cita {c.id}: {c.fecha} {c.hora} (estado={c.estado_cita_id})")
    else:
        print("   NO HAY PACIENTES EN LA DB!")
    
    print("\n" + "="*60)
    print("RESULTADO:")
    print(f"  User ID para login: {user.id}")
    print(f"  Employee ID: {emp.id}")
    print("="*60)

except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()