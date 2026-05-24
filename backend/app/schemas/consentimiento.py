from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ConsentimientoBase(BaseModel):
    paciente_id: int
    servicio_id: int
    cita_id: Optional[int] = None
    texto_consentimiento: str
    firma_paciente: Optional[str] = None


class ConsentimientoCreate(ConsentimientoBase):
    pass


class ConsentimientoUpdate(BaseModel):
    texto_consentimiento: Optional[str] = None
    firma_paciente: Optional[str] = None


class ConsentimientoResponse(ConsentimientoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha_consentimiento: datetime
    paciente_nombre: Optional[str] = None
    servicio_nombre: Optional[str] = None
