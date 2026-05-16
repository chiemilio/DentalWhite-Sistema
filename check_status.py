import urllib.request, json

BASE = "http://localhost:8000/api/v1"
data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())["access_token"]

req2 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2&fecha_inicio=2026-05-10T00:00:00&fecha_fin=2026-05-10T23:59:59")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
apts = json.loads(r2.read().decode())
for a in apts:
    print(f"ID {a['id']}: estado_cita_id={a['estado_cita_id']} ({a.get('estado_nombre', 'N/A')})")