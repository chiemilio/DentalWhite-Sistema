import urllib.request
import json

users = [
    {'email': 'ana.garcia@test.com', 'password': 'password123', 'nombre': 'Ana', 'apellido_paterno': 'Garcia', 'telefono': '5523456789'},
    {'email': 'carlos.lopez@test.com', 'password': 'password123', 'nombre': 'Carlos', 'apellido_paterno': 'Lopez', 'telefono': '5523456790'},
    {'email': 'maria.rodriguez@test.com', 'password': 'password123', 'nombre': 'Maria', 'apellido_paterno': 'Rodriguez', 'telefono': '5523456791'},
    {'email': 'jorge.martinez@test.com', 'password': 'password123', 'nombre': 'Jorge', 'apellido_paterno': 'Martinez', 'telefono': '5523456792'},
    {'email': 'laura.fernandez@test.com', 'password': 'password123', 'nombre': 'Laura', 'apellido_paterno': 'Fernandez', 'telefono': '5523456793'},
]

base_url = 'http://localhost:8000/api/v1'

for user_data in users:
    try:
        data = json.dumps(user_data).encode('utf-8')
        req = urllib.request.Request(f'{base_url}/auth/register/', data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            print(f'Created user: {user_data["email"]}')
    except urllib.error.HTTPError as e:
        if e.code == 400:
            print(f'User already exists: {user_data["email"]}')
        else:
            print(f'Error creating {user_data["email"]}: {e.code}')
    except Exception as e:
        print(f'Error: {e}')

print('Done creating users')