import urllib.request, json

BASE = "http://localhost:8000/api/v1"

data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())["access_token"]

# Test POST appointments
data2 = json.dumps({
    "paciente_id": 1,
    "servicio_id": 1,
    "empleado_id": 1,
    "sucursal_id": 2,
    "estado_cita_id": 1,
    "fecha_hora": "2026-05-13T10:00:00",
    "duracion_minutos": 30
}).encode()

print("1. POST /appointments/")
req2 = urllib.request.Request(f"{BASE}/appointments/", data=data2)
req2.add_header("Authorization", f"Bearer {token}")
req2.add_header("Content-Type", "application/json")
try:
    r2 = urllib.request.urlopen(req2)
    result = json.loads(r2.read().decode())
    print(f"   OK: Created ID {result['id']}")
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}")

print("\n2. POST /appointments (no slash)")
req3 = urllib.request.Request(f"{BASE}/appointments", data=data2)
req3.add_header("Authorization", f"Bearer {token}")
req3.add_header("Content-Type", "application/json")
try:
    r3 = urllib.request.urlopen(req3)
    result = json.loads(r3.read().decode())
    print(f"   OK: Created ID {result['id']}")
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}")