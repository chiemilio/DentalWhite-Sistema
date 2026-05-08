import urllib.request
import json

base_url = 'http://localhost:8000/api/v1'

# Login as admin first
login_data = {'email': 'admin@dentalwhite.com', 'password': 'admin123'}
req = urllib.request.Request(f'{base_url}/auth/login/', 
    data=json.dumps(login_data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        token_data = json.loads(response.read())
        token = token_data.get('access_token', '')
        print(f'Got token: {token[:30] if token else "No token"}')
        
        # Now get employees
        if token:
            req = urllib.request.Request(f'{base_url}/employees/', headers={'Authorization': f'Bearer {token}'})
            with urllib.request.urlopen(req) as response:
                employees = json.loads(response.read())
                print(f'Current employees: {len(employees)}')
                for e in employees:
                    print(f'  - {e.get("id")}: {e.get("usuario_nombre")} - {e.get("puesto")}')
except Exception as e:
    print(f'Error: {e}')