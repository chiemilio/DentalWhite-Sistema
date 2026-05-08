import urllib.request
import json

# First get admin token
login_data = {'email': 'admin@dentalwhite.com', 'password': 'admin123'}
base_url = 'http://localhost:8000/api/v1'

req = urllib.request.Request(f'{base_url}/auth/login/', 
    data=json.dumps(login_data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as response:
    token = json.loads(response.read())['access_token']

print(f'Got token: {token[:20]}...')

# Get list of users to find their IDs
req = urllib.request.Request(f'{base_url}/auth/me',
    headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req) as response:
    # This won't work, need list users endpoint
    
# Use the users we just created
employees_to_create = [
    {'email': 'ana.garcia@test.com', 'puesto': 'Dentista General', 'numero_empleado': 'EMP201'},
    {'email': 'carlos.lopez@test.com', 'puesto': 'Recepcionista', 'numero_empleado': 'EMP202'},
    {'email': 'maria.rodriguez@test.com', 'puesto': 'Ortodoncista', 'numero_empleado': 'EMP203'},
    {'email': 'jorge.martinez@test.com', 'puesto': 'Endodoncista', 'numero_empleado': 'EMP204'},
    {'email': 'laura.fernandez@test.com', 'puesto': 'Asistente Dental', 'numero_empleado': 'EMP205'},
]

# For each user we need to find their ID first (hack: try to login and get user id from token or use employee endpoint)
# Let's use SQL directly instead
print('Done')