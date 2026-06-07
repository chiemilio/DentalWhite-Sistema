"""
Seed Catalogs - Dental White
Crea registros base en tablas de catálogos (roles, sucursales, estados, servicios).
Ejecutar primero, antes de seed_users.py y seed_horarios.py.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, Base, SessionLocal
from app.models.catalogos import Rol, Sucursal, EstadoCita, Servicio


def seed_catalogs():
    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # ---- Roles ----
        roles_data = [
            {"id": 1, "nombre": "SuperAdmin", "descripcion": "Super administrador con acceso total"},
            {"id": 2, "nombre": "Admin", "descripcion": "Administrador del sistema"},
            {"id": 3, "nombre": "Doctor", "descripcion": "Médico dental"},
            {"id": 4, "nombre": "Recepcionista", "descripcion": "Personal de recepción"},
            {"id": 5, "nombre": "Paciente", "descripcion": "Paciente de la clínica"},
        ]
        for r in roles_data:
            existing = db.query(Rol).filter(Rol.id == r["id"]).first()
            if not existing:
                db.add(Rol(id=r["id"], nombre=r["nombre"], descripcion=r["descripcion"], activo=True))
                print(f"Created role: {r['nombre']}")
            else:
                print(f"Role already exists: {r['nombre']}")

        # ---- Sucursales ----
        existing = db.query(Sucursal).filter(Sucursal.id == 1).first()
        if not existing:
            db.add(Sucursal(
                id=1, nombre="Sucursal Principal",
                direccion="Av. Principal #123", telefono="555-0000",
                email="contacto@dentalwhite.com", activo=True
            ))
            print("Created sucursal: Sucursal Principal")
        else:
            print("Sucursal already exists: Sucursal Principal")

        # ---- Estados de Cita ----
        estados_data = [
            {"nombre": "Pendiente", "color": "#F59E0B"},
            {"nombre": "Confirmada", "color": "#3B82F6"},
            {"nombre": "En Proceso", "color": "#8B5CF6"},
            {"nombre": "Completada", "color": "#10B981"},
            {"nombre": "Cancelada", "color": "#EF4444"},
            {"nombre": "No Asistió", "color": "#6B7280"},
            {"nombre": "Pagado Parcial", "color": "#F97316"},
            {"nombre": "Pagado Completo", "color": "#8B5CF6"},
        ]
        for e in estados_data:
            existing = db.query(EstadoCita).filter(EstadoCita.nombre == e["nombre"]).first()
            if not existing:
                db.add(EstadoCita(nombre=e["nombre"], color=e["color"], activo=True))
                print(f"Created estado_cita: {e['nombre']}")

        # ---- Servicios ----
        servicios_data = [
            {"nombre": "Consulta General", "precio_base": 500.00, "duracion_minutos": 30},
            {"nombre": "Limpieza Dental", "precio_base": 800.00, "duracion_minutos": 45},
            {"nombre": "Extracción Simple", "precio_base": 1200.00, "duracion_minutos": 30},
            {"nombre": "Blanqueamiento", "precio_base": 2500.00, "duracion_minutos": 60},
            {"nombre": "Ortodoncia (Mensual)", "precio_base": 1500.00, "duracion_minutos": 30},
            {"nombre": "Endodoncia", "precio_base": 3000.00, "duracion_minutos": 90},
            {"nombre": "Corona Dental", "precio_base": 4000.00, "duracion_minutos": 60},
            {"nombre": "Implante Dental", "precio_base": 8000.00, "duracion_minutos": 90},
        ]
        for s in servicios_data:
            existing = db.query(Servicio).filter(Servicio.nombre == s["nombre"]).first()
            if not existing:
                db.add(Servicio(
                    nombre=s["nombre"], precio_base=s["precio_base"],
                    duracion_minutos=s["duracion_minutos"], activo=True
                ))
                print(f"Created servicio: {s['nombre']}")

        db.commit()
        print("\nSeed catalogs completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_catalogs()
