"""Check database tables"""
from app.database import SessionLocal
from app.models.payment import Payment, PaymentPartial

db = SessionLocal()

print("=== TABLA PAGOS ===")
pagos = db.query(Payment).all()
print(f"Total registros: {len(pagos)}")
for p in pagos:
    print(f"  ID: {p.id}")
    print(f"    cita_id: {p.cita_id}")
    print(f"    monto_total: ${p.monto_total}")
    print(f"    monto_pagado: ${p.monto_pagado}")
    print(f"    monto_restante: ${p.monto_restante}")
    print(f"    estado: {p.estado}")
    print(f"    metodo_pago: {p.metodo_pago}")
    print(f"    numero_recibo: {p.numero_recibo}")
    print()

print("=== TABLA PAGOS_PARCIALES ===")
parciales = db.query(PaymentPartial).all()
print(f"Total registros: {len(parciales)}")
for p in parciales:
    print(f"  ID: {p.id}, pago_id: {p.pago_id}, monto: ${p.monto}")

db.close()