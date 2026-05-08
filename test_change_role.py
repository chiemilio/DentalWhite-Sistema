import requests

r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', 
    json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Change role to 2 (Recepcionista)
update_data = {
    'usuario_rol_id': 2
}
print('Changing to Recepcionista:', update_data)

r3 = requests.put('http://127.0.0.1:8000/api/v1/employees/11', json=update_data, headers=headers)
print('PUT:', r3.status_code, r3.text[:100] if r3.text else '')

# Check result
r4 = requests.get('http://127.0.0.1:8000/api/v1/employees/11', headers=headers)
emp = r4.json()
print('Result - rol_id:', emp.get('usuario_rol_id'), 'rol_nombre:', emp.get('usuario_rol_nombre'))