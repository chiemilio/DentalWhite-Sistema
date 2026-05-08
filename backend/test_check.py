"""Check payment and abonos"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get all payments
resp = requests.get(f"{BASE}/payments/", headers=headers)
pagos = resp.json()
print("=== PAGOS ===")
for p in pagos:
    print(f"ID={p['id']}, cita_id={p['cita_id']}, total=${p['monto_total']}, pagado=${p['monto_pagado']}, restante=${p['monto_restante']}, estado={p['estado']}")

# Check payment 4
print("\n=== PAYMENT 4 ===")
resp = requests.get(f"{BASE}/payments/4/")
p = resp.json()
print(f"Total: ${p['monto_total']}, Pagado: ${p['monto_pagado']}, Restante: ${p['monto_restante']}")

# Check abonos
print("\n=== ABONOS ===")
resp = requests.get(f"{BASE}/payments/4/abonos", headers=headers)
abonos = resp.json()
print(f"Total abonos: {len(abonos)}")
for a in abonos:
    print(f"  ID={a['id']}, numero={a['numero_recibo']}, monto=${a['monto']}")