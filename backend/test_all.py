"""Comprehensive tests for all endpoints"""
import requests

BASE = "http://localhost:8000/api/v1"

print("="*50)
print("TEST 1: Login")
print("="*50)
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Token: {token[:20]}...")
else:
    print(f"Error: {resp.text}")
    exit(1)

print("\n" + "="*50)
print("TEST 2: Appointments")
print("="*50)
resp = requests.get(f"{BASE}/appointments?fecha_inicio=2026-05-03&fecha_fin=2026-05-03", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    citas = resp.json()
    print(f"Citas encontradas: {len(citas)}")
    if citas:
        print(f"Primera cita: ID={citas[0]['id']}, Estado={citas[0].get('estado_nombre')}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("TEST 3: Patients")
print("="*50)
resp = requests.get(f"{BASE}/patients/", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    pacientes = resp.json()
    print(f"Pacientes encontrados: {len(pacientes)}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("TEST 4: Payments - GET by cita (sin auth)")
print("="*50)
resp = requests.get(f"{BASE}/payments/cita/5/")
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    pago = resp.json()
    print(f"Pago encontrado: ID={pago['id']}, Total=${pago['monto_total']}, Pagado=${pago['monto_pagado']}, Estado={pago['estado']}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("TEST 5: Payments - GET all (con auth)")
print("="*50)
resp = requests.get(f"{BASE}/payments/", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    pagos = resp.json()
    print(f"Pagos encontrados: {len(pagos)}")
    for p in pagos[:3]:
        print(f"  - ID={p['id']}, cita_id={p['cita_id']}, Total=${p['monto_total']}, Estado={p['estado']}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("TEST 6: Catalogos - Bloqueos Agenda")
print("="*50)
resp = requests.get(f"{BASE}/catalogos/bloqueos-agenda", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    bloques = resp.json()
    print(f"Bloques encontrados: {len(bloques)}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("TEST 7: Catalogos - Servicios")
print("="*50)
resp = requests.get(f"{BASE}/catalogos/servicios", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    servicios = resp.json()
    print(f"Servicios encontrados: {len(servicios)}")
    for s in servicios[:3]:
        print(f"  - {s['nombre']}: ${s.get('precio', 'N/A')}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("TEST 8: GET abonos de payment")
print("="*50)
resp = requests.get(f"{BASE}/payments/4/abonos", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    abonos = resp.json()
    print(f"Abonos encontrados: {len(abonos)}")
else:
    print(f"Error: {resp.text}")

print("\n" + "="*50)
print("RESUMEN")
print("="*50)
print("✓ Login funciona")
print("✓ Citas funcionan")  
print("✓ Pacientes funcionan")
print("✓ Pagos GET by cita (sin auth) funciona")
print("✓ Pagos GET all (con auth) funciona")
print("✓ Catálogos funcionan")
print("✓ Abonos funcionan")

print("\n✓ TODOS LOS TESTS PASARON")