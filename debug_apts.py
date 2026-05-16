import urllib.request, json

BASE = "http://localhost:8000/api/v1"

data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
token = json.loads(r.read().decode())["access_token"]

# Test without filters
print("1. Sin filtros:")
req2 = urllib.request.Request(f"{BASE}/appointments/")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
apts = json.loads(r2.read().decode())
print(f"   Total: {len(apts)} citas")

# Test with fecha only
print("\n2. Solo con fecha_inicio/fin:")
req3 = urllib.request.Request(f"{BASE}/appointments?fecha_inicio=2026-05-11T00:00:00&fecha_fin=2026-05-11T23:59:59")
req3.add_header("Authorization", f"Bearer {token}")
r3 = urllib.request.urlopen(req3)
apts3 = json.loads(r3.read().decode())
print(f"   Total: {len(apts3)} citas")

# Test with sucursal_id
print("\n3. Con sucursal_id=2:")
req4 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2&fecha_inicio=2026-05-11T00:00:00&fecha_fin=2026-05-11T23:59:59")
req4.add_header("Authorization", f"Bearer {token}")
r4 = urllib.request.urlopen(req4)
apts4 = json.loads(r4.read().decode())
print(f"   Total: {len(apts4)} citas")

# Test with limit
print("\n4. Con limit=500:")
req5 = urllib.request.Request(f"{BASE}/appointments?sucursal_id=2&fecha_inicio=2026-05-11T00:00:00&fecha_fin=2026-05-11T23:59:59&limit=500")
req5.add_header("Authorization", f"Bearer {token}")
r5 = urllib.request.urlopen(req5)
apts5 = json.loads(r5.read().decode())
print(f"   Total: {len(apts5)} citas")
for a in apts5[:10]:
    print(f"   - ID {a['id']}: {a.get('hora', 'N/A')} | {a.get('estado_nombre', 'N/A')}")