"""Find payment by cita"""
import requests

BASE = "http://localhost:8000/api/v1"

resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@dentalwhite.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get payment by cita 24
print("=== PAYMENTS FOR CITA 24 ===")
resp = requests.get(f"{BASE}/payments/cita/24", headers=headers)
print(resp.json())

print("\n=== PAYMENTS FOR CITA 23 ===")
resp = requests.get(f"{BASE}/payments/cita/23", headers=headers)
print(resp.json())