import urllib.request, json

BASE = "http://localhost:8000/api/v1"

data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())["access_token"]

# Test without fecha filters
print("Sin filtros de fecha:")
req2 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
apts = json.loads(r2.read().decode())
for a in apts:
    fecha = a.get('fecha_hora') or a.get('fecha') or 'N/A'
    print(f"   ID {a['id']}: fecha={fecha} | {a.get('estado_nombre', 'N/A')}")