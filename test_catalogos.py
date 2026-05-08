import requests

r = requests.post('http://127.0.0.1:8000/api/v1/auth/login', json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# Test roles
r2 = requests.get('http://127.0.0.1:8000/api/v1/catalogos/roles', headers=headers)
print('Roles:', [role['nombre'] for role in r2.json()])

# Test sucursales
r3 = requests.get('http://127.0.0.1:8000/api/v1/catalogos/sucursales', headers=headers)
print('Sucursales:', [s['nombre'] for s in r3.json()])