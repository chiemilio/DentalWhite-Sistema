from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any

class ExpedienteCreate(BaseModel):
    paciente_id: int = Field(..., ge=1)
    medico_id: Optional[int] = Field(None, ge=1)
    datos: dict[str, Any] = Field(default_factory=dict, description="Datos del expediente en formato JSON")

class ExpedienteUpdate(BaseModel):
    datos: dict[str, Any] = Field(default_factory=dict, description="Datos del expediente en formato JSON")
    medico_id: Optional[int] = Field(None, ge=1)

class ExpedienteResponse(BaseModel):
    id: int
    paciente_id: int
    medico_id: Optional[int] = None
    datos: dict[str, Any]
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True
