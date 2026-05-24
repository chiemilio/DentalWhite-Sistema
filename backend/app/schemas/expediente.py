from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class ExpedienteCreate(BaseModel):
    paciente_id: int
    medico_id: Optional[int] = None
    datos: dict[str, Any]

class ExpedienteUpdate(BaseModel):
    datos: dict[str, Any]
    medico_id: Optional[int] = None

class ExpedienteResponse(BaseModel):
    id: int
    paciente_id: int
    medico_id: Optional[int] = None
    datos: dict[str, Any]
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True
