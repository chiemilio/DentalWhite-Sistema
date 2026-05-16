# check_citas.py
from app.database import SessionLocal
from app.models.appointment import Appointment

db = SessionLocal()
try:
    citas = db.query(Appointment).filter(Appointment.estado_cita_id == 2).all()
    print(f"Citas confirmadas: {len(citas)}")
    for c in citas:
        print(f"  ID {c.id}: fecha={c.fecha}, hora={c.hora}, estado={c.estado_cita_id}")
finally:
    db.close()