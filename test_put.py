import urllib.request, json

BASE = "http://localhost:8000/api/v1"

def login(email, password):
    data = json.dumps({"email": email, "password": password}).encode()
    req = urllib.request.Request(f"{BASE}/auth/login", data=data)
    req.add_header("Content-Type", "application/json")
    r = urllib.request.urlopen(req)
    return json.loads(r.read().decode())["access_token"]

token = login("recepcion@dentalwhite.com", "recep123")

# Test PUT without trailing slash
data_enc = json.dumps({"estado_cita_id": 2}).encode()
req = urllib.request.Request(f"{BASE}/appointments/17", data=data_enc)
req.add_header("Authorization", f"Bearer {token}")
req.add_header("Content-Type", "application/json")
req.get_method = lambda: "PUT"

try:
    r = urllib.request.urlopen(req)
    print("PUT /appointments/17: OK")
    print(json.loads(r.read().decode()))
except urllib.error.HTTPError as e:
    print(f"PUT /appointments/17: FAIL {e.code}")
    print(e.read().decode()[:300])

# Test PUT with trailing slash
data_enc = json.dumps({"estado_cita_id": 2}).encode()
req2 = urllib.request.Request(f"{BASE}/appointments/17/", data=data_enc)
req2.add_header("Authorization", f"Bearer {token}")
req2.add_header("Content-Type", "application/json")
req2.get_method = lambda: "PUT"

try:
    r2 = urllib.request.urlopen(req2)
    print("\nPUT /appointments/17/: OK")
    print(json.loads(r2.read().decode()))
except urllib.error.HTTPError as e:
    print(f"\nPUT /appointments/17/: FAIL {e.code}")
    print(e.read().decode()[:300])