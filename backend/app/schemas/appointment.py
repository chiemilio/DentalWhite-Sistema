"""
Schemas de Cita
"""
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field, ConfigDict


class AppointmentBase(BaseModel):
    """Schema base de Cita"""
    paciente_id: int = Field(..., description="ID del paciente")
    empleado_id: int = Field(..., description="ID del empleado (doctor/dentista)")
    servicio_id: int = Field(..., description="ID del servicio")
    sucursal_id: int = Field(..., description="ID de la sucursal")
    estado_cita_id: int = Field(..., description="ID del estado de la cita")

    fecha_hora: datetime = Field(..., description="Fecha y hora de la cita")
    duracion_minutos: int = Field(default=30, ge=15, le=480, description="Duración en minutos")

    motivo: Optional[str] = Field(None, description="Motivo de la cita")
    notas: Optional[str] = Field(None, description="Notas adicionales")


class AppointmentCreate(AppointmentBase):
    """Schema para crear Cita"""
    pass


class AppointmentUpdate(BaseModel):
    """Schema para actualizar Cita"""
    empleado_id: Optional[int] = None
    servicio_id: Optional[int] = None
    sucursal_id: Optional[int] = None
    estado_cita_id: Optional[int] = None
    fecha_hora: Optional[datetime] = None
    duracion_minutos: Optional[int] = Field(None, ge=15, le=480)
    motivo: Optional[str] = None
    notas: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    """Schema de respuesta de Cita"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: Optional[str] = None
    fecha_hora: Optional[datetime] = Field(None, description="Fecha y hora combinadas de la cita")
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None

    # Información de relaciones
    paciente_nombre: Optional[str] = None
    empleado_nombre: Optional[str] = None
    servicio_nombre: Optional[str] = None
    sucursal_nombre: Optional[str] = None
    estado_nombre: Optional[str] = None

    @classmethod
    def from_orm_with_relations(cls, appointment):
        """Constructor personalizado para incluir relaciones"""
        from datetime import datetime
        # Combinar fecha y hora en un solo datetime
        if appointment.fecha and appointment.hora:
            fecha_hora = datetime.combine(appointment.fecha, appointment.hora)
        else:
            fecha_hora = None

        # Obtener nombres de relaciones de forma segura
        paciente_nombre = None
        try:
            if appointment.paciente and appointment.paciente.usuario:
                paciente_nombre = f"{appointment.paciente.usuario.nombre} {appointment.paciente.usuario.apellido_paterno}"
        except:
            paciente_nombre = None

        empleado_nombre = None
        try:
            if appointment.empleado and appointment.empleado.usuario:
                empleado_nombre = f"{appointment.empleado.usuario.nombre} {appointment.empleado.usuario.apellido_paterno}"
        except:
            empleado_nombre = None

        servicio_nombre = None
        try:
            if appointment.servicio:
                servicio_nombre = appointment.servicio.nombre
        except:
            servicio_nombre = None

        sucursal_nombre = None
        try:
            if appointment.sucursal:
                sucursal_nombre = appointment.sucursal.nombre
        except:
            sucursal_nombre = None

        estado_nombre = None
        try:
            if appointment.estado_cita:
                estado_nombre = appointment.estado_cita.nombre
        except:
            estado_nombre = None

        return cls(
            id=appointment.id,
            paciente_id=appointment.paciente_id,
            empleado_id=appointment.empleado_id,
            servicio_id=appointment.servicio_id,
            sucursal_id=appointment.sucursal_id,
            estado_cita_id=appointment.estado_cita_id,
            fecha=appointment.fecha.isoformat() if appointment.fecha else None,
            fecha_hora=fecha_hora,
            duracion_minutos=appointment.duracion_minutos,
            motivo=appointment.motivo_consulta,
            notas=appointment.notas,
            fecha_creacion=appointment.fecha_creacion,
            fecha_actualizacion=appointment.fecha_actualizacion,
            paciente_nombre=paciente_nombre,
            empleado_nombre=empleado_nombre,
            servicio_nombre=servicio_nombre,
            sucursal_nombre=sucursal_nombre,
            estado_nombre=estado_nombre
        )
