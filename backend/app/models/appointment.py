"""
Modelos de Citas y Bloqueos de Agenda
"""
from sqlalchemy import Column, Integer, String, Date, Time, Boolean, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Appointment(Base):
    """Cita médica"""
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    empleado_id = Column(Integer, ForeignKey("empleados.id"), nullable=False, index=True)
    servicio_id = Column(Integer, ForeignKey("cat_servicios.id"), nullable=False)
    sucursal_id = Column(Integer, ForeignKey("cat_sucursales.id"), nullable=False)
    estado_cita_id = Column(Integer, ForeignKey("cat_estados_cita.id"), nullable=False)
    medio_contacto_id = Column(Integer, ForeignKey("cat_medios_contacto.id"))  # Nullable en backend, NOT NULL en SQL

    # Información de la cita
    fecha = Column(Date, nullable=False, index=True)
    hora = Column(Time, nullable=False)
    duracion_minutos = Column(Integer, default=30)
    motivo_consulta = Column(Text)

    # Notas
    notas = Column(Text)
    notas_cancelacion = Column(Text)

    # Estado
    activo = Column(Boolean, default=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    paciente = relationship("Patient", back_populates="citas")
    empleado = relationship("Employee", foreign_keys=[empleado_id], back_populates="citas_asignadas")
    servicio = relationship("Servicio")
    sucursal = relationship("Sucursal")
    estado_cita = relationship("EstadoCita")
    medio_contacto = relationship("MedioContacto")
    consulta = relationship("Consultation", back_populates="cita", uselist=False)
    pago = relationship("Payment", back_populates="cita", uselist=False)

    def __repr__(self):
        return f"<Appointment {self.id} - {self.fecha} {self.hora}>"


class BloqueoAgenda(Base):
    """Bloqueo de agenda (días no disponibles)"""
    __tablename__ = "bloqueos_agenda"

    id = Column(Integer, primary_key=True, index=True)
    sucursal_id = Column(Integer, ForeignKey("cat_sucursales.id"))
    empleado_id = Column(Integer, ForeignKey("empleados.id"))
    horario_id = Column(Integer, ForeignKey("cat_horarios.id"))

    # Período del bloqueo
    fecha_inicio = Column(Date, nullable=False, index=True)
    fecha_fin = Column(Date, nullable=False, index=True)

    # Rango horario (opcional - si es null, bloquea todo el día)
    hora_inicio = Column(Time)
    hora_fin = Column(Time)

    # Información del bloqueo
    motivo = Column(String(255))
    descripcion = Column(Text)

    # Tipo de bloqueo
    tipo_bloqueo = Column(String(50))  # 'VACACIONES', 'CAPACITACION', 'FESTIVO', etc.

    # Estado
    activo = Column(Boolean, default=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    sucursal = relationship("Sucursal")
    empleado = relationship("Employee")
    horario = relationship("Horario")

    def __repr__(self):
        return f"<BloqueoAgenda {self.id} - {self.fecha_inicio} to {self.fecha_fin}>"
