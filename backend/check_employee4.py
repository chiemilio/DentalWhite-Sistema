import sys
sys.path.insert(0, '/home/dragon3030/Sistema_Gestion_original/backend')

from app.database import SessionLocal
from app.models.employee import Employee
from app.models.user import User

db = SessionLocal()
try:
    emp = db.query(Employee).filter(Employee.id == 4).first()
    if emp:
        print(f'Employee ID 4:')
        print(f'  usuario_id: {emp.usuario_id}')
        print(f'  puesto: {emp.puesto}')
        user = db.query(User).filter(User.id == emp.usuario_id).first()
        if user:
            print(f'  User: id={user.id}, email={user.email}, nombre={user.nombre}')
        else:
            print(f'  No user found with id={emp.usuario_id}')
    else:
        print('Employee ID 4 not found')
finally:
    db.close()