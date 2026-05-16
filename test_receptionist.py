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

print("=== Testing Receptionist Panel ===\n")

# Login as recepcion
print("1. Login as recepcion@dentalwhite.com")
try:
    token = login("recepcion@dentalwhite.com", "recep123")
    print("   SUCCESS: Login OK\n")
except Exception as e:
    print(f"   FAIL: {e}\n")
    exit(1)

# Test appointments
print("2. Get appointments (sucursal_id=2, fecha=2026-05-10)")
try:
    data = api_get(token, "/appointments?sucursal_id=2&fecha_inicio=2026-05-10T00:00:00&fecha_fin=2026-05-10T23:59:59")
    print(f"   SUCCESS: {len(data)} appointments found")
    for apt in data[:5]:
        print(f"   - ID {apt['id']}: {apt['fecha_hora']} - estado={apt['estado_cita_id']}")
    print()
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}\n")

# Test patients
print("3. Get patients")
try:
    data = api_get(token, "/patients/")
    print(f"   SUCCESS: {len(data)} patients found")
    for p in data[:3]:
        print(f"   - ID {p['id']}: {p.get('usuario_nombre', 'N/A')}")
    print()
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}\n")

# Test catalogos
print("4. Get catalogos (servicios)")
try:
    data = api_get(token, "/catalogos/servicios")
    print(f"   SUCCESS: {len(data)} servicios found")
    for s in data[:3]:
        print(f"   - ID {s['id']}: {s['nombre']}")
    print()
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}\n")

# Test catalogos sucursales
print("5. Get catalogos (sucursales)")
try:
    data = api_get(token, "/catalogos/sucursales")
    print(f"   SUCCESS: {len(data)} sucursales found")
    for s in data:
        print(f"   - ID {s['id']}: {s['nombre']}")
    print()
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}\n")

# Test patient search
print("6. Search patients")
try:
    data = api_get(token, "/patients/search/?q=paciente")
    print(f"   SUCCESS: {len(data)} patients found")
    for p in data[:3]:
        print(f"   - ID {p['id']}: {p.get('usuario_nombre', 'N/A')}")
    print()
except urllib.error.HTTPError as e:
    print(f"   FAIL: {e.code} - {e.read().decode()[:200]}\n")

# Test create appointment
print("7. Create appointment (POST /appointments)")
# First get a patient and service
try:
    patients = api_get(token, "/patients/")
    services = api_get(token, "/catalogos/servicios")
    if patients and services:
        patient_id = patients[0]["id"]
        service_id = services[0]["id"]
        new_apt = api_post(token, "/appointments/", {
            "paciente_id": patient_id,
            "empleado_id": 1,
            "servicio_id": service_id,
            "sucursal_id": 2,
            "estado_cita_id": 1,
            "fecha_hora": "2026-05-12T10:00:00",
            "duracion_minutos": 30
        })
        if "error" in new_apt:
            print(f"   FAIL: {new_apt['error']} - {new_apt['detail']}\n")
        else:
            print(f"   SUCCESS: Created appointment ID {new_apt['id']}\n")
except Exception as e:
    print(f"   FAIL: {e}\n")

print("=== Tests completed ===")