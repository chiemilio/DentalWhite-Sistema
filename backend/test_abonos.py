"""Test get abonos"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("GET /api/v1/payments/1/abonos:")
resp = requests.get(f"{BASE}/payments/1/abonos", headers=headers)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    print(resp.json())