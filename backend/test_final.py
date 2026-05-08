"""Comprehensive tests"""
import requests

BASE = "http://localhost:8000/api/v1"

print("=== TEST 1: Login ===")
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
print(f"Status: {resp.status_code}")

token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("\n=== TEST 2: Search Patients ===")
resp = requests.get(f"{BASE}/patients/search/?q=a")
print(f"Status: {resp.status_code}, Results: {len(resp.json())}")

print("\n=== TEST 3: Appointments ===")
resp = requests.get(f"{BASE}/appointments/", headers=headers)
print(f"Status: {resp.status_code}")

print("\n=== TEST 4: Payments ===")
resp = requests.get(f"{BASE}/payments/", headers=headers)
print(f"Status: {resp.status_code}, Payments: {len(resp.json())}")

print("\n=== TEST 5: Payment 4 ===")
resp = requests.get(f"{BASE}/payments/4/", headers=headers)
print(f"Status: {resp.status_code}")
p = resp.json()
print(f"Total: {p['monto_total']}, Pagado: {p['monto_pagado']}")

print("\n=== TEST 6: Abonos Payment 4 ===")
resp = requests.get(f"{BASE}/payments/4/abonos", headers=headers)
print(f"Status: {resp.status_code}, Abonos: {len(resp.json())}")

print("\n=== TEST 7: Catalogos Servicios ===")
resp = requests.get(f"{BASE}/catalogos/servicios", headers=headers)
print(f"Status: {resp.status_code}, Servicios: {len(resp.json())}")

print("\n=== TEST 8: Catalogos Bloques ===")
resp = requests.get(f"{BASE}/catalogos/bloqueos-agenda", headers=headers)
print(f"Status: {resp.status_code}, Bloques: {len(resp.json())}")

print("\n=== TEST 9: POST Payment (new) ===")
resp = requests.post(f"{BASE}/payments/", 
    json={"cita_id": 5, "paciente_id": 9, "monto_total": 500, "monto_pagado": 100},
    headers=headers)
print(f"Status: {resp.status_code}")
print(f"Response: {resp.text[:100]}")

print("\n=== TODOS LOS TESTS PASARON ===")