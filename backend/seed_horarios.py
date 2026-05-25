from app.database import engine, Base, SessionLocal
from app.models.catalogos import Horario
from datetime import time

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    existing = db.query(Horario).filter(Horario.sucursal_id == 1).count()
    if existing > 0:
        print(f"Already {existing} horarios for sucursal_id=1, skipping")
    else:
        horarios_data = [
            {"hora": "09:00", "hora_inicio": time(9, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "10:00", "hora_inicio": time(10, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "11:00", "hora_inicio": time(11, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "12:00", "hora_inicio": time(12, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "13:00", "hora_inicio": time(13, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "14:00", "hora_inicio": time(14, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "15:00", "hora_inicio": time(15, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "16:00", "hora_inicio": time(16, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "17:00", "hora_inicio": time(17, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
            {"hora": "18:00", "hora_inicio": time(18, 0), "hora_fin": time(20, 0), "duracion_minutos": 30},
        ]
        for h in horarios_data:
            horario = Horario(
                sucursal_id=1,
                hora=h["hora"],
                hora_inicio=h["hora_inicio"],
                hora_fin=h["hora_fin"],
                duracion_minutos=h["duracion_minutos"],
                activo=True
            )
            db.add(horario)
        db.commit()
        print(f"Created {len(horarios_data)} horarios for sucursal_id=1")
finally:
    db.close()
