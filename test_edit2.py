import requests

r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Reset employee 11 first
requests.put('http://127.0.0.1:8000/api/v1/employees/11', 
    json={'puesto': 'Dentista General', 'cedula_profesional': None, 'salario': None}, headers=headers)
print('Reset employee 11')

# Get employee 11
r2 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r2.json()
print('Before:', emp.get('cedula_profesional'), emp.get('salario'), emp.get('puesto'))

# Now simulate the frontend PUT with Number(emp.id)
emp_id = 11
update_data = {'puesto': 'Cirujano Dental', 'cedula_profesional': '11223344', 'salario': 45000}

r3 = requests.put(f'http://127.0.0.1:8000/api/v1/employees/{emp_id}', json=update_data, headers=headers)
print(f'PUT /employees/{emp_id}:', r3.status_code, r3.text[:100] if r3.text else '')

# Get again
r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp2 = r4.json()
print('After:', emp2.get('cedula_profesional'), emp2.get('salario'), emp2.get('puesto'))