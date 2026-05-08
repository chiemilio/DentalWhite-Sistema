"""
Schemas de Receta
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class PrescriptionMedicineBase(BaseModel):
    """Schema base de Medicamento en Receta"""
    medicamento: str = Field(..., max_length=200, description="Nombre del medicamento")
    presentacion: Optional[str] = Field(None, max_length=100, description="Presentación del medicamento")
    dosis: str = Field(..., max_length=200, description="Dosis prescrita")
    frecuencia: str = Field(..., max_length=200, description="Frecuencia de administración")
    duracion: str = Field(..., max_length=100, description="Duración del tratamiento")
    indicaciones: Optional[str] = Field(None, description="Indicaciones especiales")


class PrescriptionMedicineCreate(PrescriptionMedicineBase):
    """Schema para crear Medicamento en Receta"""
    pass


class PrescriptionMedicineResponse(PrescriptionMedicineBase):
    """Schema de respuesta de Medicamento en Receta"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    receta_id: int


class PrescriptionBase(BaseModel):
    """Schema base de Receta"""
    consulta_id: int = Field(..., description="ID de la consulta asociada")
    indicaciones_generales: Optional[str] = Field(None, description="Indicaciones generales")


class PrescriptionCreate(PrescriptionBase):
    """Schema para crear Receta"""
    medicamentos: List[PrescriptionMedicineCreate] = Field(..., min_length=1, description="Lista de medicamentos")


class PrescriptionResponse(PrescriptionBase):
    """Schema de respuesta de Receta"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    folio: str
    fecha_emision: datetime

    # Medicamentos
    medicamentos: List[PrescriptionMedicineResponse] = Field(default=[])

    # Información de la consulta
    paciente_nombre: Optional[str] = None
    empleado_nombre: Optional[str] = None
    fecha_consulta: Optional[datetime] = None

    @classmethod
    def from_orm_with_relations(cls, prescription):
        """Constructor personalizado para incluir relaciones"""
        consulta = prescription.consulta
        cita = consulta.cita if consulta else None

        return cls(
            id=prescription.id,
            consulta_id=prescription.consulta_id,
            folio=prescription.folio,
            indicaciones_generales=prescription.indicaciones_generales,
            fecha_emision=prescription.fecha_emision,
            medicamentos=[
                PrescriptionMedicineResponse.model_validate(med)
                for med in prescription.medicamentos
            ] if prescription.medicamentos else [],
            paciente_nombre=f"{cita.paciente.usuario.nombre} {cita.paciente.usuario.apellido_paterno}" if cita and cita.paciente and cita.paciente.usuario else None,
            empleado_nombre=f"{cita.empleado.usuario.nombre} {cita.empleado.usuario.apellido_paterno}" if cita and cita.empleado and cita.empleado.usuario else None,
            fecha_consulta=consulta.fecha_creacion if consulta else None
        )
