import requests

# Login
r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', 
    json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Test PUT with all fields including usuario_rol_id
update_data = {
    'puesto': 'Especialista dental',
    'cedula_profesional': '77777777',
    'salario': 45000,
    'usuario_rol_id': 3  # Doctor
}
print('Sending:', update_data)

r3 = requests.put('http://127.0.0.1:8000/api/v1/employees/11', json=update_data, headers=headers)
print('PUT response:', r3.status_code, r3.text[:200] if r3.text else '')

# Get and show result
r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r4.json()
print('\nResult:')
print('  puesto:', emp.get('puesto'))
print('  cedula:', emp.get('cedula_profesional'))
print('  salary:', emp.get('salario'))
print('  rol:', emp.get('usuario_rol_nombre'))