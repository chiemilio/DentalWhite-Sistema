import urllib.request, json

# Test via nginx on port 80
try:
    req = urllib.request.Request("http://localhost/api/v1/catalogos/horarios")
    resp = urllib.request.urlopen(req)
    data = resp.read()
    print(f"nginx -> backend: Status {resp.status}, Type: {resp.headers.get('Content-Type')}")
    print(f"Raw starts with: {data[:50]}")
    parsed = json.loads(data)
    print(f"OK - {len(parsed)} items")
except json.JSONDecodeError:
    print(f"JSON ERROR - not JSON! Starts with: {data[:100]}")
except Exception as e:
    print(f"Error: {e}")
