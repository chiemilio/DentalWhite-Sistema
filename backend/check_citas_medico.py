# check_citas_medico.py
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.user import User
from app.models.employee import Employee

db = SessionLocal()
try:
    # Buscar usuario doctor
    user = db.query(User).filter(User.email == 'doctor@dentalwhite.com').first()
    if user:
        print(f"Usuario: {user.nombre} {user.apellido_paterno} (ID: {user.id})")
        
        # Buscar empleado
        emp = db.query(Employee).filter(Employee.usuario_id == user.id).first()
        if emp:
            print(f"Empleado ID: {emp.id}")
            
            # Citas de este empleado
            citas = db.query(Appointment).filter(Appointment.empleado_id == emp.id).all()
            print(f"Total citas del empleado: {len(citas)}")
            for c in citas:
                print(f"  ID {c.id}: fecha={c.fecha}, hora={c.hora}, estado={c.estado_cita_id}")
        else:
            print("No hay empleado vinculado a este usuario")
    else:
        print("No se encontró usuario doctor@dentalwhite.com")
finally:
    db.close()