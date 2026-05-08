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

# Get current employees to know what user IDs have employee profiles
req = urllib.request.Request(f'{base_url}/employees/', headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req) as response:
    employees = json.loads(response.read())
    employee_user_ids = [e['usuario_id'] for e in employees]
    print(f'Existing employee user IDs: {employee_user_ids}')

# Login as each test user to get their ID, then create employee
# Actually we can just create directly if we know the user ID - but we need to find them
# Let's use register endpoint with employee creation

test_employees = [
    {'email': 'ana.garcia@test.com', 'puesto': 'Dentista General', 'numero_empleado': 'EMP201'},
    {'email': 'carlos.lopez@test.com', 'puesto': 'Recepcionista', 'numero_empleado': 'EMP202'},
    {'email': 'maria.rodriguez@test.com', 'puesto': 'Ortodoncista', 'numero_empleado': 'EMP203'},
    {'email': 'jorge.martinez@test.com', 'puesto': 'Endodoncista', 'numero_empleado': 'EMP204'},
    {'email': 'laura.fernandez@test.com', 'puesto': 'Asistente Dental', 'numero_empleado': 'EMP205'},
]

# Get all users to find IDs
req = urllib.request.Request(f'{base_url}/users/', headers={'Authorization': f'Bearer {token}'})
try:
    with urllib.request.urlopen(req) as response:
        all_users = json.loads(response.read())
        test_users = [u for u in all_users if '@test.com' in u.get('email', '')]
        print(f'Found {len(test_users)} test users')
        for u in test_users:
            print(f'  User: {u.get("id")} - {u.get("email")}')
except Exception as e:
    print(f'No /users/ endpoint: {e}')
    # List users another way - via employee registration
    
    # For each test user, create employee directly
    # We can't easily get user ID, so let's skip for now
    print('Will use SQL instead')