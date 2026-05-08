"""
Endpoints de Pagos
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, date

from app.database import get_db
from app.models.payment import Payment, PaymentPartial
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/test")
def test_payments():
    """Test endpoint - verificar que funciona"""
    return {"message": "Pagos endpoint funciona!", "count": 1}


@router.get("/", response_model=List[PaymentResponse])
def list_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener todos los pagos"""
    payments = db.query(Payment).filter(Payment.activo == True).all()
    return [PaymentResponse.from_orm_with_relations(p) for p in payments]


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear un pago"""
    # Verificar que la cita existe
    from app.models.appointment import Appointment
    cita = db.query(Appointment).filter(Appointment.id == payment_data.cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    # Calcular monto restante
    monto_restante = float(payment_data.monto_total) - float(payment_data.monto_pagado)
    
    # Determinar estado
    estado = "PAGADO" if monto_restante <= 0 else "PENDIENTE" if payment_data.monto_pagado == 0 else "PARCIAL"
    
    # Generar número de recibo
    ultimo = db.query(Payment).order_by(Payment.id.desc()).first()
    next_num = 1 if not ultimo else ultimo.id + 1
    numero_recibo = f"REC-{next_num:06d}"
    
    payment = Payment(
        cita_id=payment_data.cita_id,
        paciente_id=payment_data.paciente_id,
        monto_total=payment_data.monto_total,
        monto_pagado=payment_data.monto_pagado,
        monto_restante=monto_restante,
        estado=estado,
        metodo_pago=payment_data.metodo_pago,
        numero_recibo=numero_recibo,
        notas=payment_data.notas
    )
    
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    return PaymentResponse.from_orm_with_relations(payment)


@router.get("/{payment_id}", response_model=PaymentResponse)
@router.get("/{payment_id}/", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un pago por ID"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return PaymentResponse.from_orm_with_relations(payment)


@router.put("/{payment_id}", response_model=PaymentResponse)
@router.put("/{payment_id}/", response_model=PaymentResponse)
@router.put("/{payment_id}/", response_model=PaymentResponse)
def update_payment(
    payment_id: int,
    payment_data: PaymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar un pago (registrar pago)"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    
    # Actualizar campos
    if payment_data.monto_pagado is not None:
        monto_anterior = float(payment.monto_pagado)
        monto_nuevo = float(payment_data.monto_pagado)
        diferencia = monto_nuevo - monto_anterior
        
        # Crear registro en pagos_parciales SI HAY ABONO NUEVO
        if diferencia > 0:
            from datetime import datetime
            timestamp = int(datetime.now().timestamp())
            numero_recibo = f"ABONO-{timestamp}"
            
            # Verificar que no existe
            existing = db.query(PaymentPartial).filter(
                PaymentPartial.numero_recibo == numero_recibo
            ).first()
            if not existing:
                abono = PaymentPartial(
                    pago_id=payment_id,
                    monto=diferencia,
                    metodo_pago=payment_data.metodo_pago or payment.metodo_pago or "EFECTIVO",
                    numero_recibo=numero_recibo,
                    fecha_pago=date.today()
                )
                db.add(abono)
        
        payment.monto_pagado = payment_data.monto_pagado
        nuevo_restante = float(payment.monto_total) - float(payment_data.monto_pagado)
        payment.monto_restante = nuevo_restante
        
        # Actualizar estado
        if nuevo_restante <= 0:
            payment.estado = "PAGADO"
        elif payment_data.monto_pagado > 0:
            payment.estado = "PARCIAL"
    
    if payment_data.metodo_pago is not None:
        payment.metodo_pago = payment_data.metodo_pago
    
    if payment_data.notas is not None:
        payment.notas = payment_data.notas
    
    if payment_data.estado is not None:
        payment.estado = payment_data.estado
    
    db.commit()
    db.refresh(payment)
    
    return PaymentResponse.from_orm_with_relations(payment)


@router.get("/cita/{cita_id}", response_model=PaymentResponse)
@router.get("/cita/{cita_id}/", response_model=PaymentResponse)
def get_payment_by_cita(
    cita_id: int,
    db: Session = Depends(get_db)
):
    """Obtener pago de una cita"""
    payment = db.query(Payment).filter(Payment.cita_id == cita_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Pago no encontrado para esta cita")
    return PaymentResponse.from_orm_with_relations(payment)


@router.get("/{payment_id}/abonos")
def get_abonos(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener abonos de un pago"""
    abonos = db.query(PaymentPartial).filter(PaymentPartial.pago_id == payment_id).order_by(PaymentPartial.id).all()
    return [{"id": a.id, "monto": a.monto, "metodo_pago": a.metodo_pago, "numero_recibo": a.numero_recibo, "fecha_pago": a.fecha_pago} for a in abonos]