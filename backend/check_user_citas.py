"""
Script para verificar citas del usuario actual (id=8, recepcionista)
"""
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.user import User

db = SessionLocal()

try:
    print("=== Verificando usuario ID=8 ===")
    user = db.query(User).filter(User.id == 8).first()
    if user:
        print(f"Usuario: {user.id} - {user.email} - {user.nombre} {user.apellido_paterno}")
    else:
        print("No se encontró usuario con ID=8")
    
    print("\n=== Verificando empleado del usuario 8 ===")
    employee = db.query(Employee).filter(Employee.usuario_id == 8).first()
    if employee:
        print(f"Empleado: {employee.id} - Puesto: {employee.puesto} - Sucursal: {employee.sucursal_id}")
    else:
        print("No se encontró empleado para usuario 8")
        # Buscar todos los empleados
        empleados = db.query(Employee).all()
        print(f"\nEmpleados en DB: {len(empleados)}")
        for e in empleados:
            print(f"  ID {e.id}: usuario_id={e.usuario_id}, puesto={e.puesto}")
    
    print("\n=== Citas del empleado ID (si existe) ===")
    if employee:
        citas = db.query(Appointment).filter(Appointment.empleado_id == employee.id).all()
        print(f"Citas para empleado {employee.id}: {len(citas)}")
        for c in citas:
            print(f"  Cita {c.id}: fecha={c.fecha}, hora={c.hora}, estado={c.estado_cita_id}")
    
    print("\n=== Todas las citas ===")
    todas_citas = db.query(Appointment).all()
    print(f"Total citas en DB: {len(todas_citas)}")
    for c in todas_citas:
        print(f"  Cita {c.id}: empleado={c.empleado_id}, paciente={c.paciente_id}, fecha={c.fecha}, estado={c.estado_cita_id}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()