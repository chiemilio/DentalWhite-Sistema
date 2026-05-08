"""List all payments"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("=== ALL PAYMENTS ===")
resp = requests.get(f"{BASE}/payments/", headers=headers)
print(resp.json())