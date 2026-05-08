"""
Modelo de Pagos
"""
from sqlalchemy import Column, Integer, String, Numeric, Date, Time, Boolean, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Payment(Base):
    """Pago de cita"""
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, ForeignKey("citas.id"), nullable=False, unique=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    
    # Información del pago
    monto_total = Column(Numeric(10, 2), nullable=False)
    monto_pagado = Column(Numeric(10, 2), nullable=False, default=0)
    monto_restante = Column(Numeric(10, 2), nullable=False)
    
    # Estado del pago
    estado = Column(String(20), nullable=False, default="PENDIENTE")  # PENDIENTE, PAGADO, PARCIAL, CANCELADO
    
    # Información del pago
    metodo_pago = Column(String(50))  # EFECTIVO, TARJETA_DEBITO, TARJETA_CREDITO, TRANSFERENCIA, MIXTO
    numero_recibo = Column(String(20), unique=True)
    
    # Referencias adicionales
    notas = Column(Text)
    
    # Fechas
    fecha_pago = Column(Date)
    hora_pago = Column(Time)
    
    # Estado
    activo = Column(Boolean, default=True)
    
    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    cita = relationship("Appointment", back_populates="pago")
    paciente = relationship("Patient", back_populates="pagos")
    abonos = relationship("PaymentPartial", back_populates="pago")
    
    def __repr__(self):
        return f"<Payment {self.id} - Cita {self.cita_id} - ${self.monto_pagado}/{self.monto_total}>"


class PaymentPartial(Base):
    """Pagos parciales (abonos)"""
    __tablename__ = "pagos_parciales"

    id = Column(Integer, primary_key=True, index=True)
    pago_id = Column(Integer, ForeignKey("pagos.id"), nullable=False, index=True)
    
    # Información del abono
    monto = Column(Numeric(10, 2), nullable=False)
    metodo_pago = Column(String(50), nullable=False)
    numero_recibo = Column(String(20), unique=True)
    
    # Notas
    notas = Column(Text)
    
    # Fecha del abono
    fecha_pago = Column(Date, nullable=False)
    hora_pago = Column(Time)
    
    # Estado
    activo = Column(Boolean, default=True)
    
    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    pago = relationship("Payment", back_populates="abonos")
    
    def __repr__(self):
        return f"<PaymentPartial {self.id} - ${self.monto}>"