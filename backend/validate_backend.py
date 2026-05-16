#!/usr/bin/env python3
"""
Validar comunicación backend - frontend
"""
from urllib.request import Request, urlopen, build_opener, HTTPCookieProcessor
from http.cookiejar import CookieJar
import json

BASE_URL = "http://localhost:8000/api/v1"

cj = CookieJar()
opener = build_opener(HTTPCookieProcessor(cj))

def post(url, data):
    req = Request(url, data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
    return opener.open(req)

def get(url):
    req = Request(url, headers={'Content-Type': 'application/json'})
    return opener.open(req)

print("=" * 60)
print("VALIDACIÓN BACKEND - FRONTEND")
print("=" * 60)

try:
    # 1. Login
    print("\n1. LOGIN")
    resp = post(f"{BASE_URL}/auth/login", {"email": "doctor@dentalwhite.com", "password": "doctor123"})
    data = json.loads(resp.read())
    token = data.get('access_token')
    user_id = data.get('user', {}).get('id')
    print(f"   user.id = {user_id}")

    headers = {'Authorization': f'Bearer {token}'}

    # 2. Consultar empleado
    print(f"\n2. GET /employees/?usuario_id={user_id}")
    req = Request(f"{BASE_URL}/employees/?usuario_id={user_id}", headers=headers)
    resp = opener.open(req)
    employees = json.loads(resp.read())
    print(f"   Response: {json.dumps(employees, indent=4, default=str)}")

    emp_id = employees[0]['id'] if employees else None

    # 3. Consultar citas con usuario_id (como el frontend)
    print(f"\n3. GET /appointments/?usuario_id={user_id}")
    req = Request(f"{BASE_URL}/appointments/?usuario_id={user_id}", headers=headers)
    resp = opener.open(req)
    citas = json.loads(resp.read())
    print(f"   Total citas: {len(citas)}")

    # Filtrar confirmadas de hoy
    from datetime import date
    today = date.today().isoformat()
    confirmadas_hoy = [c for c in citas if c.get('estado_cita_id') == 2 and today in str(c.get('fecha_hora', ''))]

    print(f"\n   Citas HOY confirmadas: {len(confirmadas_hoy)}")
    for c in confirmadas_hoy:
        print(f"   - {c.get('fecha_hora')}")

    # 4. Consultar citas con empleado_id
    if emp_id:
        print(f"\n4. GET /appointments/?empleado_id={emp_id}")
        req = Request(f"{BASE_URL}/appointments/?empleado_id={emp_id}", headers=headers)
        resp = opener.open(req)
        citas2 = json.loads(resp.read())
        print(f"   Total citas: {len(citas2)}")

        confirmadas_hoy2 = [c for c in citas2 if c.get('estado_cita_id') == 2 and today in str(c.get('fecha_hora', ''))]
        print(f"\n   Citas HOY confirmadas: {len(confirmadas_hoy2)}")
        for c in confirmadas_hoy2:
            print(f"   - {c.get('fecha_hora')}")

    print("\n" + "=" * 60)
    print("RESULTADO:")
    print(f"  Backend recibe usuario_id={user_id}")
    print(f"  Backend filtra por empleado_id={emp_id}")
    print(f"  Frontend debería recibir: {len(confirmadas_hoy2)} citas de hoy")
    print("=" * 60)

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()