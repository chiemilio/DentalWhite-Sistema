"""Test PUT creates partial payment"""
import requests

BASE = "http://localhost:8000/api/v1"

# Login
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# PUT - increase from 750 to 800 (+50 diferencia)
print("=== PUT /payments/4/ (750 -> 800) ===")
resp = requests.put(f"{BASE}/payments/4/", json={"monto_pagado": 800}, headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    p = resp.json()
    print(f"Pagado: ${p['monto_pagado']}, Restante: ${p['monto_restante']}")

# Check abonos
print("\n=== ABONOS ===")
resp = requests.get(f"{BASE}/payments/4/abonos", headers=headers)
print(f"Status: {resp.status_code}")
abonos = resp.json()
print(f"Abonos: {len(abonos)}")
for a in abonos:
    print(f"  - {a['numero_recibo']}: ${a['monto']}")

# Verify payment
print("\n=== PAYMENT ===")
resp = requests.get(f"{BASE}/payments/cita/5/")
print(f"Pagado: ${resp.json()['monto_pagado']}")