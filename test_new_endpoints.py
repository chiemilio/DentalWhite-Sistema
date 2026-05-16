import urllib.request, json

BASE = "http://localhost:8000/api/v1"

def login(email, password):
    data = json.dumps({"email": email, "password": password}).encode()
    req = urllib.request.Request(f"{BASE}/auth/login", data=data)
    req.add_header("Content-Type", "application/json")
    r = urllib.request.urlopen(req)
    return json.loads(r.read().decode())["access_token"]

def api_get(token, endpoint):
    req = urllib.request.Request(f"{BASE}{endpoint}")
    req.add_header("Authorization", f"Bearer {token}")
    r = urllib.request.urlopen(req)
    return json.loads(r.read().decode())

def api_post(token, endpoint, data):
    data_enc = json.dumps(data).encode()
    req = urllib.request.Request(f"{BASE}{endpoint}", data=data_enc)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        r = urllib.request.urlopen(req)
        return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()[:200]}

token = login("recepcion@dentalwhite.com", "recep123")

print("=== New Endpoints Test ===\n")

# Test employees
print("1. GET /employees/")
try:
    data = api_get(token, "/employees/")
    print(f"   OK: {len(data)} employees")
    for e in data[:3]:
        print(f"   - ID {e.get('id')}: {e.get('usuario_nombre', 'N/A')}")
except Exception as e:
    print(f"   FAIL: {e}")

# Test create patient
print("\n2. POST /patients/")
result = api_post(token, "/patients/", {
    "nombre": "Juan",
    "apellido": "Perez",
    "email": "juan@test.com",
    "telefono": "1234567890"
})
if "error" in result:
    print(f"   FAIL: {result['error']} - {result['detail']}")
else:
    print(f"   OK: Created patient ID {result.get('id')}")

# Test create appointment
print("\n3. POST /appointments/")
result = api_post(token, "/appointments/", {
    "paciente_id": 1,
    "servicio_id": 1,
    "empleado_id": 1,
    "sucursal_id": 2,
    "estado_cita_id": 1,
    "fecha_hora": "2026-05-15T10:00:00",
    "duracion_minutos": 30
})
if "error" in result:
    print(f"   FAIL: {result['error']} - {result['detail']}")
else:
    print(f"   OK: Created appointment ID {result.get('id')}")

print("\n=== Done ===")