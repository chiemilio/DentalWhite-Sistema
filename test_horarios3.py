import urllib.request, json
try:
    req = urllib.request.Request("http://localhost/api/v1/catalogos/horarios")
    resp = urllib.request.urlopen(req)
    print("Status:", resp.status)
    print("Content-Type:", resp.headers.get("Content-Type", ""))
    data = resp.read()
    print("Raw prefix:", str(data[:80]))
    json_data = json.loads(data)
    print("Count:", len(json_data))
except Exception as e:
    print("Error:", e)
