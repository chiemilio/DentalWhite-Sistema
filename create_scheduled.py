import urllib.request, json

BASE = "http://localhost:8000/api/v1"

def login(email, password):
    data = json.dumps({"email": email, "password": password}).encode()
    req = urllib.request.Request(f"{BASE}/auth/login", data=data)
    req.add_header("Content-Type", "application/json")
    r = urllib.request.urlopen(req)
    return json.loads(r.read().decode())["access_token"]

token = login("recepcion@dentalwhite.com", "recep123")

# Create a scheduled appointment
data = json.dumps({
    "paciente_id": 1,
    "servicio_id": 1,
    "empleado_id": 1,
    "sucursal_id": 2,
    "estado_cita_id": 1,  # Programada
    "fecha_hora": "2026-05-12T11:00:00",
    "duracion_minutos": 30
}).encode()

req = urllib.request.Request(f"{BASE}/appointments/", data=data)
req.add_header("Authorization", f"Bearer {token}")
req.add_header("Content-Type", "application/json")

r = urllib.request.urlopen(req)
result = json.loads(r.read().decode())
print(f"Created appointment ID {result['id']}, estado={result['estado_cita_id']} ({result.get('estado_nombre', 'N/A')})")

# Verify in list
req2 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2&fecha_inicio=2026-05-12T00:00:00&fecha_fin=2026-05-12T23:59:59")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
apts = json.loads(r2.read().decode())
print("\nToday's appointments:")
for a in apts:
    print(f"  ID {a['id']}: estado={a['estado_cita_id']} ({a.get('estado_nombre', 'N/A')}) - {a.get('paciente_nombre', 'N/A')}")