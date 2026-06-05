"""
Seed Users - Dental White
Crea usuarios de prueba con contraseñas hasheadas correctamente.
Ejecutar: python seed_users.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.models.catalogos import Rol

def seed_users():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        roles = {r.nombre: r.id for r in db.query(Rol).all()}
        if not roles:
            print("ERROR: No hay roles en la BD. Ejecuta seed_catalogs.py primero.")
            return

        users_data = [
            {"email": "admin@dentalwhite.com", "password": "admin123", "nombre": "Admin",
             "apellido_paterno": "Sistema", "rol_nombre": "Admin"},
            {"email": "doctor@dentalwhite.com", "password": "doctor123", "nombre": "Dr. Juan",
             "apellido_paterno": "Pérez", "rol_nombre": "Doctor"},
            {"email": "recepcion@dentalwhite.com", "password": "recep123", "nombre": "María",
             "apellido_paterno": "López", "rol_nombre": "Recepcionista"},
            {"email": "paciente@dentalwhite.com", "password": "paciente123", "nombre": "Carlos",
             "apellido_paterno": "García", "rol_nombre": "Paciente"},
            # TODO: Leer contraseñas desde variables de entorno en producción
        ]

        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if existing:
                existing.password_hash = get_password_hash(u["password"])
                print(f"Updated: {u['email']}")
            else:
                user = User(
                    email=u["email"],
                    password_hash=get_password_hash(u["password"]),
                    nombre=u["nombre"],
                    apellido_paterno=u["apellido_paterno"],
                    rol_id=roles.get(u["rol_nombre"], 1),
                    activo=True,
                )
                db.add(user)
                print(f"Created: {u['email']}")

        db.commit()
        print("Seed users completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
