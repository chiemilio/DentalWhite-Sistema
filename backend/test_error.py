"""
Test: Debug all missing fields
"""
import traceback
import requests
from app.database import SessionLocal
from app.models.patient import Patient
from app.models.user import User
from sqlalchemy import or_, and_
from sqlalchemy.orm import joinedload

def main():
    db = SessionLocal()
    try:
        search_term = "%emilio%"
        patients = (
            db.query(Patient)
            .join(User, User.id == Patient.usuario_id)
            .options(joinedload(Patient.usuario))
            .filter(and_(User.rol_id == 4, User.nombre.ilike(search_term)))
            .limit(5)
            .all()
        )
        
        from app.schemas.patient import PatientResponse
        for p in patients:
            try:
                result = PatientResponse.from_orm_with_relations(p)
                print(f"OK: {result.usuario_nombre}")
            except Exception as e:
                print(f"ERROR on patient {p.id}: {e}")
                
    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()