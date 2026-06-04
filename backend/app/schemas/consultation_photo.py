from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ConsultationPhotoCreate(BaseModel):
    tipo_foto: str = Field(..., pattern="^(ANTES|DURANTE|DESPUES)$")
    descripcion: Optional[str] = None


class ConsultationPhotoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    consulta_id: int
    servicio_id: Optional[int] = None
    tipo_foto: str
    url_foto: str
    descripcion: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
