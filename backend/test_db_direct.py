"""
Test directo de la base de datos
"""
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.user import User
from app.models.patient import Patient
from datetime import date, time

db = SessionLocal()

try:
    print("="*60)
    print("  VERIFICACIÓN DE BASE DE DATOS")
    print("="*60)
    
    # 1. Verificar usuarios
    print("\n1. USUARIOS")
    users = db.query(User).all()
    print(f"   Total usuarios: {len(users)}")
    for u in users:
        print(f"   - ID {u.id}: {u.email} (rol_id={u.rol_id})")
    
    # 2. Verificar doctores (rol_id = 3)
    print("\n2. DOCTORES (rol_id=3)")
    doctors = db.query(User).filter(User.rol_id == 3).all()
    print(f"   Doctores encontrados: {len(doctors)}")
    for d in doctors:
        print(f"   - ID {d.id}: {d.email} - {d.nombre} {d.apellido_paterno}")
    
    if not doctors:
        # Buscar por email
        doctor = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
        if doctor:
            print(f"   Doctor por email: ID {doctor.id} - {doctor.email}")
        else:
            print("   No se encontró doctor@dentalwhite.com")
    
    # 3. Verificar empleados
    print("\n3. EMPLEADOS")
    employees = db.query(Employee).all()
    print(f"   Total empleados: {len(employees)}")
    for e in employees:
        print(f"   - ID {e.id}: usuario_id={e.usuario_id}, puesto={e.puesto}")
    
    # 4. Buscar empleado del doctor
    print("\n4. EMPLEADO DEL DOCTOR")
    doctor_user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    if doctor_user:
        emp = db.query(Employee).filter(Employee.usuario_id == doctor_user.id).first()
        if emp:
            print(f"   ✓ Empleado ID {emp.id} para usuario {doctor_user.id}")
            emp_id = emp.id
        else:
            print(f"   ✗ No hay empleado para usuario {doctor_user.id}")
            emp_id = None
    else:
        print("   ✗ No se encontró usuario doctor@dentalwhite.com")
        emp_id = None
    
    # 5. Verificar citas
    print("\n5. CITAS")
    all_appointments = db.query(Appointment).all()
    print(f"   Total citas: {len(all_appointments)}")
    
    if all_appointments:
        # Por estado
        states = {}
        for a in all_appointments:
            states[a.estado_cita_id] = states.get(a.estado_cita_id, 0) + 1
        print(f"   Por estado: {states}")
        
        # Por empleado
        by_emp = {}
        for a in all_appointments:
            by_emp[a.empleado_id] = by_emp.get(a.empleado_id, 0) + 1
        print(f"   Por empleado: {by_emp}")
    
    # 6. Citas del doctor
    if emp_id:
        print(f"\n6. CITAS DEL EMPLEADO {emp_id}")
        emp_appointments = db.query(Appointment).filter(Appointment.empleado_id == emp_id).all()
        print(f"   Citas del empleado: {len(emp_appointments)}")
        
        for a in emp_appointments:
            paciente = db.query(Patient).filter(Patient.id == a.paciente_id).first()
            paciente_nombre = "N/A"
            if paciente and paciente.usuario:
                paciente_nombre = f"{paciente.usuario.nombre} {paciente.usuario.apellido_paterno}"
            
            print(f"   - Cita {a.id}: {a.fecha} {a.hora} | Estado={a.estado_cita_id} | Paciente={paciente_nombre}")
    
    # 7. Crear citas de prueba si no hay
    print("\n7. CREAR CITAS DE PRUEBA")
    if emp_id:
        today = date.today()
        existing = db.query(Appointment).filter(
            Appointment.empleado_id == emp_id,
            Appointment.fecha == today
        ).all()
        
        if not existing:
            print(f"   Creando citas para hoy ({today})...")
            
            # Obtener paciente
            paciente = db.query(Patient).first()
            if paciente:
                horas = [time(9, 0), time(10, 30), time(14, 0), time(16, 0)]
                for i, h in enumerate(horas):
                    cita = Appointment(
                        paciente_id=paciente.id,
                        empleado_id=emp_id,
                        servicio_id=1,
                        sucursal_id=1,
                        estado_cita_id=2,  # Confirmada
                        fecha=today,
                        hora=h,
                        duracion_minutos=30,
                        motivo_consulta=f"Consulta de prueba {i+1}",
                        activo=True
                    )
                    db.add(cita)
                
                db.commit()
                print(f"   ✓ Creadas {len(horas)} citas confirmadas")
            else:
                print("   ✗ No hay pacientes")
        else:
            print(f"   Ya hay {len(existing)} citas para hoy")
    
    print("\n" + "="*60)
    print("  VERIFICACIÓN COMPLETA")
    print("="*60)

except Exception as e:
    print(f"\nError: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()