"""
Script para crear citas de prueba confirmadas para el médico
"""
from datetime import datetime, date, time
from app.database import SessionLocal
from app.models.appointment import Appointment

def crear_citas_prueba():
    db = SessionLocal()
    
    try:
        # Obtener paciente y empleado existentes
        from app.models.patient import Patient
        from app.models.employee import Employee
        
        paciente = db.query(Patient).first()
        empleado = db.query(Employee).first()
        
        if not paciente:
            print("No hay pacientes")
            return
            
        if not empleado:
            print("No hay empleados")
            return
        
        print(f"Paciente: {paciente.id}, Empleado: {empleado.id}")
        
        # Crear citas confirmadas para hoy y mañana
        citas_data = [
            {"fecha": date.today(), "hora": time(10, 0), "estado": 2},  # 2 = Confirmada
            {"fecha": date.today(), "hora": time(11, 0), "estado": 2},
            {"fecha": date.today(), "hora": time(12, 0), "estado": 2},
            {"fecha": date.today(), "hora": time(16, 0), "estado": 2},
            {"fecha": date.today(), "hora": time(17, 0), "estado": 2},
        ]
        
        for i, data in enumerate(citas_data):
            cita = Appointment(
                paciente_id=paciente.id,
                empleado_id=empleado.id,
                servicio_id=1,
                sucursal_id=1,
                estado_cita_id=data["estado"],
                fecha=data["fecha"],
                hora=data["hora"],
                duracion_minutos=30,
                motivo_consulta=f"Consulta de prueba {i+1}",
                notas=f"Cita de prueba confirmada #{i+1}",
            )
            db.add(cita)
        
        db.commit()
        print(f"Creadas {len(citas_data)} citas confirmadas")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    crear_citas_prueba()