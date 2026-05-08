"""
Schemas de Historial Clínico
"""
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict


class ClinicalHistoryBase(BaseModel):
    """Schema base de Historial Clínico"""
    paciente_id: int = Field(..., description="ID del paciente")
    tipo_antecedente_id: int = Field(..., description="ID del tipo de antecedente")
    descripcion: str = Field(..., description="Descripción del antecedente")
    fecha_diagnostico: Optional[date] = Field(None, description="Fecha de diagnóstico")
    notas: Optional[str] = Field(None, description="Notas adicionales")
    activo: bool = Field(default=True, description="Antecedente activo/controlado")


class ClinicalHistoryCreate(ClinicalHistoryBase):
    """Schema para crear Historial Clínico"""
    pass


class ClinicalHistoryUpdate(BaseModel):
    """Schema para actualizar Historial Clínico"""
    tipo_antecedente_id: Optional[int] = None
    descripcion: Optional[str] = None
    fecha_diagnostico: Optional[date] = None
    notas: Optional[str] = None
    activo: Optional[bool] = None


class ClinicalHistoryResponse(ClinicalHistoryBase):
    """Schema de respuesta de Historial Clínico"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    # Información de relaciones
    paciente_nombre: Optional[str] = None
    tipo_antecedente_nombre: Optional[str] = None

    @classmethod
    def from_orm_with_relations(cls, history):
        """Constructor personalizado para incluir relaciones"""
        return cls(
            id=history.id,
            paciente_id=history.paciente_id,
            tipo_antecedente_id=history.tipo_antecedente_id,
            descripcion=history.descripcion,
            fecha_diagnostico=history.fecha_diagnostico,
            notas=history.notas,
            activo=history.activo,
            fecha_creacion=history.fecha_creacion,
            fecha_actualizacion=history.fecha_actualizacion,
            paciente_nombre=f"{history.paciente.usuario.nombre} {history.paciente.usuario.apellido_paterno}" if history.paciente and history.paciente.usuario else None,
            tipo_antecedente_nombre=history.tipo_antecedente.nombre if history.tipo_antecedente else None
        )
