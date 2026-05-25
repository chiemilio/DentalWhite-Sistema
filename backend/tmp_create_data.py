"""
Create patients and appointments for demo
Run: docker cp this_file dental_white_backend:/app/ && docker exec dental_white_backend python3 /app/tmp_create_data.py
"""
from datetime import date, time
from app.database import SessionLocal
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()

# Create a couple more patient users + patient records
new_patients_data = [
    {"email": "maria@example.com", "name": "María García", "sexo": "Femenino", "edad": 32, "dir": "Av. Reforma 456, Col. Centro", "tel": "5512340001", "oc": "Diseñadora"},
    {"email": "jose@example.com", "name": "José Hernández", "sexo": "Masculino", "edad": 45, "dir": "Calle Hidalgo 789, Col. Juárez", "tel": "5512340002", "oc": "Ingeniero"},
    {"email": "ana@example.com", "name": "Ana Martínez", "sexo": "Femenino", "edad": 28, "dir": "Blvd. Independencia 321, Col. Moderna", "tel": "5512340003", "oc": "Abogada"},
]

created_patients = []

for pd in new_patients_data:
    existing = db.query(User).filter(User.email == pd["email"]).first()
    if existing:
        print(f"User {pd['email']} already exists")
        pat = db.query(Patient).filter(Patient.usuario_id == existing.id).first()
        if pat:
            created_patients.append(pat)
        continue

    # Create user with rol_id=5 (Paciente)
    name_parts = pd["name"].split(" ", 1)
    user = User(
        email=pd["email"],
        password_hash=get_password_hash("12345678"),
        nombre=name_parts[0],
        apellido_paterno=name_parts[1] if len(name_parts) > 1 else "Paciente",
        apellido_materno="N/A",
        rol_id=5,
        activo=True,
        telefono_principal=pd["tel"],
    )
    db.add(user)
    db.flush()

    # Create patient record
    birth_year = 2026 - pd["edad"]
    patient = Patient(
        usuario_id=user.id,
        numero_expediente=f"PAC-{user.id:06d}",
        fecha_nacimiento=date(birth_year, 6, 15),
        sexo=pd["sexo"],
        ocupacion=pd["oc"],
        direccion=pd["dir"],
        ciudad="Ciudad de México",
        estado="CDMX",
        codigo_postal="06000",
        activo=True,
    )
    db.add(patient)
    db.flush()
    created_patients.append(patient)
    print(f"Created: {pd['name']} (patient_id={patient.id})")

db.commit()

# Also get existing patients
all_pats = db.query(Patient).all()
print(f"\nTotal patients: {len(all_pats)}")
for p in all_pats:
    u = db.query(User).filter(User.id == p.usuario_id).first()
    print(f"  ID={p.id}: {u.nombre if u else 'N/A'} (exp={p.numero_expediente})")

# Create appointments for today (May 23, 2026) and nearby dates
today = date(2026, 5, 23)
time_slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

# Clear existing appointments first for clean state
existing = db.query(Appointment).all()
print(f"\nDeleting {len(existing)} existing appointments...")
for e in existing:
    db.delete(e)
db.commit()

# Create appointments for this week
week_dates = [
    today,                                   # Sat May 23
    date(2026, 5, 25),  # Mon May 25
    date(2026, 5, 26),  # Tue May 26
    date(2026, 5, 27),  # Wed May 27
]

# empleado_id=1 = Dr. Juan (doctor)
# pacient_ids: use IDs from 1 to 5
appt_config = [
    # (paciente_id, service_id, date_idx, slot_idx)
    (1, 1, 0, 0),   # May 23, 09:00 - Consulta General
    (2, 2, 0, 1),   # May 23, 10:00 - Limpieza Dental
    (3, 3, 0, 2),   # May 23, 11:00 - Ortodoncia
    (4, 1, 0, 3),   # May 23, 12:00 - Consulta General
    (5, 4, 0, 4),   # May 23, 13:00 - Endodoncia
    (1, 2, 1, 0),   # May 25, 09:00 - Limpieza Dental
    (3, 5, 1, 1),   # May 25, 10:00 - Extracción
    (4, 3, 1, 2),   # May 25, 11:00 - Ortodoncia
    (2, 1, 2, 0),   # May 26, 09:00 - Consulta General
    (5, 2, 2, 1),   # May 26, 10:00 - Limpieza Dental
    (1, 3, 2, 2),   # May 26, 11:00 - Ortodoncia
    (3, 4, 3, 0),   # May 27, 09:00 - Endodoncia
    (4, 2, 3, 1),   # May 27, 10:00 - Limpieza Dental
    (2, 5, 3, 2),   # May 27, 11:00 - Extracción
]

for pid, sid, didx, slot_idx in appt_config:
    d = week_dates[didx]
    t = time_slots[slot_idx]
    hour_int = int(t.split(":")[0])
    minute_int = int(t.split(":")[1])
    appt = Appointment(
        paciente_id=pid,
        empleado_id=1,  # Dr. Juan
        servicio_id=sid,
        sucursal_id=1,
        estado_cita_id=1,  # Programada
        fecha=d,
        hora=time(hour_int, minute_int),
        duracion_minutos=60,
        activo=True,
    )
    db.add(appt)

db.commit()

total = db.query(Appointment).count()
print(f"\nCreated {total} appointments")
for a in db.query(Appointment).all():
    print(f"  ID={a.id}: fecha={a.fecha}, hora={a.hora}, paciente_id={a.paciente_id}, servicio_id={a.servicio_id}, estado={a.estado_cita_id}")

db.close()
