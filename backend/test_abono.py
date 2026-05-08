"""Register partial payment"""
import requests

BASE = "http://localhost:8000/api/v1"

# Login
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Update payment - register partial payment
print("PUT /api/v1/payments/1 - Registrar abono de $250:")
resp = requests.put(f"{BASE}/payments/1", 
    json={"monto_pagado": 250.00, "metodo_pago": "TARJETA_DEBITO"},
    headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    p = resp.json()
    print(f"OK! Estado: {p.get('estado')}, Pagado: ${p.get('monto_pagado')}, Restante: ${p.get('monto_restante')}")
else:
    print(f"Error: {resp.text}")

# Verify in database
print("\nVerificando en base de datos:")
resp2 = requests.get(f"{BASE}/payments/1", headers=headers)
p2 = resp2.json()
print(f"Estado: {p2.get('estado')}, Total: ${p2.get('monto_total')}, Pagado: ${p2.get('monto_pagado')}, Restante: ${p2.get('monto_restante')}")