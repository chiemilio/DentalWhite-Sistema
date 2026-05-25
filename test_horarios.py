import urllib.request, json
try:
    req = urllib.request.Request("http://localhost:8000/api/v1/catalogos/horarios")
    resp = urllib.request.urlopen(req)
    print("Status:", resp.status)
    print("Content-Type:", resp.headers.get("Content-Type", ""))
    data = json.loads(resp.read())
    print("Count:", len(data))
    if data:
        print("First item keys:", list(data[0].keys()))
        print("First item:", data[0])
except Exception as e:
    print("Error:", e)
