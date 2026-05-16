import urllib.request, json

BASE = "http://localhost:8000/api/v1"

data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())["access_token"]

# Get appointments for today
req2 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2&fecha_inicio=2026-05-11T00:00:00&fecha_fin=2026-05-11T23:59:59")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
apts = json.loads(r2.read().decode())

print("API Response - Citas del 2026-05-11:")
print("-" * 60)
for a in apts:
    hora = a.get('hora') or (a.get('fecha_hora', '').split('T')[1] if a.get('fecha_hora') else 'N/A')
    print(f"ID {a['id']}: {hora} | estado_id={a['estado_cita_id']} | {a.get('estado_nombre', 'N/A')} | {a.get('paciente_nombre', 'N/A')}")

print("\n\nVerificando citas a las 14:00:")
for a in apts:
    hora = a.get('hora') or ''
    if '14:00' in str(hora):
        print(f"  ID {a['id']}: {hora} - {a.get('estado_nombre', 'N/A')}")