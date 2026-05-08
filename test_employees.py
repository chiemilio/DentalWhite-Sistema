import requests
import json

# Login
print('=== LOGIN TEST ===')
r = requests.post('http://localhost:8000/api/v1/auth/login', 
              json={'email': 'admin@dentalwhite.com', 'password': 'admin123'})
print(f'Login status: {r.status_code}')
if r.status_code == 200:
    token = r.json()['access_token']
    print(f'Token obtained: {token[:20]}...')
    
    # Test employees endpoint
    print('\n=== EMPLOYEES TEST ===')
    headers = {'Authorization': f'Bearer {token}'}
    r = requests.get('http://localhost:8000/api/v1/employees/', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f'Employees found: {len(data)}')
        for emp in data[:3]:
            print(f'  - ID: {emp.get("id")}, Nombre: {emp.get("usuario_nombre", "N/A")}')
    else:
        print(f'Error: {r.text[:500]}')
else:
    print(f'Login failed: {r.text}')
