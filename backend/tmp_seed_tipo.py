from app.database import SessionLocal
from app.models.catalogos import TipoAntecedente

db = SessionLocal()

existing = db.query(TipoAntecedente).filter(TipoAntecedente.nombre == "Historial Clínico Completo").first()
if not existing:
    t = TipoAntecedente(
        nombre="Historial Clínico Completo",
        categoria="GENERAL",
        descripcion="Registro completo del historial clínico del paciente (examen facial, bucal, radiográfico, antecedentes)",
        activo=True
    )
    db.add(t)
    db.commit()
    print(f"Created TipoAntecedente ID={t.id}")
else:
    print(f"Already exists: ID={existing.id}")

db.close()
