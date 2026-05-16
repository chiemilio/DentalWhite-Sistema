import sys
sys.path.insert(0, '/home/dragon3030/Sistema_Gestion_original/backend')

from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.user import User

db = SessionLocal()
try:
    print('=== CONSULTA BASE DE DATOS ===')
    print()

    from datetime import date
    today = date.today()

    print(f'--- Citas HOY ({today}) - Empleado 4 - Estado=Confirmada ---')
    citas = db.query(Appointment).filter(
        Appointment.empleado_id == 4,
        Appointment.fecha == today,
        Appointment.estado_cita_id == 2
    ).all()
    for c in citas:
        print(f'  ID={c.id}, hora={c.hora}, duracion={c.duracion_minutos}min, activo={c.activo}')

    print()
    print('--- Todos los empleados ---')
    emps = db.query(Employee).all()
    for e in emps:
        user = db.query(User).filter(User.id == e.usuario_id).first()
        email = user.email if user else 'N/A'
        print(f'  ID={e.id}, usuario_id={e.usuario_id}, email={email}, puesto={e.puesto}')

    print()
    print('--- Variables DoctorDashboard ---')
    print('  user.id = 8 (doctor@dentalwhite.com)')
    print('  /employees/?usuario_id=8 -> Empleado ID=4')
    print('  /appointments/?empleado_id=4 -> Citas de empleado 4')
    print('  filteredAppointments: estado=2 AND fecha=selectedDate')
    print(f'  selectedDate = {today}')

finally:
    db.close()