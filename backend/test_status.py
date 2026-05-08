"""Check payment 1 and abonos"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get payment
print("=== PAYMENT 1 ===")
resp = requests.get(f"{BASE}/payments/1", headers=headers)
if resp.status_code == 200:
    p = resp.json()
    print(f"monto_total: ${p['monto_total']}")
    print(f"monto_pagado: ${p['monto_pagado']}")
    print(f"monto_restante: ${p['monto_restante']}")
    print(f"estado: {p['estado']}")

# Get abonos
print("\n=== ABONOS ===")
resp = requests.get(f"{BASE}/payments/1/abonos", headers=headers)
print(resp.json())