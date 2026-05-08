import urllib.request
import json

base_url = 'http://localhost:8000/api/v1'

# Login as admin
login_data = {'email': 'admin@dentalwhite.com', 'password': 'admin123'}
req = urllib.request.Request(f'{base_url}/auth/login/', 
    data=json.dumps(login_data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as response:
    token = json.loads(response.read())['access_token']

# Get employees
req = urllib.request.Request(f'{base_url}/employees/', headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req) as response:
    employees = json.loads(response.read())
    for e in employees:
        print(f"ID: {e.get('id')}, Puesto: {e.get('puesto')}, Especialidades: {e.get('especialidades')}, Sucursal: {e.get('sucursal_nombre')}")