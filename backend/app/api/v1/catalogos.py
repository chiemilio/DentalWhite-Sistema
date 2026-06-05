"""
Endpoints de Catálogos
"""
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict

from app.database import get_db
from app.models.catalogos import (
    TipoPaciente, Sucursal, Rol, Servicio, EstadoCita, TipoAntecedente, Horario
)
from app.models.appointment import BloqueoAgenda

router = APIRouter()


# Schemas
from datetime import date, time
class BloqueoAgendaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sucursal_id: int | None = None
    fecha_inicio: date
    fecha_fin: date
    tipo_bloqueo: str | None = None
    activo: bool


class HorarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sucursal_id: int | None = None
    hora: str
    hora_inicio: time
    hora_fin: time
    duracion_minutos: int
    activo: bool


class CatalogoBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nombre: str
    activo: bool


class RolResponse(CatalogoBase):
    permisos: dict | None = None


class ServicioResponse(CatalogoBase):
    descripcion: str | None = None
    duracion_minutos: int | None = None
    precio_base: float | None = None


class SucursalResponse(CatalogoBase):
    direccion: str | None = None
    telefono: str | None = None
    email: str | None = None


class DisponibilidadRequest(BaseModel):
    fecha: date
    hora: str
    sucursal_id: int | None = None
    empleado_id: int | None = None


class DisponibilidadResponse(BaseModel):
    disponible: bool
    mensaje: str


@router.get("/tipos-paciente", response_model=List[CatalogoBase])
def get_tipos_paciente(db: Session = Depends(get_db)):
    return db.query(TipoPaciente).filter(TipoPaciente.activo == True).all()


@router.get("/roles", response_model=List[RolResponse])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Rol).filter(Rol.activo == True).all()


@router.get("/sucursales", response_model=List[SucursalResponse])
def get_sucursales(db: Session = Depends(get_db)):
    return db.query(Sucursal).filter(Sucursal.activo == True).all()


@router.get("/servicios", response_model=List[ServicioResponse])
def get_servicios(db: Session = Depends(get_db)):
    return db.query(Servicio).filter(Servicio.activo == True).all()


@router.get("/estados-cita", response_model=List[CatalogoBase])
def get_estados_cita(db: Session = Depends(get_db)):
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estadoscita", response_model=List[CatalogoBase])
def get_estadoscita(db: Session = Depends(get_db)):
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/tipos-antecedente", response_model=List[CatalogoBase])
def get_tipos_antecedente(db: Session = Depends(get_db)):
    return db.query(TipoAntecedente).filter(TipoAntecedente.activo == True).all()


@router.get("/bloqueos-agenda", response_model=List[BloqueoAgendaResponse])
def get_bloqueos_agenda(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(BloqueoAgenda).filter(BloqueoAgenda.activo == True)
    if sucursal_id:
        query = query.filter(BloqueoAgenda.sucursal_id == sucursal_id)
    return query.all()


@router.get("/horarios", response_model=List[HorarioResponse])
def get_horarios(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Horario).filter(Horario.activo == True)
    if sucursal_id:
        query = query.filter(Horario.sucursal_id == sucursal_id)
    return query.all()


@router.post("/validar-disponibilidad", response_model=DisponibilidadResponse)
def validar_disponibilidad(request: DisponibilidadRequest, db: Session = Depends(get_db)):
    from datetime import time as dt_time
    from app.models.appointment import Appointment, BloqueoAgenda

    fecha = request.fecha
    hora_str = request.hora

    try:
        hora_obj = dt_time.fromisoformat(hora_str)
    except ValueError:
        return DisponibilidadResponse(
            disponible=False,
            mensaje=f"Formato de hora inválido: {hora_str}"
        )

    query_citas = db.query(Appointment).filter(
        Appointment.activo == True,
        Appointment.fecha == fecha,
        Appointment.hora == hora_obj
    )
    if request.sucursal_id:
        query_citas = query_citas.filter(Appointment.sucursal_id == request.sucursal_id)
    if request.empleado_id:
        query_citas = query_citas.filter(Appointment.empleado_id == request.empleado_id)

    if query_citas.first():
        return DisponibilidadResponse(
            disponible=False,
            mensaje=f"Ya existe una cita programada para el {fecha} a las {hora_str}"
        )

    query_bloqueos = db.query(BloqueoAgenda).filter(
        BloqueoAgenda.activo == True,
        BloqueoAgenda.fecha_inicio <= fecha,
        BloqueoAgenda.fecha_fin >= fecha
    )
    if request.sucursal_id:
        query_bloqueos = query_bloqueos.filter(BloqueoAgenda.sucursal_id == request.sucursal_id)
    if request.empleado_id:
        query_bloqueos = query_bloqueos.filter(BloqueoAgenda.empleado_id == request.empleado_id)

    for bloqueo in query_bloqueos.all():
        if bloqueo.horario_id:
            horario = db.query(Horario).filter(Horario.id == bloqueo.horario_id).first()
            if horario and hasattr(horario, 'hora') and horario.hora == hora_str:
                return DisponibilidadResponse(
                    disponible=False,
                    mensaje=f"Horario {hora_str} no disponible - bloqueado"
                )
        if bloqueo.hora_inicio and bloqueo.hora_fin:
            if bloqueo.hora_inicio <= hora_obj <= bloqueo.hora_fin:
                return DisponibilidadResponse(
                    disponible=False,
                    mensaje=f"Horario {hora_str} no disponible - bloqueado"
                )
        elif not bloqueo.horario_id:
            return DisponibilidadResponse(
                disponible=False,
                mensaje=f"Día {fecha} no disponible - bloqueado"
            )

    return DisponibilidadResponse(disponible=True, mensaje="Horario disponible")
