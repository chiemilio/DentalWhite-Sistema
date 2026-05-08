"""Debug PUT error"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Try PUT with explicit metodo_pago
try:
    resp = requests.put(f"{BASE}/payments/4/", json={"monto_pagado": 800, "metodo_pago": "EFECTIVO"}, headers=headers)
    print(f"Status: {resp.status_code}")
    print(resp.text)
except Exception as e:
    print(f"Error: {e}")