import urllib.request
import json

base_url = 'http://localhost:8000/api/v1'

# Login as admin to get token
login_data = {'email': 'admin@dentalwhite.com', 'password': 'admin123'}
req = urllib.request.Request(f'{base_url}/auth/login/', 
    data=json.dumps(login_data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as response:
    token = json.loads(response.read())['access_token']
    print(f'Got token')

# Get employees - we need to know user IDs
# First get users from /auth/me by logging in as each user
test_users = [
    {'email': 'ana.garcia@test.com', 'password': 'password123'},
    {'email': 'carlos.lopez@test.com', 'password': 'password123'},
    {'email': 'maria.rodriguez@test.com', 'password': 'password123'},
    {'email': 'jorge.martinez@test.com', 'password': 'password123'},
    {'email': 'laura.fernandez@test.com', 'password': 'password123'},
]

# Create employees via the API - use the user ID from login
for user_data in test_users:
    # Login as user to get their ID
    req = urllib.request.Request(f'{base_url}/auth/login/', 
        data=json.dumps(user_data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            token_data = json.loads(response.read())
            user_id = token_data.get('user_id', token_data.get('id'))
            print(f'User {user_data["email"]}: id={user_id}')
            
            # Now create employee
            # This won't work - we don't have employee creation endpoint that accepts email
            # Let's skip
    except Exception as e:
        print(f'Error login as {user_data["email"]}: {e}')

print('Done')