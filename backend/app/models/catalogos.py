"""
Modelos de Catálogos
"""
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, DECIMAL, JSON, Time, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class TipoPaciente(Base):
    """Catálogo de tipos de paciente"""
    __tablename__ = "cat_tipos_paciente"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)
    descripcion = Column(String)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class Sucursal(Base):
    """Catálogo de sucursales"""
    __tablename__ = "cat_sucursales"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String, nullable=False)
    telefono = Column(String(20))
    email = Column(String(100))
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class Nacionalidad(Base):
    """Catálogo de nacionalidades"""
    __tablename__ = "cat_nacionalidades"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    codigo_iso = Column(String(3))
    activo = Column(Boolean, default=True)


class Rol(Base):
    """Catálogo de roles"""
    __tablename__ = "cat_roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)
    descripcion = Column(String)
    permisos = Column(JSON)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())


class Especialidad(Base):
    """Catálogo de especialidades"""
    __tablename__ = "cat_especialidades"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    descripcion = Column(String)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())


class Servicio(Base):
    """Catálogo de servicios"""
    __tablename__ = "cat_servicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String)
    precio_base = Column(DECIMAL(10, 2))
    duracion_minutos = Column(Integer)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())


class MedioContacto(Base):
    """Catálogo de medios de contacto"""
    __tablename__ = "cat_medios_contacto"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)
    descripcion = Column(String)
    activo = Column(Boolean, default=True)


class EstadoCita(Base):
    """Catálogo de estados de cita"""
    __tablename__ = "cat_estados_cita"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)
    color = Column(String(7))
    descripcion = Column(String)
    activo = Column(Boolean, default=True)


class TipoAntecedente(Base):
    """Catálogo de tipos de antecedentes"""
    __tablename__ = "cat_tipos_antecedentes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    categoria = Column(String(50))
    descripcion = Column(String)
    activo = Column(Boolean, default=True)


class Horario(Base):
    """Catálogo de horarios por sucursal"""
    __tablename__ = "cat_horarios"

    id = Column(Integer, primary_key=True, index=True)
    sucursal_id = Column(Integer, ForeignKey("cat_sucursales.id"))
    hora = Column(String(5), nullable=False)
    hora_inicio = Column(Time, nullable=False, default="08:00:00")
    hora_fin = Column(Time, nullable=False, default="20:00:00")
    duracion_minutos = Column(Integer, nullable=False, default=30)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
