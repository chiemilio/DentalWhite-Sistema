"""
Schemas de Paciente
"""
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict, model_validator


class PatientBase(BaseModel):
    """Schema base de Paciente"""
    tipo_paciente_id: Optional[int] = Field(None, description="ID del tipo de paciente")
    sucursal_id: Optional[int] = Field(None, description="ID de la sucursal")
    fecha_nacimiento: Optional[date] = Field(None, description="Fecha de nacimiento")
    sexo: Optional[str] = Field(None, description="Masculino, Femenino, No binario, No informar")

    @model_validator(mode='after')
    def validate_nacimiento(self):
        if self.fecha_nacimiento and self.fecha_nacimiento > date.today():
            raise ValueError('La fecha de nacimiento no puede ser futura')
        if self.fecha_nacimiento and self.fecha_nacimiento < date(1900, 1, 1):
            raise ValueError('La fecha de nacimiento no puede ser anterior a 1900')
        return self

    ocupacion: Optional[str] = Field(None, max_length=100)
    firma_digitalizada: Optional[str] = Field(None, description="Firma digitalizada para consentimiento")

    # Dirección
    direccion: Optional[str] = Field(None, max_length=255)
    ciudad: Optional[str] = Field(None, max_length=100)
    estado: Optional[str] = Field(None, max_length=100)
    codigo_postal: Optional[str] = Field(None, max_length=10)

    # Contacto de emergencia
    telefono_emergencia: Optional[str] = Field(None, max_length=20)
    contacto_emergencia: Optional[str] = Field(None, max_length=100)

    # Tutor (para menores)
    tutor_nombre: Optional[str] = Field(None, max_length=200)
    tutor_telefono: Optional[str] = Field(None, max_length=20)
    tutor_relacion: Optional[str] = Field(None, max_length=50)


class PatientCreate(PatientBase):
    """Schema para crear Paciente"""
    nombre: str = Field(..., description="Nombre del paciente")
    apellido: str = Field(..., description="Apellido del paciente")
    email: Optional[str] = Field(None, description="Email del usuario")
    telefono: Optional[str] = Field(None, description="Teléfono del usuario")


class PatientUpdate(PatientBase):
    """Schema para actualizar Paciente"""
    tipo_paciente_id: Optional[int] = Field(None, ge=1)
    sucursal_id: Optional[int] = Field(None, ge=1)
    fecha_nacimiento: Optional[date] = Field(None, description="Fecha de nacimiento")
    sexo: Optional[str] = Field(None, pattern=r"^(Masculino|Femenino|No binario|No informar)$")
    ocupacion: Optional[str] = Field(None, max_length=100, min_length=1)
    firma_digitalizada: Optional[str] = None
    direccion: Optional[str] = Field(None, max_length=255, min_length=1)
    ciudad: Optional[str] = Field(None, max_length=100, min_length=1)
    estado: Optional[str] = Field(None, max_length=100, min_length=1)
    codigo_postal: Optional[str] = Field(None, max_length=10, min_length=3)
    telefono_emergencia: Optional[str] = Field(None, max_length=20, min_length=7)
    contacto_emergencia: Optional[str] = Field(None, max_length=100, min_length=1)
    tutor_nombre: Optional[str] = Field(None, max_length=200, min_length=1)
    tutor_telefono: Optional[str] = Field(None, max_length=20, min_length=7)
    tutor_relacion: Optional[str] = Field(None, max_length=50, min_length=1)


class PatientResponse(PatientBase):
    """Schema de respuesta de Paciente"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    numero_expediente: Optional[str] = None
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    activo: bool

    # Información del usuario asociado
    usuario_nombre: Optional[str] = None
    usuario_email: Optional[str] = None
    usuario_telefono: Optional[str] = None

    @classmethod
    def from_orm_with_relations(cls, patient):
        """Constructor personalizado para incluir datos del usuario"""
        usuario = getattr(patient, 'usuario', None)
        return cls(
            id=patient.id,
            usuario_id=patient.usuario_id,
            tipo_paciente_id=patient.tipo_paciente_id,
            sucursal_id=patient.sucursal_id,
            numero_expediente=patient.numero_expediente,
            fecha_nacimiento=patient.fecha_nacimiento,
            sexo=patient.sexo,
            ocupacion=patient.ocupacion,
            firma_digitalizada=patient.firma_digitalizada,
            direccion=patient.direccion,
            ciudad=patient.ciudad,
            estado=patient.estado,
            codigo_postal=patient.codigo_postal,
            telefono_emergencia=patient.telefono_emergencia,
            contacto_emergencia=patient.contacto_emergencia,
            tutor_nombre=patient.tutor_nombre,
            tutor_telefono=patient.tutor_telefono,
            tutor_relacion=patient.tutor_relacion,
            activo=patient.activo,
            fecha_creacion=patient.fecha_creacion,
            fecha_actualizacion=patient.fecha_actualizacion,
            usuario_nombre=f"{usuario.nombre} {usuario.apellido_paterno}" if usuario else None,
            usuario_email=usuario.email if usuario else None,
            usuario_telefono=usuario.telefono_principal if usuario else None
        )