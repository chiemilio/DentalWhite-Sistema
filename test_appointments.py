import urllib.request, json

# First login as doctor to get token
data = json.dumps({'email': 'doctor@dentalwhite.com', 'password': 'doctor123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
req.add_header('Content-Type', 'application/json')
r = urllib.request.urlopen(req)
resp = json.loads(r.read().decode())
token = resp['access_token']
print(f"Login success, token obtained")

# Now test appointments endpoint
req2 = urllib.request.Request('http://localhost:8000/api/v1/appointments?empleado_id=1')
req2.add_header('Authorization', f'Bearer {token}')
try:
    r2 = urllib.request.urlopen(req2)
    data = json.loads(r2.read().decode())
    print(f'Total appointments: {len(data)}')
    for apt in data:
        print(f'  ID {apt["id"]}: {apt["fecha_hora"]} - estado={apt["estado_cita_id"]}')
except urllib.error.HTTPError as e:
    print(f'Error: {e.code} - {e.read().decode()[:200]}')