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

def api_put(token, endpoint, data):
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
print("Logged in as recepcion")

# Get appointments
print("\n1. Appointments ANTES:")
apts = api_get(token, "/appointments?sucursal_id=2&fecha_inicio=2026-05-10T00:00:00&fecha_fin=2026-05-10T23:59:59")
for a in apts:
    print(f"   ID {a['id']}: estado={a['estado_cita_id']} ({a.get('estado_nombre', 'N/A')})")

# Find a scheduled appointment
scheduled = next((a for a in apts if a['estado_cita_id'] == 1), None)
if scheduled:
    print(f"\n2. Confirmando cita ID {scheduled['id']}...")
    result = api_put(token, f"/appointments/{scheduled['id']}", {"estado_cita_id": 2})
    if "error" in result:
        print(f"   FAIL: {result}")
    else:
        print(f"   OK: estado_cita_id = {result.get('estado_cita_id')}")
else:
    print("\n2. No hay citas programadas para confirmar")

# Find a confirmed appointment  
confirmed = next((a for a in apts if a['estado_cita_id'] == 2), None)
if confirmed:
    print(f"\n3. Cancelando cita ID {confirmed['id']}...")
    result = api_put(token, f"/appointments/{confirmed['id']}", {"estado_cita_id": 3})
    if "error" in result:
        print(f"   FAIL: {result}")
    else:
        print(f"   OK: estado_cita_id = {result.get('estado_cita_id')}")

print("\n4. Appointments DESPUES:")
apts2 = api_get(token, "/appointments?sucursal_id=2&fecha_inicio=2026-05-10T00:00:00&fecha_fin=2026-05-10T23:59:59")
for a in apts2:
    print(f"   ID {a['id']}: estado={a['estado_cita_id']} ({a.get('estado_nombre', 'N/A')})")