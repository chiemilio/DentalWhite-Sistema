"""
Test completo del Panel del Médico
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_doctor_panel():
    print("=== TEST DOCTOR PANEL ===\n")
    
    # Login como doctor
    print("1. Login como doctor...")
    login_data = {
        "email": "doctor@dentalwhite.com",
        "password": "doctor123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=10)
        if response.status_code == 200:
            token = response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            user_data = response.json().get("user", {})
            print(f"   ✓ Login exitoso")
            print(f"   User: {user_data.get('name')} - {user_data.get('email')}")
            print(f"   User ID: {user_data.get('id')}")
        else:
            print(f"   ✗ Login fallido: {response.status_code}")
            return
    except Exception as e:
        print(f"   ✗ Error de conexión: {e}")
        return
    
    # Test: Obtener empleados
    print("\n2. Obtener empleado del doctor...")
    try:
        response = requests.get(f"{BASE_URL}/employees/?usuario_id={user_data.get('id')}", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            employees = response.json()
            print(f"   Empleados encontrados: {len(employees)}")
            if employees:
                emp = employees[0]
                print(f"   Empleado ID: {emp.get('id')}")
                print(f"   Puesto: {emp.get('puesto')}")
                emp_id = emp.get('id')
            else:
                print("   ✗ No hay empleado para este usuario")
                emp_id = None
        else:
            print(f"   ✗ Error: {response.text[:200]}")
            emp_id = None
    except Exception as e:
        print(f"   ✗ Error: {e}")
        emp_id = None
    
    if not emp_id:
        # Obtener primer empleado doctor
        print("\n   Buscando empleados doctores...")
        response = requests.get(f"{BASE_URL}/employees/", headers=headers, timeout=10)
        if response.status_code == 200:
            all_employees = response.json()
            doctors = [e for e in all_employees if e.get('puesto') == 'Doctor' or 'doctor' in str(e.get('puesto', '')).lower()]
            if doctors:
                emp_id = doctors[0].get('id')
                print(f"   Primer doctor encontrado: {emp_id}")
    
    if emp_id:
        # Test: Obtener citas del empleado
        print(f"\n3. Obtener citas del empleado {emp_id}...")
        try:
            response = requests.get(f"{BASE_URL}/appointments/?empleado_id={emp_id}", headers=headers, timeout=10)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                appointments = response.json()
                print(f"   Citas encontradas: {len(appointments)}")
                
                # Mostrar todas las citas
                print("\n   Citas:")
                for apt in appointments[:10]:  # Mostrar max 10
                    print(f"   - ID {apt.get('id')}: fecha={apt.get('fecha_hora')}, estado={apt.get('estado_cita_id')}, paciente={apt.get('paciente_nombre')}")
                
                # Filtrar por confirmadas
                confirmed = [a for a in appointments if a.get('estado_cita_id') == 2]
                print(f"\n   Citas confirmadas (estado=2): {len(confirmed)}")
                
            else:
                print(f"   ✗ Error: {response.text[:200]}")
        except Exception as e:
            print(f"   ✗ Error: {e}")
    
    # Test: Obtener todas las citas (sin filtro)
    print("\n4. Obtener TODAS las citas...")
    try:
        response = requests.get(f"{BASE_URL}/appointments/", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            all_apts = response.json()
            print(f"   Total citas en sistema: {len(all_apts)}")
            
            # Estadísticas por estado
            states = {}
            for a in all_apts:
                state = a.get('estado_cita_id')
                states[state] = states.get(state, 0) + 1
            print(f"   Por estado: {states}")
            
            # Estadísticas por empleado
            employees_count = {}
            for a in all_apts:
                emp = a.get('empleado_id')
                employees_count[emp] = employees_count.get(emp, 0) + 1
            print(f"   Por empleado: {employees_count}")
            
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print("\n=== TEST COMPLETO ===")

if __name__ == "__main__":
    test_doctor_panel()