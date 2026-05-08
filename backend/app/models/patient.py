"""
Modelo de Paciente
"""
from sqlalchemy import Column, Integer, String, Date, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Patient(Base):
    """Paciente"""
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, unique=True)
    tipo_paciente_id = Column(Integer, ForeignKey("cat_tipos_paciente.id"))
    sucursal_id = Column(Integer, ForeignKey("cat_sucursales.id"))

    # Número de expediente
    numero_expediente = Column(String(20), unique=True, nullable=False)

    # Información personal
    fecha_nacimiento = Column(Date, nullable=False)

    # Dirección
    direccion = Column(String(255))
    ciudad = Column(String(100))
    estado = Column(String(100))
    codigo_postal = Column(String(10))

    # Contacto de emergencia
    telefono_emergencia = Column(String(20))
    contacto_emergencia = Column(String(100))

    # Tutor (para menores)
    tutor_nombre = Column(String(200))
    tutor_telefono = Column(String(20))
    tutor_relacion = Column(String(50))

    # Estado
    activo = Column(Boolean, default=True, index=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    usuario = relationship("User", back_populates="paciente")
    tipo_paciente = relationship("TipoPaciente")
    sucursal = relationship("Sucursal")
    citas = relationship("Appointment", back_populates="paciente")
    consultas = relationship("Consultation", back_populates="paciente")
    historial_clinico = relationship("ClinicalHistory", back_populates="paciente")
    consentimientos = relationship("ConsentimientoPaciente", back_populates="paciente")
    pagos = relationship("Payment", back_populates="paciente")

    def __repr__(self):
        return f"<Patient {self.id}>"
