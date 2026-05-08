"""
Endpoints de Catálogos
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict

from app.database import get_db
from app.models.catalogos import (
    TipoPaciente, Sucursal, Nacionalidad, Rol, Especialidad,
    Servicio, MedioContacto, EstadoCita, TipoAntecedente, Horario
)
from app.models.appointment import BloqueoAgenda

router = APIRouter()


# Schemas for bloqueos
from datetime import date
class BloqueoAgendaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sucursal_id: int | None = None
    fecha_inicio: date
    fecha_fin: date
    tipo_bloqueo: str | None = None
    activo: bool


# Schemas for horarios
from datetime import time
class HorarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sucursal_id: int | None = None
    hora_inicio: time
    hora_fin: time
    duracion_minutos: int
    activo: bool


# Schemas genéricos para catálogos
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


@router.get("/tipos-paciente", response_model=List[CatalogoBase])
def get_tipos_paciente(db: Session = Depends(get_db)):
    """Obtiene todos los tipos de paciente"""
    return db.query(TipoPaciente).filter(TipoPaciente.activo == True).all()


@router.get("/roles", response_model=List[RolResponse])
def get_roles(db: Session = Depends(get_db)):
    """Obtiene todos los roles"""
    return db.query(Rol).filter(Rol.activo == True).all()


@router.get("/sucursales", response_model=List[SucursalResponse])
def get_sucursales(db: Session = Depends(get_db)):
    """Obtiene todas las sucursales"""
    return db.query(Sucursal).filter(Sucursal.activo == True).all()


@router.get("/sucursales/", response_model=List[SucursalResponse])
def get_sucursales_slash(db: Session = Depends(get_db)):
    """Obtiene todas las sucursales (with trailing slash)"""
    return db.query(Sucursal).filter(Sucursal.activo == True).all()


@router.get("/servicios", response_model=List[ServicioResponse])
def get_servicios(db: Session = Depends(get_db)):
    """Obtiene todos los servicios"""
    return db.query(Servicio).filter(Servicio.activo == True).all()


@router.get("/servicios/", response_model=List[ServicioResponse])
def get_servicios_slash(db: Session = Depends(get_db)):
    """Obtiene todos los servicios (with trailing slash)"""
    return db.query(Servicio).filter(Servicio.activo == True).all()


@router.get("/estadoscita", response_model=List[CatalogoBase])
def get_estados_cita_singular(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estadoscita/", response_model=List[CatalogoBase])
def get_estados_cita_slash(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita (with trailing slash)"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estadoscita", response_model=List[CatalogoBase])
def get_estados_cita_backwards(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita (backwards compat)"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estadoscita/", response_model=List[CatalogoBase])
def get_estados_cita_backwards_slas(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita (backwards compat)"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estados-Calais", response_model=List[CatalogoBase])
def get_estados_cita_hyphen(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estados-Calais/", response_model=List[CatalogoBase])
def get_estados_cita_hyphen_slash(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


# Exact path from frontend error: /estados-cita/
@router.get("/estados-cita", response_model=List[CatalogoBase])
def get_estados_cita_exact(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita (exact frontend path)"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estados-cita/", response_model=List[CatalogoBase])
def get_estados_cita_exact_slash(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita (exact frontend path with slash)"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


# Also add without hyphen for compatibility
@router.get("/estadoscita", response_model=List[CatalogoBase])
def get_estadoscita_no_hyphen(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estadoscita/", response_model=List[CatalogoBase])
def get_estadoscita_no_hyphen_slash(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


# Exact path from frontend error: /estados-c
@router.get("/estados-c/", response_model=List[CatalogoBase])
def get_estados_c_slash(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estados-c", response_model=List[CatalogoBase])
def get_estados_c(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


# Alternative path
@router.get("/estados-c/", response_model=List[CatalogoBase])
def get_estados_c_alt(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


# For backwards compatibility
@router.get("/estados-ci/", response_model=List[CatalogoBase])
def get_estados_ci_slash(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/estados-ci", response_model=List[CatalogoBase])
def get_estados_ci(db: Session = Depends(get_db)):
    """Obtiene todos los estados de cita"""
    return db.query(EstadoCita).filter(EstadoCita.activo == True).all()


@router.get("/tipos-antecedente", response_model=List[CatalogoBase])
def get_tipos_antecedente(db: Session = Depends(get_db)):
    """Obtiene todos los tipos de antecedente"""
    return db.query(TipoAntecedente).filter(TipoAntecedente.activo == True).all()


@router.get("/bloqueos-agenda", response_model=List[BloqueoAgendaResponse])
def get_bloqueos_agenda(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    """Obtiene los bloqueos de agenda"""
    query = db.query(BloqueoAgenda).filter(BloqueoAgenda.activo == True)
    if sucursal_id:
        query = query.filter(BloqueoAgenda.sucursal_id == sucursal_id)
    return query.all()


@router.get("/bloqueos-agenda/", response_model=List[BloqueoAgendaResponse])
def get_bloqueos_agenda_slash(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    """Obtiene los bloqueos de agenda (with trailing slash)"""
    query = db.query(BloqueoAgenda).filter(BloqueoAgenda.activo == True)
    if sucursal_id:
        query = query.filter(BloqueoAgenda.sucursal_id == sucursal_id)
    return query.all()


@router.get("/horarios", response_model=List[HorarioResponse])
def get_horarios(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    """Obtiene los horarios por sucursal"""
    from app.models.catalogos import Horario
    query = db.query(Horario).filter(Horario.activo == True)
    if sucursal_id:
        query = query.filter(Horario.sucursal_id == sucursal_id)
    return query.all()


@router.get("/horarios/", response_model=List[HorarioResponse])
def get_horarios_slash(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    """Obtiene los horarios por sucursal (with trailing slash)"""
    from app.models.catalogos import Horario
    query = db.query(Horario).filter(Horario.activo == True)
    if sucursal_id:
        query = query.filter(Horario.sucursal_id == sucursal_id)
    return query.all()
