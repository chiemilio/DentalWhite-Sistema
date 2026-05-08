"""Test database operations directly"""
from app.database import SessionLocal
from app.models.payment import Payment

db = SessionLocal()

try:
    # Check if table exists and insert manually
    payment = Payment(
        cita_id=24,
        paciente_id=1,
        monto_total=500.00,
        monto_pagado=0.00,
        monto_restante=500.00,
        estado="PENDIENTE",
        metodo_pago="EFECTIVO",
        numero_recibo="REC-000001"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    print(f"Created payment ID: {payment.id}")
    print(f"Estado: {payment.estado}")
    print(f"Monto total: {payment.monto_total}")
    
    # Read it back
    p = db.query(Payment).filter(Payment.id == payment.id).first()
    print(f"Read back: ID={p.id}, estado={p.estado}")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()