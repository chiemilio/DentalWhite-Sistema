"""
Modelos de Consulta y Fotos de Consulta
"""
from sqlalchemy import Column, Integer, String, DECIMAL, Boolean, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Consultation(Base):
    """Consulta médica"""
    __tablename__ = "consultas"

    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, ForeignKey("citas.id"), nullable=False, unique=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False, index=True)

    # Información clínica
    reconocimiento_hallazgos = Column(Text)
    diagnostico = Column(Text)
    tratamiento_indicaciones = Column(Text)

    # Signos vitales
    peso = Column(DECIMAL(5, 2))  # kg
    talla = Column(DECIMAL(5, 2))  # metros
    temperatura = Column(DECIMAL(4, 2))  # °C
    presion_sistolica = Column(Integer)  # mmHg
    presion_diastolica = Column(Integer)  # mmHg
    pulso = Column(Integer)  # bpm
    glucosa = Column(DECIMAL(5, 2))  # mg/dL

    # Notas
    notas_adicionales = Column(Text)

    # Estado
    activo = Column(Boolean, default=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    cita = relationship("Appointment", back_populates="consulta")
    paciente = relationship("Patient", back_populates="consultas")
    empleado = relationship("Employee", foreign_keys=[empleado_id], back_populates="consultas_realizadas")
    fotos = relationship("ConsultationPhoto", back_populates="consulta")
    receta = relationship("Prescription", back_populates="consulta", uselist=False)

    def __repr__(self):
        return f"<Consultation {self.id}>"


class ConsultationPhoto(Base):
    """Fotos de consulta (antes, durante, después)"""
    __tablename__ = "consultas_fotos"

    id = Column(Integer, primary_key=True, index=True)
    consulta_id = Column(Integer, ForeignKey("consultas.id"), nullable=False, index=True)
    servicio_id = Column(Integer, ForeignKey("cat_servicios.id"))

    # Información de la foto
    tipo_foto = Column(String(20), nullable=False)  # 'ANTES', 'DURANTE', 'DESPUES'
    url_foto = Column(String(500), nullable=False)
    descripcion = Column(Text)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    consulta = relationship("Consultation", back_populates="fotos")
    servicio = relationship("Servicio")

    def __repr__(self):
        return f"<ConsultationPhoto {self.id} - {self.tipo_foto}>"
