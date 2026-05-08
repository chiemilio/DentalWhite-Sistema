"""Test payment endpoints"""
import requests

BASE = "http://localhost:8000/api/v1"

# Login
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Create NEW payment with different cita_id
print("POST /api/v1/payments/ (new payment):")
resp2 = requests.post(f"{BASE}/payments/", 
    json={"cita_id": 23, "paciente_id": 1, "monto_total": 300.0, "monto_pagado": 0, "metodo_pago": "TARJETA_CREDITO"},
    headers=headers)
print(f"Status: {resp2.status_code}")
if resp2.status_code in (200, 201):
    p = resp2.json()
    print(f"OK! Payment ID: {p.get('id')}, Estado: {p.get('estado')}")
else:
    print(f"Error: {resp2.text[:100]}")

# GET by ID
print("\nGET /api/v1/payments/1:")
resp3 = requests.get(f"{BASE}/payments/1", headers=headers)
print(f"Status: {resp3.status_code}")
if resp3.status_code == 200:
    p = resp3.json()
    print(f"Estado={p.get('estado')}, Total={p.get('monto_total')}, Pagado={p.get('monto_pagado')}")

# GET by cita
print("\nGET /api/v1/pagos/cita/24:")
resp4 = requests.get(f"{BASE}/pagos/cita/24", headers=headers)
print(f"Status: {resp4.status_code}")
if resp4.status_code == 200:
    p = resp4.json()
    print(f"Estado={p.get('estado')}, Total={p.get('monto_total')}")