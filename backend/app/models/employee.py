"""
Modelo de Empleado
"""
from sqlalchemy import Column, Integer, String, Date, Boolean, TIMESTAMP, DECIMAL, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Tabla intermedia para empleado_especialidades (Many-to-Many)
empleado_especialidades = Table(
    'empleado_especialidades',
    Base.metadata,
    Column('empleado_id', Integer, ForeignKey('empleados.id'), primary_key=True),
    Column('especialidad_id', Integer, ForeignKey('cat_especialidades.id'), primary_key=True),
    Column('fecha_creacion', TIMESTAMP, server_default=func.now())
)


class Employee(Base):
    """Empleado"""
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, unique=True)
    sucursal_id = Column(Integer, ForeignKey("cat_sucursales.id"))

    # Información profesional
    numero_empleado = Column(String(20), unique=True)
    cedula_profesional = Column(String(20), unique=True)
    fecha_contratacion = Column(Date)
    
    # Especialidad (del Final.sql)
    especialidad_principal = Column(String(100))
    biografia_resumen = Column(Text)
    foto_perfil_url = Column(Text)

    # Información laboral
    puesto = Column(String(100))
    salario = Column(DECIMAL(10, 2))

    # Estado
    activo = Column(Boolean, default=True, index=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    usuario = relationship("User", back_populates="empleado")
    sucursal = relationship("Sucursal")
    especialidades = relationship("Especialidad", secondary=empleado_especialidades)
    citas_asignadas = relationship("Appointment", foreign_keys="Appointment.empleado_id", back_populates="empleado")
    consultas_realizadas = relationship("Consultation", foreign_keys="Consultation.empleado_id", back_populates="empleado")
    recetas_emitidas = relationship("Prescription", foreign_keys="Prescription.empleado_id", back_populates="empleado")

    def __repr__(self):
        return f"<Employee {self.numero_empleado}>"
