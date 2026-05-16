"""
Debug script to check appointments data
"""
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.user import User

db = SessionLocal()

try:
    print("=== CHECKING APPOINTMENTS ===")
    
    # Get all appointments
    all_appointments = db.query(Appointment).all()
    print(f"Total appointments: {len(all_appointments)}")
    
    # Show all appointments
    for apt in all_appointments:
        print(f"  ID {apt.id}: empleado={apt.empleado_id}, estado={apt.estado_cita_id}, fecha={apt.fecha}")
    
    print("\n=== CHECKING EMPLOYEES ===")
    
    # Get all employees
    all_employees = db.query(Employee).all()
    print(f"Total employees: {len(all_employees)}")
    
    for emp in all_employees:
        print(f"  Employee ID {emp.id}: usuario_id={emp.usuario_id}, puesto={emp.puesto}")
        if emp.usuario:
            print(f"    User: {emp.usuario.email} - {emp.usuario.nombre} {emp.usuario.apellido_paterno}")
    
    print("\n=== CHECKING DOCTOR USER ===")
    
    # Find doctor users
    doctor_users = db.query(User).filter(User.rol_id == 3).all()  # rol_id 3 = Doctor
    print(f"Doctor users: {len(doctor_users)}")
    
    for u in doctor_users:
        print(f"  User {u.id}: {u.email} - {u.nombre} {u.apellido_paterno}")
    
    print("\n=== APPOINTMENTS FOR EACH DOCTOR ===")
    
    for u in doctor_users:
        emp = db.query(Employee).filter(Employee.usuario_id == u.id).first()
        if emp:
            apts = db.query(Appointment).filter(Appointment.empleado_id == emp.id).all()
            print(f"Appointments for user {u.id} (empleado {emp.id}): {len(apts)}")
            for a in apts:
                print(f"    Cita {a.id}: estado={a.estado_cita_id}, fecha={a.fecha}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()