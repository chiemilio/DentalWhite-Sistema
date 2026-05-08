import requests

# Login
r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', 
    json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Reset employee 11
requests.put('http://127.0.0.1:8000/api/v1/employees/11', 
    json={'puesto': 'Doctor', 'cedula_profesional': '', 'salario': None}, headers=headers)

# Test with empty string for cedula (what the frontend might send)
update1 = {'puesto': 'Cirujano', 'cedula_profesional': '', 'salario': 25000}
r3 = requests.put('http://127.0.0.1:8000/api/v1/employees/11', json=update1, headers=headers)
print('Empty cedula:', r3.status_code)

r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r4.json()
print('Result - puesto:', emp.get('puesto'), 'cedula:', emp.get('cedula_profesional'))

# Test with None salary
requests.put('http://127.0.0.1:8000/api/v1/employees/11', 
    json={'puesto': 'Doctor'}, headers=headers)
r5 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp2 = r5.json()
print('Reset again - puesto:', emp2.get('puesto'), 'salario:', emp2.get('salario'))

# Final check
print('\nFinal DB state:')
r6 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp3 = r6.json()
print('  puesto:', emp3.get('puesto'))
print('  cedula_profesional:', emp3.get('cedula_profesional'))
print('  salario:', emp3.get('salario'))