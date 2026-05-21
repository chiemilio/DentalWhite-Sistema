"""
Modelo de Historial Clínico de Ortodoncia
"""
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class HistorialClinicoOrtodoncia(Base):
    """Historial clínico completo de ortodoncia del paciente"""
    __tablename__ = "historial_clinico_ortodoncia"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)

    # Datos generales
    dni = Column(String(20))
    representante = Column(String(200))
    ocupacion = Column(String(200))
    nombre_doctor = Column(String(200))

    # Estado actual del paciente
    estado_fisico = Column(String(20))
    estado_dental = Column(String(20))

    # Antecedentes
    atencion_medica = Column(Text)

    # Examen de la cara
    forma = Column(String(100))
    simetria = Column(String(20))
    perfil = Column(String(100))
    frente = Column(String(100))
    orejas = Column(String(100))
    tic = Column(String(100))
    rictus = Column(String(100))
    linea_bipupilar = Column(String(100))

    # Línea de Holdaway
    musculatura_labial = Column(String(20))
    hiperactividad_mentoniana = Column(String(10))

    # Examen bucal
    relacion_molar = Column(String(100))
    relacion_canina = Column(String(100))
    relacion_incisal = Column(String(100))
    over_jet = Column(String(50))
    over_bite = Column(String(50))
    mordida_abierta = Column(String(50))
    linea_media = Column(String(100))
    dientes_ausentes = Column(String(200))
    dientes_malformados = Column(String(200))
    dientes_con_caries = Column(String(200))
    temporales = Column(String(100))
    mordida_cruzada = Column(String(20))
    tecnica_cepillado = Column(String(20))
    estado_parodontal = Column(String(20))

    # Examen radiográfico
    cefalografia = Column(String(200))
    ortoradiales = Column(String(200))
    palmar = Column(String(200))
    oclusal = Column(String(200))
    oblicua = Column(String(200))
    ortopantografias = Column(String(200))
    mesioradial = Column(String(200))

    # Hallazgos radiográficos
    ausencia_congenita = Column(String(200))
    supernumerarios = Column(String(200))
    quistes = Column(String(200))
    lesiones_periapicales = Column(String(200))
    inclusiones = Column(String(200))
    resorcion_radicular = Column(String(200))
    terceros_molares = Column(String(200))
    raices_enanas = Column(String(200))
    raices_anormales = Column(String(200))

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    paciente = relationship("Patient", back_populates="historial_ortodoncia")

    def __repr__(self):
        return f"<HistorialClinicoOrtodoncia {self.id}>"
