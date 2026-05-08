import urllib.request
import json

base_url = 'http://localhost:8000/api/v1'

test_users = [
    {'email': 'ana.garcia@test.com', 'password': 'password123'},
    {'email': 'carlos.lopez@test.com', 'password': 'password123'},
    {'email': 'maria.rodriguez@test.com', 'password': 'password123'},
    {'email': 'jorge.martinez@test.com', 'password': 'password123'},
    {'email': 'laura.fernandez@test.com', 'password': 'password123'},
]

# Get user IDs by logging in
for user_data in test_users:
    req = urllib.request.Request(f'{base_url}/auth/login/', 
        data=json.dumps(user_data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            user_id = data.get('user_id')
            if not user_id:
                # Try /me endpoint
                token = data.get('access_token')
                if token:
                    req2 = urllib.request.Request(f'{base_url}/auth/me', headers={'Authorization': f'Bearer {token}'})
                    with urllib.request.urlopen(req2) as resp2:
                        me = json.loads(resp2.read())
                        user_id = me.get('user', {}).get('id')
            print(f'{user_data["email"]}: user_id={user_id}')
    except Exception as e:
        print(f'Error with {user_data["email"]}: {e}')

print('Now we know user IDs, lets create employees via SQL manually')
print('Users exist in DB, can test via UI')