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
    print(f'Got token')

# Update employee 11 - change puesto
update_data = {'puesto': 'Dentista General Actualizado'}
req = urllib.request.Request(f'{base_url}/employees/11', 
    data=json.dumps(update_data).encode('utf-8'), 
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
req.get_method = lambda: 'PUT'
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read())
        print(f'Updated employee: {result.get("puesto")}')
except urllib.error.HTTPError as e:
    print(f'Error: {e.code} - {e.read().decode()}')

# Get employee 11 to verify
req = urllib.request.Request(f'{base_url}/employees/11', headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req) as response:
    emp = json.loads(response.read())
    print(f'Verify - Puesto: {emp.get("puesto")}, Especialidades: {emp.get("especialidades")}')