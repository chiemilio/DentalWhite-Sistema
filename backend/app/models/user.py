"""
Modelo de Usuario
"""
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    """Usuario del sistema"""
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    # Información personal
    nombre = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100))

    # CURP y RFC
    curp = Column(String(18), unique=True, index=True)
    rfc = Column(String(13), unique=True)

    # Nacionalidad
    nacionalidad_id = Column(Integer, ForeignKey("cat_nacionalidades.id"))

    # Información de contacto
    telefono_principal = Column(String(20))
    telefono_secundario = Column(String(20))
    email_secundario = Column(String(100))
    whatsapp = Column(String(20))

    # Rol y estado
    rol_id = Column(Integer, ForeignKey("cat_roles.id"), nullable=False)
    activo = Column(Boolean, default=True, index=True)

    # Timestamps
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    ultimo_acceso = Column(TIMESTAMP)
    last_login = Column(TIMESTAMP)

    # Relationships
    nacionalidad = relationship("Nacionalidad")
    rol = relationship("Rol")
    paciente = relationship("Patient", back_populates="usuario", uselist=False)
    empleado = relationship("Employee", back_populates="usuario", uselist=False)

    def __repr__(self):
        return f"<User {self.email}>"

    @property
    def nombre_completo(self):
        """Retorna el nombre completo del usuario"""
        nombre = f"{self.nombre} {self.apellido_paterno}"
        if self.apellido_materno:
            nombre += f" {self.apellido_materno}"
        return nombre
