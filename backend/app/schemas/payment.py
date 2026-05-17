"""
Schemas de Pago
"""
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict


class PaymentBase(BaseModel):
    """Schema base de Pago"""
    cita_id: int
    paciente_id: int
    monto_total: float = Field(..., description="Monto total del servicio")
    monto_pagado: float = Field(0, description="Monto pagado")
    metodo_pago: Optional[str] = Field(None, description="Método de pago")
    notas: Optional[str] = None


class PaymentCreate(PaymentBase):
    """Schema para crear Pago"""
    pass


class PaymentUpdate(BaseModel):
    """Schema para actualizar Pago"""
    monto_total: Optional[float] = None
    monto_pagado: Optional[float] = None
    metodo_pago: Optional[str] = None
    notas: Optional[str] = None
    estado: Optional[str] = None


class PaymentResponse(PaymentBase):
    """Schema de respuesta de Pago"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    monto_restante: float
    estado: str
    numero_recibo: Optional[str] = None
    fecha_pago: Optional[date] = None
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    # Información relacionada
    cita_fecha: Optional[date] = None
    paciente_nombre: Optional[str] = None
    
    @classmethod
    def from_orm_with_relations(cls, payment):
        """Constructor con relaciones"""
        return cls(
            id=payment.id,
            cita_id=payment.cita_id,
            paciente_id=payment.paciente_id,
            monto_total=float(payment.monto_total),
            monto_pagado=float(payment.monto_pagado),
            monto_restante=float(payment.monto_restante),
            metodo_pago=payment.metodo_pago,
            notas=payment.notas,
            estado=payment.estado,
            numero_recibo=payment.numero_recibo,
            fecha_pago=payment.fecha_pago,
            activo=payment.activo,
            fecha_creacion=payment.fecha_creacion,
            fecha_actualizacion=payment.fecha_actualizacion,
            cita_fecha=payment.cita.fecha if payment.cita else None,
            paciente_nombre=f"{payment.paciente.usuario.nombre} {payment.paciente.usuario.apellido_paterno}" if payment.paciente and payment.paciente.usuario else None
        )


class PaymentPartialBase(BaseModel):
    """Schema base de Pago Parcial"""
    pago_id: int
    monto: float = Field(..., description="Monto del abono")
    metodo_pago: str = Field(..., description="Método de pago")
    notas: Optional[str] = None


class PaymentPartialCreate(PaymentPartialBase):
    """Schema para crear abono"""
    pass


class PaymentPartialResponse(PaymentPartialBase):
    """Schema de respuesta de abono"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    numero_recibo: Optional[str] = None
    fecha_pago: date
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime