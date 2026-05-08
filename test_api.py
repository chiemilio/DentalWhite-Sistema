import requests
import time

# Login
r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
print('Login:', r.status_code)
if r.status_code != 200:
    print(r.text)
    exit()

token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Create test user first
test_email = f'test_doctor_{int(time.time())}@test.com'
r3 = requests.post('http://127.0.0.1:8000/api/v1/auth/register', 
    json={'email': test_email, 'password': 'Test1234', 'nombre': 'Doctor Test', 'telefono': '5551234567', 'rol_id': 3},
    headers=headers)
print('Create user:', r3.status_code, r3.text[:200] if r3.text else '')
if r3.status_code != 201:
    print('Failed to create user')
    exit()

user_id = r3.json()['id']

# Create employee with cedula and salary
import json
emp_data = {'usuario_id': user_id, 'numero_empleado': f'EMP-TEST-{int(time.time())}', 'puesto': 'Odontología', 'cedula_profesional': '12345678', 'salario': 25000, 'especialidad_ids': []}
print('Request data:', json.dumps(emp_data, default=str))
r4 = requests.post('http://127.0.0.1:8000/api/v1/employees/',
    json=emp_data,
    headers=headers)
print('Create employee:', r4.status_code, r4.text[:500] if r4.text else '')

# Get employees to verify
r2 = requests.get('http://127.0.0.1:8000/api/v1/employees/', headers=headers)
print('\nAll employees:')
for emp in r2.json():
    print(f"  ID:{emp['id']} Name:{emp.get('usuario_nombre')} Role:{emp.get('usuario_rol_nombre')} Cedula:{emp.get('cedula_profesional')} Salario:{emp.get('salario')}")