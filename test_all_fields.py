import requests

# Login
r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', 
    json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Test PUT with all new fields
update_data = {
    'puesto': 'Especialista',
    'cedula_profesional': '12345678',
    'salario': 30000,
    'sucursal_id': 1,  # Pénjamo
    'usuario_rol_id': 3  # Doctor
}
print('Sending PUT with:', update_data)

r3 = requests.put('http://127.0.0.1:8000/api/v1/employees/11', json=update_data, headers=headers)
print('PUT response:', r3.status_code)

# Get result
r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r4.json()
print('Result:')
print('  puesto:', emp.get('puesto'))
print('  cedula:', emp.get('cedula_profesional'))
print('  salario:', emp.get('salario'))
print('  sucursal_id:', emp.get('sucursal_id'))
print('  sucursal_nombre:', emp.get('sucursal_nombre'))
print('  usuario_rol_id:', emp.get('usuario_rol_id'))
print('  usuario_rol_nombre:', emp.get('usuario_rol_nombre'))