import requests

r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Get employee 11
r2 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
print('GET employee 11:', r2.status_code)
emp = r2.json()
print('  Before:', emp.get('cedula_profesional'), emp.get('salario'), emp.get('puesto'))

# Update employee 11
update_data = {'puesto': 'Odontólogo', 'cedula_profesional': '99887766', 'salario': 30000}
print('Update data:', update_data)

r3 = requests.put('http://127.0.0.1:8000/api/v1/employees/11', json=update_data, headers=headers)
print('PUT employee 11:', r3.status_code, r3.text[:200] if r3.text else '')

# Get again
r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp2 = r4.json()
print('After:', emp2.get('cedula_profesional'), emp2.get('salario'), emp2.get('puesto'))