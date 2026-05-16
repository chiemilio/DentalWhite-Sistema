"""
Verificar y corregir empleados doctores
"""
from app.database import SessionLocal
from app.models.employee import Employee
from app.models.user import User
from app.models.appointment import Appointment
from datetime import date, time

db = SessionLocal()

print("="*70)
print("VERIFICACIÓN Y CORRECCIÓN DE EMPLEADOS DOCTORES")
print("="*70)

try:
    # 1. Ver todos los usuarios con rol_id = 3 (Doctor)
    print("\n1. USUARIOS CON ROL DOCTOR (rol_id=3):")
    doctors = db.query(User).filter(User.rol_id == 3).all()
    print(f"   Total: {len(doctors)}")
    for u in doctors:
        print(f"   - ID {u.id}: {u.email} ({u.nombre} {u.apellido_paterno})")
    
    # 2. Ver todos los empleados
    print("\n2. TODOS LOS EMPLEADOS:")
    employees = db.query(Employee).all()
    print(f"   Total: {len(employees)}")
    for e in employees:
        print(f"   - ID {e.id}: usuario_id={e.usuario_id}, puesto='{e.puesto}'")
    
    # 3. Verificar si el doctor@dentalwhite.com tiene empleado
    print("\n3. EMPLEADO DEL USUARIO doctor@dentalwhite.com:")
    doctor_user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    if doctor_user:
        print(f"   Usuario ID: {doctor_user.id}")
        emp = db.query(Employee).filter(Employee.usuario_id == doctor_user.id).first()
        if emp:
            print(f"   ✓ Empleado ID: {emp.id}, puesto: '{emp.puesto}'")
        else:
            print(f"   ✗ NO HAY EMPLEADO - Creando...")
            
            # Crear empleado doctor
            emp = Employee(
                usuario_id=doctor_user.id,
                numero_empleado=f'DOC-{doctor_user.id:03d}',
                puesto='Doctor',
                activo=True
            )
            db.add(emp)
            db.commit()
            db.refresh(emp)
            print(f"   ✓ EMPLEADO CREADO: ID={emp.id}")
    else:
        print("   ✗ No existe usuario doctor@dentalwhite.com")
    
    # 4. Crear citas de prueba para el empleado doctor
    print("\n4. CREAR CITAS DE PRUEBA:")
    
    # Obtener empleado doctor
    if doctor_user:
        emp = db.query(Employee).filter(Employee.usuario_id == doctor_user.id).first()
        if emp:
            today = date.today()
            
            # Limpiar citas de hoy
            db.query(Appointment).filter(
                Appointment.empleado_id == emp.id,
                Appointment.fecha == today
            ).delete()
            
            # Obtener paciente
            from app.models.patient import Patient
            paciente = db.query(Patient).first()
            
            if paciente:
                horas = [(9, 0), (10, 30), (14, 0), (15, 30)]
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
                print(f"   ✓ Creadas {len(horas)} citas confirmadas para HOY")
            else:
                print("   ✗ No hay pacientes")
    
    # 5. Mostrar resultado final
    print("\n5. RESULTADO FINAL:")
    if doctor_user:
        emp = db.query(Employee).filter(Employee.usuario_id == doctor_user.id).first()
        if emp:
            citas = db.query(Appointment).filter(
                Appointment.empleado_id == emp.id,
                Appointment.fecha == date.today()
            ).all()
            
            print(f"   Usuario: {doctor_user.email} (ID: {doctor_user.id})")
            print(f"   Empleado: ID={emp.id}, puesto='{emp.puesto}'")
            print(f"   Citas HOY: {len(citas)}")
            for c in citas:
                print(f"     - Cita {c.id}: {c.hora} (estado={c.estado_cita_id})")

except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()