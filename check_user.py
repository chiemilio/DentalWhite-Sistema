import urllib.request, json

BASE = "http://localhost:8000/api/v1"

data = json.dumps({"email": "recepcion@dentalwhite.com", "password": "recep123"}).encode()
req = urllib.request.Request(f"{BASE}/auth/login", data=data)
req.add_header("Content-Type", "application/json")
r = urllib.request.urlopen(req)
result = json.loads(r.read().decode())
token = result["access_token"]
print("Token received:", token[:50], "...")

# Get user info
req2 = urllib.request.Request(f"{BASE}/auth/me")
req2.add_header("Authorization", f"Bearer {token}")
r2 = urllib.request.urlopen(req2)
user = json.loads(r2.read().decode())
print("User full response:", json.dumps(user, indent=2))

# Check what roles exist
req3 = urllib.request.Request(f"{BASE}/catalogos/roles")
req3.add_header("Authorization", f"Bearer {token}")
r3 = urllib.request.urlopen(req3)
roles = json.loads(r3.read().decode())
print("\nRoles:", json.dumps(roles, indent=2))