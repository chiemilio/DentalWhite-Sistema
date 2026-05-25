from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.employee import Employee
from app.models.patient import Patient
from app.models.user import User
from app.models.catalogos import Servicio, Horario


db = SessionLocal()

print("=== EMPLEADOS ===")
emps = db.query(Employee).all()
for e in emps:
    print(f"ID={e.id}, usuario_id={e.usuario_id}, puesto={e.puesto}")

print("\n=== DOCTORS (User rol_id=3) ===")
users = db.query(User).filter(User.rol_id == 3).all()
for u in users:
    print(f"ID={u.id}, nombre={u.nombre}, email={u.email}")

print("\n=== PACIENTES ===")
pats = db.query(Patient).all()
for p in pats:
    u = db.query(User).filter(User.id == p.usuario_id).first()
    print(f"ID={p.id}, usuario_id={p.usuario_id}, nombre={u.nombre if u else 'N/A'}, expediente={p.numero_expediente}")

print("\n=== SERVICIOS ===")
servs = db.query(Servicio).all()
for s in servs:
    print(f"ID={s.id}, nombre={s.nombre}")

print("\n=== HORARIOS ===")
hors = db.query(Horario).all()
for h in hors:
    print(f"ID={h.id}, hora={h.hora}, sucursal_id={h.sucursal_id}")

print("\n=== CITAS EXISTENTES ===")
citas = db.query(Appointment).all()
print(f"Total: {len(citas)}")
for c in citas:
    print(f"ID={c.id}, paciente_id={c.paciente_id}, empleado_id={c.empleado_id}, servicio_id={c.servicio_id}, estado_cita_id={c.estado_cita_id}, fecha={c.fecha}, hora={c.hora}")

db.close()
