"""
TEST COMPLETO Y VERIFICACIÓN DEL SISTEMA
"""
import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000/api/v1"

def test_system():
    print("="*70)
    print("  TEST COMPLETO DEL SISTEMA - PANEL DEL MÉDICO")
    print("="*70)
    
    # 1. LOGIN
    print("\n[1] LOGIN")
    login_data = {"email": "doctor@dentalwhite.com", "password": "doctor123"}
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=10)
        if r.status_code == 200:
            data = r.json()
            token = data["access_token"]
            user = data["user"]
            headers = {"Authorization": f"Bearer {token}"}
            print(f"    ✓ LOGIN OK")
            print(f"      User ID: {user['id']}")
            print(f"      Email: {user['email']}")
            print(f"      Role: {user['role']}")
        else:
            print(f"    ✗ LOGIN FALLIDO: {r.status_code}")
            return
    except Exception as e:
        print(f"    ✗ ERROR: {e}")
        return
    
    user_id = user['id']
    
    # 2. OBTENER EMPLEADO
    print("\n[2] OBTENER EMPLEADO POR USUARIO_ID")
    try:
        r = requests.get(f"{BASE_URL}/employees/?usuario_id={user_id}", headers=headers, timeout=10)
        print(f"    Status: {r.status_code}")
        print(f"    Response: {r.text[:500]}")
        
        if r.status_code == 200:
            employees = r.json()
            print(f"    Empleados: {len(employees)}")
            
            if employees and len(employees) > 0:
                emp = employees[0]
                emp_id = emp['id']
                print(f"    ✓ EMPLEADO ENCONTRADO")
                print(f"      ID: {emp_id}")
                print(f"      Puesto: {emp.get('puesto')}")
                print(f"      Full response: {json.dumps(emp, indent=4, default=str)}")
            else:
                print(f"    ✗ NO HAY EMPLEADOS")
                emp_id = None
        else:
            print(f"    ✗ ERROR: {r.text[:200]}")
            emp_id = None
    except Exception as e:
        print(f"    ✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        emp_id = None
    
    if not emp_id:
        print("\n    Intentando obtener primer empleado doctor...")
        try:
            r = requests.get(f"{BASE_URL}/employees/", headers=headers, timeout=10)
            if r.status_code == 200:
                all_emp = r.json()
                print(f"    Total empleados: {len(all_emp)}")
                for e in all_emp[:3]:
                    print(f"      - ID {e.get('id')}: {e.get('puesto')}")
                
                # Buscar doctor
                for e in all_emp:
                    if 'doctor' in str(e.get('puesto', '')).lower():
                        emp_id = e['id']
                        print(f"    ✓ Doctor encontrado: {emp_id}")
                        break
        except Exception as e:
            print(f"    ✗ Error: {e}")
    
    if not emp_id:
        print("\n    ✗ NO SE PUDO OBTENER EMPLEADO")
        return
    
    # 3. OBTENER CITAS DEL EMPLEADO
    print(f"\n[3] OBTENER CITAS DEL EMPLEADO {emp_id}")
    try:
        r = requests.get(f"{BASE_URL}/appointments/?empleado_id={emp_id}", headers=headers, timeout=10)
        print(f"    Status: {r.status_code}")
        
        if r.status_code == 200:
            appointments = r.json()
            print(f"    ✓ CITAS RECIBIDAS: {len(appointments)}")
            
            if appointments:
                for apt in appointments[:5]:
                    print(f"\n    CITA {apt.get('id')}:")
                    print(f"      fecha_hora: {apt.get('fecha_hora')}")
                    print(f"      estado_cita_id: {apt.get('estado_cita_id')}")
                    print(f"      estado_nombre: {apt.get('estado_nombre')}")
                    print(f"      paciente_nombre: {apt.get('paciente_nombre')}")
                    print(f"      servicio_nombre: {apt.get('servicio_nombre')}")
                
                # Contar por estado
                states = {}
                for a in appointments:
                    st = a.get('estado_cita_id', '?')
                    states[st] = states.get(st, 0) + 1
                print(f"\n    RESUMEN POR ESTADO: {states}")
                
                # Citas confirmadas de hoy
                today = date.today().isoformat()
                confirmed_today = [a for a in appointments 
                                 if a.get('estado_cita_id') == 2 
                                 and a.get('fecha_hora', '').startswith(today)]
                print(f"    Citas confirmadas hoy ({today}): {len(confirmed_today)}")
                
                if confirmed_today:
                    for ct in confirmed_today:
                        print(f"      - Cita {ct.get('id')}: {ct.get('fecha_hora')}")
            else:
                print(f"    ✗ NO HAY CITAS")
                
                # Crear citas de prueba
                print(f"\n    [3b] CREAR CITAS DE PRUEBA")
                r2 = requests.get(f"{BASE_URL}/patients/", headers=headers, timeout=10)
                if r2.status_code == 200:
                    patients = r2.json()
                    if patients:
                        paciente_id = patients[0]['id']
                        
                        # Crear 3 citas confirmadas para hoy
                        today_str = date.today().isoformat()
                        for h in [9, 10, 14]:
                            cita_data = {
                                "paciente_id": paciente_id,
                                "empleado_id": emp_id,
                                "servicio_id": 1,
                                "sucursal_id": 1,
                                "estado_cita_id": 2,  # Confirmada
                                "fecha_hora": f"{today_str}T{h:02d}:00:00",
                                "duracion_minutos": 30
                            }
                            r3 = requests.post(f"{BASE_URL}/appointments/", 
                                             json=cita_data, headers=headers, timeout=10)
                            print(f"    Creando cita {h}:00 - Status: {r3.status_code}")
                            if r3.status_code not in [200, 201]:
                                print(f"      Error: {r3.text[:200]}")
                
        else:
            print(f"    ✗ ERROR: {r.status_code}")
            print(f"    Response: {r.text[:500]}")
            
    except Exception as e:
        print(f"    ✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*70)
    print("  TEST COMPLETO")
    print("="*70)

if __name__ == "__main__":
    test_system()