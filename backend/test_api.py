import requests

resp = requests.get("http://localhost:8000/openapi.json")
openapi = resp.json()
paths = openapi.get("paths", {})
print("=== API Paths with pago ===")
for path in paths:
    if "pago" in path.lower():
        print(f"{path}")