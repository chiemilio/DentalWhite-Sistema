from app.database import SessionLocal
from app.models.user import User
from app.models.employee import Employee
from app.models.catalogos import Especialidad, Sucursal
from datetime import date

db = SessionLocal()

# Get some specialties and branches
especialidades = db.query(Especialidad).limit(3).all()
sucursales = db.query(Sucursal).limit(2).all()

# Create test users and employees
test_data = [
    {'nombre': 'Ana', 'apellido_paterno': 'Garcia', 'email': 'ana.garcia@test.com', 'telefono': '5523456789', 'rol': 2, 'puesto': 'Dentista General'},
    {'nombre': 'Carlos', 'apellido_paterno': 'Lopez', 'email': 'carlos.lopez@test.com', 'telefono': '5523456790', 'rol': 3, 'puesto': 'Recepcionista'},
    {'nombre': 'Maria', 'apellido_paterno': 'Rodriguez', 'email': 'maria.rodriguez@test.com', 'telefono': '5523456791', 'rol': 2, 'puesto': 'Ortodoncista'},
    {'nombre': 'Jorge', 'apellido_paterno': 'Martinez', 'email': 'jorge.martinez@test.com', 'telefono': '5523456792', 'rol': 2, 'puesto': 'Endodoncista'},
    {'nombre': 'Laura', 'apellido_paterno': 'Fernandez', 'email': 'laura.fernandez@test.com', 'telefono': '5523456793', 'rol': 3, 'puesto': 'Asistente'},
]

for data in test_data:
    # Check if user exists
    existing = db.query(User).filter(User.email == data['email']).first()
    if existing:
        print(f'User {data["email"]} already exists')
        continue
    
    # Create user
    from app.utils.auth import get_password_hash
    user = User(
        email=data['email'],
        password_hash=get_password_hash('password123'),
        nombre=data['nombre'],
        apellido_paterno=data['apellido_paterno'],
        telefono_principal=data['telefono'],
        rol_id=data['rol'],
        activo=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f'Created user: {user.email} (id: {user.id})')
    
    # Create employee
    emp = Employee(
        usuario_id=user.id,
        numero_empleado=f'EMP{user.id:03d}',
        puesto=data['puesto'],
        fecha_contratacion=date(2024, 1, 1),
        activo=True,
        sucursal_id=sucursales[0].id if sucursales else None
    )
    
    if especialidades:
        emp.especialidades = especialidades[:1]
    
    db.add(emp)
    db.commit()
    print(f'Created employee for {user.email}')

print('Done creating test employees')
db.close()