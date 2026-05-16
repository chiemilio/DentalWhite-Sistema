#!/usr/bin/env python3
from urllib.request import Request, urlopen, build_opener, HTTPCookieProcessor
from http.cookiejar import CookieJar
import json
from datetime import date

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
print("TEST: Doctor Dashboard - Panel del Médico")
print("=" * 60)

try:
    # 1. Login
    print("\n1. LOGIN como doctor@dentalwhite.com")
    resp = post(f"{BASE_URL}/auth/login", {"email": "doctor@dentalwhite.com", "password": "doctor123"})
    data = json.loads(resp.read())
    print(f"   Response keys: {data.keys()}")
    
    token = data.get('access_token')
    user_data = data.get('user', {})
    user_id = user_data.get('id')
    role = user_data.get('role')
    
    print(f"   Token: {token[:20]}...")
    print(f"   User: id={user_id}, role={role}")
    
    headers = {'Authorization': f'Bearer {token}'}

    # 2. Consultar empleado
    print(f"\n2. GET /employees/?usuario_id={user_id}")
    req = Request(f"{BASE_URL}/employees/?usuario_id={user_id}", headers=headers)
    resp = opener.open(req)
    employees = json.loads(resp.read())
    print(f"   Empleados: {len(employees)}")
    for e in employees:
        print(f"   - ID={e.get('id')}, puesto={e.get('puesto')}, usuario_id={e.get('usuario_id')}")

    if not employees:
        print("   ERROR: No hay empleado!")
        exit(1)

    emp_id = employees[0].get('id')

    # 3. Consultar citas
    print(f"\n3. GET /appointments/?empleado_id={emp_id}")
    req = Request(f"{BASE_URL}/appointments/?empleado_id={emp_id}", headers=headers)
    resp = opener.open(req)
    appointments = json.loads(resp.read())
    print(f"   Total citas: {len(appointments)}")

    today = str(date.today())
    confirmed_today = [a for a in appointments if a.get('estado_cita_id') == 2 and a.get('fecha_hora', '').startswith(today)]

    print(f"\n   Citas HOY ({today}) confirmadas: {len(confirmed_today)}")
    for a in confirmed_today:
        print(f"   - ID={a.get('id')}, fecha_hora={a.get('fecha_hora')}, duracion={a.get('duracion_minutos')}")

    print("\n" + "=" * 60)
    print("VARIABLES FRONTEND:")
    print(f"  user.id = {user_id}")
    print(f"  selectedDate = {today}")
    print(f"  filteredAppointments = estado_cita_id==2 AND fecha_hora.startswith(selectedDate)")
    print(f"  Resultado esperado: {len(confirmed_today)} citas")
    print("=" * 60)

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()