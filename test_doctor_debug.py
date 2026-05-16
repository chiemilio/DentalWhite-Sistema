import urllib.request, json

# Login
data = json.dumps({'email': 'doctor@dentalwhite.com', 'password': 'doctor123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
req.add_header('Content-Type', 'application/json')
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())['access_token']

# Test employees endpoint
req2 = urllib.request.Request('http://localhost:8000/api/v1/employees/?usuario_id=1')
req2.add_header('Authorization', 'Bearer ' + token)
try:
    r2 = urllib.request.urlopen(req2)
    data = json.loads(r2.read().decode())
    print("Employees response:")
    print(json.dumps(data, indent=2))
except urllib.error.HTTPError as e:
    print("Employees ERROR " + str(e.code) + ": " + e.read().decode()[:300])

# Test appointments with empId from employees
print("\nTesting appointments with empId from employees:")
req3 = urllib.request.Request('http://localhost:8000/api/v1/appointments?empleado_id=1')
req3.add_header('Authorization', 'Bearer ' + token)
try:
    r3 = urllib.request.urlopen(req3)
    data = json.loads(r3.read().decode())
    print("Total: " + str(len(data)))
    # Filter for today and estado=2
    today = "2026-05-11"
    filtered = [a for a in data if a['fecha_hora'].startswith(today) and a['estado_cita_id'] == 2]
    print("For today with estado=2: " + str(len(filtered)))
    for apt in filtered:
        print("  ID " + str(apt['id']) + ": " + apt['fecha_hora'])
except urllib.error.HTTPError as e:
    print("Appointments ERROR " + str(e.code))