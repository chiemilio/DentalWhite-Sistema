"""
Modelos de Historial Clínico y Consentimientos
"""
from sqlalchemy import Column, Integer, String, Date, Boolean, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ClinicalHistory(Base):
    """Historial clínico (antecedentes médicos)"""
    __tablename__ = "historial_clinico"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    tipo_antecedente_id = Column(Integer, ForeignKey("cat_tipos_antecedentes.id"), nullable=False)

    # Información del antecedente
    descripcion = Column(Text, nullable=False)
    fecha_diagnostico = Column(Date)
    notas = Column(Text)

    # Estado
    activo = Column(Boolean, default=True)  # True = activo, False = inactivo/controlado

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    paciente = relationship("Patient", back_populates="historial_clinico")
    tipo_antecedente = relationship("TipoAntecedente")

    def __repr__(self):
        return f"<ClinicalHistory {self.id}>"


class ConsentimientoPaciente(Base):
    """Consentimientos informados del paciente"""
    __tablename__ = "consentimientos_paciente"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    servicio_id = Column(Integer, ForeignKey("cat_servicios.id"), nullable=False)
    cita_id = Column(Integer, ForeignKey("citas.id"))

    # Consentimiento
    texto_consentimiento = Column(Text, nullable=False)
    firma_paciente = Column(Text)  # Firma digital en base64
    ip_registro = Column(String(50))  # IP desde donde se firmó

    # Timestamps
    fecha_consentimiento = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    paciente = relationship("Patient", back_populates="consentimientos")
    servicio = relationship("Servicio")
    cita = relationship("Appointment")

    def __repr__(self):
        return f"<ConsentimientoPaciente {self.id}>"
