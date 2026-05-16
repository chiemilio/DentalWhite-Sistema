import urllib.request, json

BASE = "http://localhost:8000/api/v1"

data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())["access_token"]

req2 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
apts = json.loads(r2.read().decode())

print("Citas para 2026-05-11:")
print("-" * 70)
for a in apts:
    fecha = a.get('fecha_hora', '')
    if '2026-05-11' in str(fecha):
        hora = fecha.split('T')[1] if fecha else 'N/A'
        print(f"ID {a['id']:2}: {hora} | estado_id={a['estado_cita_id']} | {a.get('estado_nombre', 'N/A'):12} | {a.get('servicio_nombre', 'N/A')}")

print("\n\nCitas para 2026-05-10:")
for a in apts:
    fecha = a.get('fecha_hora', '')
    if '2026-05-10' in str(fecha):
        hora = fecha.split('T')[1] if fecha else 'N/A'
        print(f"ID {a['id']:2}: {hora} | estado_id={a['estado_cita_id']} | {a.get('estado_nombre', 'N/A'):12} | {a.get('servicio_nombre', 'N/A')}")