#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test():
    print("=" * 60)
    print("TEST DIRECTO: /employees/?usuario_id=8")
    print("=" * 60)

    session = requests.Session()

    # Login
    resp = session.post(f"{BASE_URL}/auth/login", json={
        "email": "doctor@dentalwhite.com",
        "password": "doctor123"
    }, timeout=10)

    if resp.status_code != 200:
        print(f"Login ERROR: {resp.status_code}")
        return

    print(f"Login OK: user_id={resp.json().get('id')}")
    headers = {"Authorization": f"Bearer {session.cookies.get('access_token')}"}

    # Consultar empleados
    print("\nGET /employees/?usuario_id=8")
    resp = session.get(f"{BASE_URL}/employees/?usuario_id=8", headers=headers, timeout=10)
    print(f"Status: {resp.status_code}")

    if resp.status_code == 200:
        data = resp.json()
        print(f"Response: {json.dumps(data, indent=2, default=str)}")
    else:
        print(f"Error: {resp.text}")

    # Consultar citas
    print("\nGET /appointments/?empleado_id=4")
    resp = session.get(f"{BASE_URL}/appointments/?empleado_id=4", headers=headers, timeout=10)
    print(f"Status: {resp.status_code}")

    if resp.status_code == 200:
        citas = resp.json()
        print(f"Total citas: {len(citas)}")
        for c in citas[:5]:
            print(f"  - id={c.get('id')}, fecha_hora={c.get('fecha_hora')}, estado={c.get('estado_cita_id')}")
    else:
        print(f"Error: {resp.text}")

if __name__ == "__main__":
    test()