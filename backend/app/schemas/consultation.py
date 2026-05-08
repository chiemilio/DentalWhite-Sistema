"""
Schemas de Consulta
"""
from typing import Optional
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class ConsultationBase(BaseModel):
    """Schema base de Consulta"""
    cita_id: int = Field(..., description="ID de la cita asociada")

    # Signos vitales
    peso: Optional[Decimal] = Field(None, ge=0, le=500, description="Peso en kg")
    talla: Optional[Decimal] = Field(None, ge=0, le=300, description="Talla en cm")
    temperatura: Optional[Decimal] = Field(None, ge=30, le=45, description="Temperatura en °C")
    presion_sistolica: Optional[int] = Field(None, ge=50, le=300, description="Presión sistólica")
    presion_diastolica: Optional[int] = Field(None, ge=30, le=200, description="Presión diastólica")
    pulso: Optional[int] = Field(None, ge=30, le=250, description="Pulso en ppm")
    glucosa: Optional[Decimal] = Field(None, ge=0, le=1000, description="Glucosa en mg/dL")

    # Datos clínicos
    motivo_consulta: str = Field(..., description="Motivo de la consulta")
    padecimiento_actual: Optional[str] = Field(None, description="Descripción del padecimiento")
    exploracion_fisica: Optional[str] = Field(None, description="Hallazgos de exploración física")
    diagnostico: Optional[str] = Field(None, description="Diagnóstico")
    plan_tratamiento: Optional[str] = Field(None, description="Plan de tratamiento")
    notas: Optional[str] = Field(None, description="Notas adicionales")


class ConsultationCreate(ConsultationBase):
    """Schema para crear Consulta"""
    pass


class ConsultationUpdate(BaseModel):
    """Schema para actualizar Consulta"""
    peso: Optional[Decimal] = Field(None, ge=0, le=500)
    talla: Optional[Decimal] = Field(None, ge=0, le=300)
    temperatura: Optional[Decimal] = Field(None, ge=30, le=45)
    presion_sistolica: Optional[int] = Field(None, ge=50, le=300)
    presion_diastolica: Optional[int] = Field(None, ge=30, le=200)
    pulso: Optional[int] = Field(None, ge=30, le=250)
    glucosa: Optional[Decimal] = Field(None, ge=0, le=1000)
    motivo_consulta: Optional[str] = None
    padecimiento_actual: Optional[str] = None
    exploracion_fisica: Optional[str] = None
    diagnostico: Optional[str] = None
    plan_tratamiento: Optional[str] = None
    notas: Optional[str] = None


class ConsultationResponse(ConsultationBase):
    """Schema de respuesta de Consulta"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    # Información de la cita
    paciente_nombre: Optional[str] = None
    empleado_nombre: Optional[str] = None
    fecha_cita: Optional[datetime] = None

    @classmethod
    def from_orm_with_relations(cls, consultation):
        """Constructor personalizado para incluir relaciones"""
        cita = consultation.cita
        return cls(
            id=consultation.id,
            cita_id=consultation.cita_id,
            peso=consultation.peso,
            talla=consultation.talla,
            temperatura=consultation.temperatura,
            presion_sistolica=consultation.presion_sistolica,
            presion_diastolica=consultation.presion_diastolica,
            pulso=consultation.pulso,
            glucosa=consultation.glucosa,
            motivo_consulta=consultation.motivo_consulta,
            padecimiento_actual=consultation.padecimiento_actual,
            exploracion_fisica=consultation.exploracion_fisica,
            diagnostico=consultation.diagnostico,
            plan_tratamiento=consultation.plan_tratamiento,
            notas=consultation.notas,
            fecha_creacion=consultation.fecha_creacion,
            fecha_actualizacion=consultation.fecha_actualizacion,
            paciente_nombre=f"{cita.paciente.usuario.nombre} {cita.paciente.usuario.apellido_paterno}" if cita and cita.paciente and cita.paciente.usuario else None,
            empleado_nombre=f"{cita.empleado.usuario.nombre} {cita.empleado.usuario.apellido_paterno}" if cita and cita.empleado and cita.empleado.usuario else None,
            fecha_cita=cita.fecha_hora if cita else None
        )
