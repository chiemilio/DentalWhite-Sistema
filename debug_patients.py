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
    try:
        r = urllib.request.urlopen(req)
        return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()[:300]}

def api_post(token, endpoint, data):
    data_enc = json.dumps(data).encode()
    req = urllib.request.Request(f"{BASE}{endpoint}", data=data_enc)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        r = urllib.request.urlopen(req)
        return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()[:300]}

token = login("recepcion@dentalwhite.com", "recep123")
print("Logged in as recepcion")

print("\n1. GET /catalogos/roles")
roles = api_get(token, "/catalogos/roles")
for r in roles:
    print(f"   {r['id']}: {r['nombre']}")

print("\n2. POST /patients/ with valid data")
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

print("\n3. GET /employees/")
employees = api_get(token, "/employees/")
print(f"   OK: {len(employees)} employees")