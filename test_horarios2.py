import urllib.request, json
try:
    req = urllib.request.Request("http://localhost:8000/api/v1/catalogos/horarios")
    resp = urllib.request.urlopen(req)
    print("Direct 8000: Status", resp.status, "Count:", len(json.loads(resp.read())))
except Exception as e:
    print("Direct 8000 Error:", e)

try:
    req2 = urllib.request.Request("http://localhost/api/v1/catalogos/horarios")
    resp2 = urllib.request.urlopen(req2)
    data = resp2.read()
    print("Via nginx 80: Status", resp2.status, "Content-Length:", len(data), "Prefix:", str(data[:50]))
except Exception as e:
    print("Via nginx 80 Error:", e)
