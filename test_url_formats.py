import urllib.request, json

# Login
data = json.dumps({'email': 'doctor@dentalwhite.com', 'password': 'doctor123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
req.add_header('Content-Type', 'application/json')
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())['access_token']

# Test appointments with trailing slash and query params
req2 = urllib.request.Request('http://localhost:8000/api/v1/appointments/?empleado_id=1')
req2.add_header('Authorization', 'Bearer ' + token)
try:
    r2 = urllib.request.urlopen(req2)
    data = json.loads(r2.read().decode())
    print("With /?empleado_id=1: " + str(len(data)) + " appointments")
except urllib.error.HTTPError as e:
    print("With /?empleado_id=1: ERROR " + str(e.code))

# Test appointments without trailing slash
req3 = urllib.request.Request('http://localhost:8000/api/v1/appointments?empleado_id=1')
req3.add_header('Authorization', 'Bearer ' + token)
try:
    r3 = urllib.request.urlopen(req3)
    data = json.loads(r3.read().decode())
    print("With ?empleado_id=1: " + str(len(data)) + " appointments")
except urllib.error.HTTPError as e:
    print("With ?empleado_id=1: ERROR " + str(e.code))