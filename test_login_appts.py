import urllib.request, json

# First login as doctor to get token
data = json.dumps({'email': 'doctor@dentalwhite.com', 'password': 'doctor123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
req.add_header('Content-Type', 'application/json')
r = urllib.request.urlopen(req)
resp = json.loads(r.read().decode())
token = resp['access_token']
print("Login success, token: " + token[:50] + "...")

# Now test appointments endpoint
req2 = urllib.request.Request('http://localhost:8000/api/v1/appointments?empleado_id=1')
req2.add_header('Authorization', 'Bearer ' + token)
try:
    r2 = urllib.request.urlopen(req2)
    data = json.loads(r2.read().decode())
    print("Total appointments: " + str(len(data)))
    for apt in data:
        print("  ID " + str(apt['id']) + ": " + str(apt['fecha_hora']) + " - estado=" + str(apt['estado_cita_id']))
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print("Error " + str(e.code) + ": " + body[:300])