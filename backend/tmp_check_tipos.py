from app.database import SessionLocal
from app.models.catalogos import TipoAntecedente

db = SessionLocal()
tipos = db.query(TipoAntecedente).all()
print("=== cat_tipos_antecedentes ===")
for t in tipos:
    print(f"ID={t.id}, nombre={t.nombre}")
if not tipos:
    print("No hay tipos de antecedentes registrados")
db.close()
