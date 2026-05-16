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
    req.get_method = lambda: "PUT"
    try:
        r = urllib.request.urlopen(req)
        return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()[:200]}

token = login("recepcion@dentalwhite.com", "recep123")

print("=== RECEPTIONIST DASHBOARD TEST ===\n")

# 1. Check appointments for today
print("1. Citas del dia (2026-05-11):")
apts = api_get(token, "/appointments?sucursal_id=2&fecha_inicio=2026-05-11T00:00:00&fecha_fin=2026-05-11T23:59:59")
for a in apts:
    hora = a.get('hora') or (a.get('fecha_hora', '').split('T')[1] if a.get('fecha_hora') else 'N/A')
    print(f"   [{hora}] {a.get('paciente_nombre', 'N/A')} - {a.get('servicio_nombre', 'N/A')} - {a.get('estado_nombre', 'N/A')}")

# 2. Test confirm button
scheduled = next((a for a in apts if a.get('estado_cita_id') == 1), None)
if scheduled:
    print(f"\n2. Confirmando cita ID {scheduled['id']}...")
    result = api_put(token, f"/appointments/{scheduled['id']}/", {"estado_cita_id": 2})
    if "error" in result:
        print(f"   FAIL: {result}")
    else:
        print(f"   OK: Estado = '{result.get('estado_nombre')}'")
else:
    print("\n2. No hay citas programadas")

# 3. Test cancel button
confirmed = next((a for a in apts if a.get('estado_cita_id') == 2), None)
if confirmed:
    print(f"\n3. Cancelando cita ID {confirmed['id']}...")
    result = api_put(token, f"/appointments/{confirmed['id']}/", {"estado_cita_id": 3})
    if "error" in result:
        print(f"   FAIL: {result}")
    else:
        print(f"   OK: Estado = '{result.get('estado_nombre')}'")
else:
    print("\n3. No hay citas confirmadas")

# 4. Verify final state
print("\n4. Estado final:")
apts2 = api_get(token, "/appointments?sucursal_id=2&fecha_inicio=2026-05-11T00:00:00&fecha_fin=2026-05-11T23:59:59")
for a in apts2:
    hora = a.get('hora') or (a.get('fecha_hora', '').split('T')[1] if a.get('fecha_hora') else 'N/A')
    print(f"   [{hora}] {a.get('paciente_nombre', 'N/A')} - {a.get('estado_nombre', 'N/A')}")

print("\n5. Pacientes:", len(api_get(token, "/patients/")))
print("6. Servicios:", len(api_get(token, "/catalogos/servicios")))
print("7. Doctores:", len(api_get(token, "/employees/")))

print("\n=== TEST COMPLETED ===")