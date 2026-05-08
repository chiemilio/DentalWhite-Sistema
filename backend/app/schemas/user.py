"""
Schemas de Usuario
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    """Schema base de Usuario"""
    email: EmailStr = Field(..., description="Email único del usuario")
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre(s)")
    apellido_paterno: Optional[str] = Field(None, max_length=100, description="Apellido paterno")
    apellido_materno: Optional[str] = Field(None, max_length=100, description="Apellido materno")
    telefono: Optional[str] = Field(None, max_length=20, description="Teléfono")
    curp: Optional[str] = Field(None, min_length=18, max_length=18, description="CURP")
    rfc: Optional[str] = Field(None, min_length=12, max_length=13, description="RFC")
    nacionalidad_id: Optional[int] = Field(None, description="ID de nacionalidad")
    activo: bool = Field(default=True, description="Usuario activo")


class UserCreate(UserBase):
    """Schema para crear Usuario"""
    password: str = Field(..., min_length=8, description="Contraseña (mínimo 8 caracteres)")
    rol_id: Optional[int] = Field(None, description="ID del rol a asignar (opcional)")


class UserRegisterRequest(BaseModel):
    """Schema simplificado para registro de paciente"""
    email: EmailStr = Field(..., description="Email único del usuario")
    password: str = Field(..., min_length=8, description="Contraseña (mínimo 8 caracteres)")
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre(s)")
    apellido_paterno: Optional[str] = Field(None, max_length=100, description="Apellido paterno")
    apellido_materno: Optional[str] = Field(None, max_length=100, description="Apellido materno")
    telefono: Optional[str] = Field(None, max_length=20, description="Teléfono")
    rol_id: Optional[int] = Field(None, description="ID del rol (opcional)")


class UserUpdate(BaseModel):
    """Schema para actualizar Usuario"""
    email: Optional[EmailStr] = None
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    apellido_paterno: Optional[str] = Field(None, min_length=1, max_length=100)
    apellido_materno: Optional[str] = Field(None, max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)
    curp: Optional[str] = Field(None, min_length=18, max_length=18)
    rfc: Optional[str] = Field(None, min_length=12, max_length=13)
    nacionalidad_id: Optional[int] = None
    rol_id: Optional[int] = None
    activo: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8, description="Nueva contraseña")


class UserInDB(UserBase):
    """Schema de Usuario en base de datos (incluye password_hash)"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    password_hash: str
    rol_id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime


class UserResponse(UserBase):
    """Schema de respuesta de Usuario (sin password_hash)"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    rol_id: int
    rol_nombre: Optional[str] = Field(None, description="Nombre del rol")
    nacionalidad_nombre: Optional[str] = Field(None, description="Nombre de la nacionalidad")
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    @classmethod
    def from_orm_with_relations(cls, user):
        """Constructor personalizado para incluir nombres de relaciones"""
        return cls(
            id=user.id,
            email=user.email,
            nombre=user.nombre,
            apellido_paterno=user.apellido_paterno,
            apellido_materno=user.apellido_materno,
            curp=user.curp,
            rfc=user.rfc,
            nacionalidad_id=user.nacionalidad_id,
            rol_id=user.rol_id,
            activo=user.activo,
            rol_nombre=user.rol.nombre if user.rol else None,
            nacionalidad_nombre=user.nacionalidad.nombre if user.nacionalidad else None,
            fecha_creacion=user.fecha_creacion,
            fecha_actualizacion=user.fecha_actualizacion
        )
