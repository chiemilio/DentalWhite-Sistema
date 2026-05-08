"""Test payments by cita 5"""
import requests

BASE = "http://localhost:8000/api/v1"

# Try GET without auth
print("=== GET /payments/cita/5 (no auth) ===")
resp = requests.get(f"{BASE}/payments/cita/5")
print(f"Status: {resp.status_code}")
print(resp.text)

# Try with auth  
print("\n=== GET /payments/ (with auth) ===")
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
if resp.status_code == 200:
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{BASE}/payments/", headers=headers)
    print(f"Status: {resp.status_code}")
    print(resp.json()[:2] if resp.status_code == 200 else resp.text)