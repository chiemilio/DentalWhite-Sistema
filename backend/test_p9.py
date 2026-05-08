"""Test PUT payment 9"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# First check payment 9
print("=== ANTES ===")
resp = requests.get(f"{BASE}/payments/9/")
p = resp.json()
print(f"Total: ${p['monto_total']}, Pagado: ${p['monto_pagado']}")

# Update payment 9 - increase to 10000
print("\n=== PUT (5000 -> 10000) ===")
resp = requests.put(f"{BASE}/payments/9/", json={"monto_pagado": 10000}, headers=headers)
print(f"Status: {resp.status_code}")

# Check after
print("\n=== DESPUÉS ===")
resp = requests.get(f"{BASE}/payments/9/")
p = resp.json()
print(f"Total: ${p['monto_total']}, Pagado: ${p['monto_pagado']}, Restante: ${p['monto_restante']}")

# Check abonos
print("\n=== ABONOS ===")
resp = requests.get(f"{BASE}/payments/9/abonos", headers=headers)
abonos = resp.json()
print(f"Total: {len(abonos)}")
for a in abonos:
    print(f"  ID={a['id']}, numero={a['numero_recibo']}, monto=${a['monto']}")