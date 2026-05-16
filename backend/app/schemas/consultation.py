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

    # Datos clínicos (mapeo a columnas de la tabla consultas)
    reconocimiento_hallazgos: Optional[str] = Field(None, description="Reconocimiento/Hallazgos")
    diagnostico: Optional[str] = Field(None, description="Diagnóstico")
    tratamiento_indicaciones: Optional[str] = Field(None, description="Tratamiento/Indicaciones")
    notas_adicionales: Optional[str] = Field(None, description="Notas adicionales")


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
    reconocimiento_hallazgos: Optional[str] = None
    diagnostico: Optional[str] = None
    tratamiento_indicaciones: Optional[str] = None
    notas_adicionales: Optional[str] = None


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
            reconocimiento_hallazgos=consultation.reconocimiento_hallazgos,
            diagnostico=consultation.diagnostico,
            tratamiento_indicaciones=consultation.tratamiento_indicaciones,
            notas_adicionales=consultation.notas_adicionales,
            fecha_creacion=consultation.fecha_creacion,
            fecha_actualizacion=consultation.fecha_actualizacion,
            paciente_nombre=f"{cita.paciente.usuario.nombre} {cita.paciente.usuario.apellido_paterno}" if cita and cita.paciente and cita.paciente.usuario else None,
            empleado_nombre=f"{cita.empleado.usuario.nombre} {cita.empleado.usuario.apellido_paterno}" if cita and cita.empleado and cita.empleado.usuario else None,
            fecha_cita=str(cita.fecha) if cita and cita.fecha else None
        )