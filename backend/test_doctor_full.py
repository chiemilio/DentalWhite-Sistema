"""
TEST COMPLETO DEL PANEL DEL MÉDICO
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def print_header(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def test_doctor_panel():
    print_header("TEST DOCTOR PANEL")
    
    # 1. Login como doctor
    print("\n1. LOGIN")
    login_data = {
        "email": "doctor@dentalwhite.com",
        "password": "doctor123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            user = data.get("user", {})
            headers = {"Authorization": f"Bearer {token}"}
            print(f"   ✓ Login exitoso")
            print(f"   User ID: {user.get('id')}")
            print(f"   Email: {user.get('email')}")
            print(f"   Name: {user.get('name')}")
            print(f"   Role: {user.get('role')}")
        else:
            print(f"   ✗ Login fallido: {response.status_code}")
            return
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return
    
    # 2. Buscar empleado por usuario_id
    print_header("2. BUSCAR EMPLEADO")
    user_id = user.get('id')
    print(f"   Buscando empleado para usuario_id={user_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/employees/?usuario_id={user_id}", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            employees = response.json()
            print(f"   Empleados encontrados: {len(employees)}")
            
            if employees:
                emp = employees[0]
                emp_id = emp.get('id')
                print(f"   ✓ Empleado ID: {emp_id}")
                print(f"     Puesto: {emp.get('puesto')}")
                print(f"     Sucursal: {emp.get('sucursal_id')}")
            else:
                print("   ✗ No hay empleado para este usuario")
                emp_id = None
                
                # Buscar cualquier empleado doctor
                print("\n   Buscando empleados doctores...")
                response = requests.get(f"{BASE_URL}/employees/", headers=headers, timeout=10)
                if response.status_code == 200:
                    all_emp = response.json()
                    doctors = [e for e in all_emp if e.get('puesto') == 'Doctor']
                    print(f"   Doctores encontrados: {len(doctors)}")
                    if doctors:
                        emp_id = doctors[0].get('id')
                        print(f"   Usando primer doctor: {emp_id}")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
            emp_id = None
    except Exception as e:
        print(f"   ✗ Error: {e}")
        emp_id = None
    
    if not emp_id:
        print("   ✗ No se pudo obtener empleado")
        return
    
    # 3. Obtener TODAS las citas del empleado (sin filtros)
    print_header(f"3. CITAS DEL EMPLEADO {emp_id}")
    
    try:
        # Sin filtros
        response = requests.get(f"{BASE_URL}/appointments/?empleado_id={emp_id}", headers=headers, timeout=10)
        print(f"   Status (sin filtros): {response.status_code}")
        
        if response.status_code == 200:
            appointments = response.json()
            print(f"   Total citas: {len(appointments)}")
            
            # Mostrar cada cita
            for apt in appointments:
                fecha_hora = apt.get('fecha_hora', '')
                estado = apt.get('estado_cita_id')
                estado_nombre = apt.get('estado_nombre', '')
                paciente = apt.get('paciente_nombre', 'N/A')
                print(f"\n   Cita ID {apt.get('id')}:")
                print(f"     Fecha/Hora: {fecha_hora}")
                print(f"     Estado: {estado} ({estado_nombre})")
                print(f"     Paciente: {paciente}")
                print(f"     Servicio: {apt.get('servicio_nombre', 'N/A')}")
            
            # Resumen por estado
            print("\n   RESUMEN POR ESTADO:")
            states = {}
            for a in appointments:
                st = a.get('estado_cita_id')
                states[st] = states.get(st, 0) + 1
            for st, count in sorted(states.items()):
                print(f"     Estado {st}: {count} citas")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # 4. Probar con filtros de fecha
    print_header("4. FILTRAR POR FECHA")
    
    from datetime import date
    today = date.today().isoformat()
    print(f"   Fecha hoy: {today}")
    
    try:
        response = requests.get(
            f"{BASE_URL}/appointments/?empleado_id={emp_id}&fecha_inicio={today}T00:00:00&fecha_fin={today}T23:59:59",
            headers=headers, timeout=10
        )
        print(f"   Status (con fecha): {response.status_code}")
        
        if response.status_code == 200:
            apts = response.json()
            print(f"   Citas hoy: {len(apts)}")
            for apt in apts:
                print(f"     - ID {apt.get('id')}: estado={apt.get('estado_cita_id')}")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # 5. Probar con filtro de estado
    print_header("5. FILTRAR POR ESTADO CONFIRMADA (2)")
    
    try:
        response = requests.get(
            f"{BASE_URL}/appointments/?empleado_id={emp_id}&estado_id=2",
            headers=headers, timeout=10
        )
        print(f"   Status (estado=2): {response.status_code}")
        
        if response.status_code == 200:
            apts = response.json()
            print(f"   Citas confirmadas: {len(apts)}")
        else:
            print(f"   ✗ Error: {response.text[:200]}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print_header("TEST COMPLETO")

if __name__ == "__main__":
    test_doctor_panel()