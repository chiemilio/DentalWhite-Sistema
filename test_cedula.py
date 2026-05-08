import requests

r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}
r2 = requests.get('http://127.0.0.1:8000/api/v1/employees/', headers=headers)
print('Employees with cedula/salario:')
for emp in r2.json():
    if emp.get('cedula_profesional') or emp.get('salario'):
        print(f"ID:{emp['id']} Name:{emp.get('usuario_nombre')} Cedula:{emp.get('cedula_profesional')} Salario:{emp.get('salario')}")