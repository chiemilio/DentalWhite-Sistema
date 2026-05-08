"""Test PUT payment"""
import requests

BASE = "http://localhost:8000/api/v1"

# Login
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Test PUT with trailing slash
print("=== PUT /payments/4/ ===")
resp = requests.put(f"{BASE}/payments/4/", json={"monto_pagado": 750}, headers=headers)
print(f"Status: {resp.status_code}")
print(resp.json() if resp.status_code == 200 else resp.text)

# Verify
print("\n=== GET /payments/cita/5/ ===")
resp = requests.get(f"{BASE}/payments/cita/5/")
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    p = resp.json()
    print(f"Pagado: ${p['monto_pagado']}, Restante: ${p['monto_restante']}")