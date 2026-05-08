import requests

# Login
r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', 
    json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Test PUT - only basic fields first
update_data = {
    'puesto': 'Especialista',
    'cedula_profesional': '99999999',
    'salario': 50000
}
print('Test 1 - Basic fields:', update_data)

r3 = requests.put('http://127.0.0.1:8000/api/v1/employees/11', json=update_data, headers=headers)
print('PUT Basic:', r3.status_code, r3.text[:100] if r3.text else '')

# Get result
r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r4.json()
print('After basic put - puesto:', emp.get('puesto'), 'cedula:', emp.get('cedula_profesional'))

# Check DB directly
import subprocess
result = subprocess.run(
    ['docker', 'exec', 'dental_white_db', 'psql', '-U', 'dental_admin', '-d', 'dental_white', '-c', 
     "SELECT id, puestos, cedula_profesional, salary FROM empleados WHERE id=11;"],
    capture_output=True, text=True
)
print('\nDB check:')
print(result.stdout)