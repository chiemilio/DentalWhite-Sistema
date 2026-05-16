"""
Test completo del sistema de dashboards
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_appointments():
    print("=== TEST: Appointments API ===")
    
    # Login primero
    login_data = {
        "email": "doctor@dentalwhite.com",
        "password": "doctor123"
    }
    
    try:
        # Intentar login
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            print(f"✓ Login exitoso")
        else:
            print(f"✗ Login fallido: {response.status_code}")
            headers = {}
    except:
        print("✗ No se puede conectar al backend")
        return
    
    # Test 1: Obtener citas sin filtro
    print("\n1. Obtener todas las citas:")
    try:
        response = requests.get(f"{BASE_URL}/appointments/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            citas = response.json()
            print(f"   Citas encontradas: {len(citas)}")
            for c in citas[:3]:
                print(f"   - Cita {c.get('id')}: estado={c.get('estado_cita_id')}, empleado={c.get('empleado_id')}")
        else:
            print(f"   Error: {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: Obtener citas por empleado
    print("\n2. Obtener citas por empleado_id=1:")
    try:
        response = requests.get(f"{BASE_URL}/appointments/?empleado_id=1", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            citas = response.json()
            print(f"   Citas encontradas: {len(citas)}")
        else:
            print(f"   Error: {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 3: Obtener citas por estado (confirmada=2)
    print("\n3. Obtener citas confirmadas (estado_id=2):")
    try:
        response = requests.get(f"{BASE_URL}/appointments/?estado_id=2", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            citas = response.json()
            print(f"   Citas confirmadas: {len(citas)}")
        else:
            print(f"   Error: {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 4: Obtener citas por sucursal
    print("\n4. Obtener citas por sucursal_id=1:")
    try:
        response = requests.get(f"{BASE_URL}/appointments/?sucursal_id=1", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            citas = response.json()
            print(f"   Citas de sucursal 1: {len(citas)}")
        else:
            print(f"   Error: {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 5: Combinar filtros
    print("\n5. Obtener citas por fecha, sucursal y estado:")
    try:
        params = "sucursal_id=1&fecha_inicio=2026-05-08T00:00:00&fecha_fin=2026-05-08T23:59:59"
        response = requests.get(f"{BASE_URL}/appointments/?{params}", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            citas = response.json()
            print(f"   Citas del día: {len(citas)}")
        else:
            print(f"   Error: {response.text[:200]}")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n=== TEST COMPLETO ===")

if __name__ == "__main__":
    test_appointments()