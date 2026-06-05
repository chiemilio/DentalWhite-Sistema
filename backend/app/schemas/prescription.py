"""
Schemas de Receta
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class PrescriptionMedicineBase(BaseModel):
    """Schema base de Medicamento en Receta"""
    medicamento: Optional[str] = Field(None, max_length=200, description="Nombre del medicamento")
    presentacion: Optional[str] = Field(None, max_length=100, description="Presentación del medicamento")
    dosis: Optional[str] = Field(None, max_length=200, description="Dosis prescrita")
    duracion: Optional[str] = Field(None, max_length=100, description="Duración del tratamiento")
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

    # Signos vitales con validación de rangos
    peso: Optional[float] = Field(None, ge=1.0, le=400.0, description="Peso en kg (1-400)")
    talla: Optional[float] = Field(None, ge=10.0, le=250.0, description="Talla en cm (10-250)")
    temperatura: Optional[float] = Field(None, ge=32.0, le=43.0, description="Temperatura en °C (32-43)")
    presion_sistolica: Optional[int] = Field(None, ge=50, le=300, description="Presión sistólica (50-300)")
    presion_diastolica: Optional[int] = Field(None, ge=30, le=200, description="Presión diastólica (30-200)")
    pulso: Optional[int] = Field(None, ge=20, le=300, description="Pulso en ppm (20-300)")
    glucosa: Optional[float] = Field(None, ge=10.0, le=600.0, description="Glucosa en mg/dL (10-600)")


class PrescriptionCreate(PrescriptionBase):
    """Schema para crear Receta"""
    medicamentos: List[PrescriptionMedicineCreate] = Field(default_factory=list, description="Lista de medicamentos")


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
            fecha_emision=prescription.fecha_creacion,
            peso=prescription.peso,
            talla=prescription.talla,
            temperatura=prescription.temperatura,
            presion_sistolica=prescription.presion_sistolica,
            presion_diastolica=prescription.presion_diastolica,
            pulso=prescription.pulso,
            glucosa=prescription.glucosa,
            medicamentos=[
                PrescriptionMedicineResponse.model_validate(med)
                for med in prescription.medicamentos
            ] if prescription.medicamentos else [],
            paciente_nombre=f"{cita.paciente.usuario.nombre} {cita.paciente.usuario.apellido_paterno}" if cita and cita.paciente and cita.paciente.usuario else None,
            empleado_nombre=f"{cita.empleado.usuario.nombre} {cita.empleado.usuario.apellido_paterno}" if cita and cita.empleado and cita.empleado.usuario else None,
            fecha_consulta=consulta.fecha_creacion if consulta else None
        )
