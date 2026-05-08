import requests

r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# Check employee 11
r2 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r2.json()
print('Employee 11:', emp.get('puesto'), emp.get('cedula_profesional'), emp.get('salario'))