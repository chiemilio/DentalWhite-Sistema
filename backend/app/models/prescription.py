"""
Modelos de Receta y Medicamentos de Receta
"""
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Text, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Prescription(Base):
    """Receta médica"""
    __tablename__ = "recetas"

    id = Column(Integer, primary_key=True, index=True)
    consulta_id = Column(Integer, ForeignKey("consultas.id"), nullable=False, unique=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False, index=True)

    # Información de la receta
    folio = Column(String(50), unique=True, nullable=False, index=True)

    # Signos vitales (copiados de la consulta para histórico)
    peso = Column(DECIMAL(10, 2))
    talla = Column(DECIMAL(10, 2))
    temperatura = Column(DECIMAL(10, 2))
    presion_sistolica = Column(Integer)
    presion_diastolica = Column(Integer)
    pulso = Column(Integer)
    glucosa = Column(DECIMAL(10, 2))

    # Indicaciones generales
    indicaciones_generales = Column(Text)

    # Estado
    activo = Column(Boolean, default=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    consulta = relationship("Consultation", back_populates="receta")
    paciente = relationship("Patient")
    empleado = relationship("Employee", foreign_keys=[empleado_id], back_populates="recetas_emitidas")
    medicamentos = relationship("PrescriptionMedicine", back_populates="receta")

    def __repr__(self):
        return f"<Prescription {self.folio}>"


class PrescriptionMedicine(Base):
    """Medicamentos de la receta"""
    __tablename__ = "receta_medicamentos"

    id = Column(Integer, primary_key=True, index=True)
    receta_id = Column(Integer, ForeignKey("recetas.id"), nullable=False, index=True)

    # Información del medicamento
    medicamento = Column(String(200), nullable=False)
    presentacion = Column(String(100))  # Tabletas, Jarabe, Cápsulas, etc.
    dosis = Column(String(100), nullable=False)  # "1 tableta cada 8 horas"
    duracion = Column(String(100))  # "7 días", "2 semanas"
    indicaciones = Column(Text)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    receta = relationship("Prescription", back_populates="medicamentos")

    def __repr__(self):
        return f"<PrescriptionMedicine {self.medicamento}>"
