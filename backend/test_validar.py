"""
Prueba del endpoint de validación de disponibilidad
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Login primero
login_data = {
    "username": "admin@clinica.com",
    "password": "admin123"
}

session = requests.Session()
resp = session.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Login: {resp.status_code}")

if resp.status_code == 200:
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Ver horarios disponibles
    print("\n=== Horarios disponibles ===")
    resp_horarios = session.get(f"{BASE_URL}/catalogos/horarios", headers=headers)
    print(f"Status: {resp_horarios.status_code}")
    print(f"Horarios: {json.dumps(resp_horarios.json()[:3], indent=2)}")
    
    # Ver citas existentes para una fecha
    print("\n=== Citas existentes ===")
    resp_citas = session.get(f"{BASE_URL}/appointments?fecha=2026-05-07", headers=headers)
    print(f"Status: {resp_citas.status_code}")
    print(f"Citas: {json.dumps(resp_citas.json()[:3], indent=2)}")
    
    # Probar validación de disponibilidad
    print("\n=== Validar disponibilidad ===")
    disponibilidad_data = {
        "fecha": "2026-05-07",
        "hora": "10:00",
        "sucursal_id": 1
    }
    resp_val = session.post(f"{BASE_URL}/catalogos/validar-disponibilidad", 
                           json=disponibilidad_data, headers=headers)
    print(f"Status: {resp_val.status_code}")
    print(f"Resultado: {json.dumps(resp_val.json(), indent=2)}")
else:
    print(f"Error login: {resp.text}")