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
from datetime import time, date
class HorarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sucursal_id: int | None = None
    hora: str
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


@router.get("/debug-horarios")
def debug_horarios(sucursal_id: int | None = None, db: Session = Depends(get_db)):
    """Debug: obtener todos los horarios de la tabla"""
    from app.models.catalogos import Horario
    from sqlalchemy import text
    
    try:
        result = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cat_horarios'"))
        columns = [dict(row) for row in result]
    except Exception as e:
        columns = [{"error": str(e)}]
    
    try:
        horarios = db.query(Horario).all()
        horarios_data = []
        for h in horarios:
            try:
                horarios_data.append({
                    "id": h.id,
                    "sucursal_id": h.sucursal_id,
                    "hora": getattr(h, 'hora', 'NO_EXISTE_COLUMNA'),
                    "hora_inicio": str(h.hora_inicio) if h.hora_inicio else None,
                    "hora_fin": str(h.hora_fin) if h.hora_fin else None,
                    "activo": h.activo
                })
            except Exception as eh:
                horarios_data.append({
                    "id": h.id,
                    "error": str(eh)
                })
    except Exception as e:
        return {"error": str(e), "columns": columns}
    
    return {
        "columns": columns,
        "horarios": horarios_data,
        "count": len(horarios_data)
    }


class DisponibilidadRequest(BaseModel):
    fecha: date
    hora: str
    sucursal_id: int | None = None
    empleado_id: int | None = None


class DisponibilidadResponse(BaseModel):
    disponible: bool
    mensaje: str


@router.post("/validar-disponibilidad", response_model=DisponibilidadResponse)
def validar_disponibilidad(request: DisponibilidadRequest, db: Session = Depends(get_db)):
    """Valida si un día y horario específico está disponible"""
    from datetime import time
    from app.models.appointment import Appointment, BloqueoAgenda
    
    fecha = request.fecha
    hora_str = request.hora
    
    try:
        hora_obj = time.fromisoformat(hora_str)
    except ValueError:
        return DisponibilidadResponse(
            disponible=False,
            mensaje=f"Formato de hora inválido: {hora_str}"
        )
    
    # 1. Verificar citas existentes
    query_citas = db.query(Appointment).filter(
        Appointment.activo == True,
        Appointment.fecha == fecha,
        Appointment.hora == hora_obj
    )
    
    if request.sucursal_id:
        query_citas = query_citas.filter(Appointment.sucursal_id == request.sucursal_id)
    
    if request.empleado_id:
        query_citas = query_citas.filter(Appointment.empleado_id == request.empleado_id)
    
    citas_existentes = query_citas.all()
    
    if citas_existentes:
        return DisponibilidadResponse(
            disponible=False,
            mensaje=f"Ya existe una cita programada para el {fecha} a las {hora_str}"
        )
    
    # 2. Verificar bloqueos de agenda
    query_bloqueos = db.query(BloqueoAgenda).filter(
        BloqueoAgenda.activo == True,
        BloqueoAgenda.fecha_inicio <= fecha,
        BloqueoAgenda.fecha_fin >= fecha
    )
    
    if request.sucursal_id:
        query_bloqueos = query_bloqueos.filter(BloqueoAgenda.sucursal_id == request.sucursal_id)
    
    if request.empleado_id:
        query_bloqueos = query_bloqueos.filter(BloqueoAgenda.empleado_id == request.empleado_id)
    
    bloqueos = query_bloqueos.all()
    
    for bloqueo in bloqueos:
        # Si tiene horario_id específico, verificar coincidencia de hora
        if bloqueo.horario_id:
            from app.models.catalogos import Horario
            try:
                horario = db.query(Horario).filter(Horario.id == bloqueo.horario_id).first()
                if horario and hasattr(horario, 'hora') and horario.hora == hora_str:
                    return DisponibilidadResponse(
                        disponible=False,
                        mensaje=f"Horario {hora_str} no disponible - bloqueado por: {bloqueo.motivo or 'Horario bloqueado'}"
                    )
            except:
                pass
        
        # Verificar rango de horas si existe
        if bloqueo.hora_inicio and bloqueo.hora_fin:
            if bloqueo.hora_inicio <= hora_obj <= bloqueo.hora_fin:
                return DisponibilidadResponse(
                    disponible=False,
                    mensaje=f"Horario {hora_str} no disponible - bloqueado por: {bloqueo.motivo or 'Horario bloqueado'}"
                )
        elif not bloqueo.horario_id:
            # Bloqueo de día completo
            return DisponibilidadResponse(
                disponible=False,
                mensaje=f"Día {fecha} no disponible - bloqueado por: {bloqueo.motivo or 'Día completo bloqueado'}"
            )
    
    return DisponibilidadResponse(
        disponible=True,
        mensaje="Horario disponible"
    )


@router.get("/debug-citas")
def debug_citas(fecha: str = None, sucursal_id: int = None, db: Session = Depends(get_db)):
    """Debug: ver citas existentes"""
    from app.models.appointment import Appointment
    from sqlalchemy import and_
    
    query = db.query(Appointment).filter(Appointment.activo == True)
    
    if fecha:
        query = query.filter(Appointment.fecha == fecha)
    if sucursal_id:
        query = query.filter(Appointment.sucursal_id == sucursal_id)
    
    citas = query.all()
    return {
        "citas": [
            {
                "id": c.id,
                "fecha": str(c.fecha),
                "hora": str(c.hora),
                "paciente_id": c.paciente_id,
                "sucursal_id": c.sucursal_id,
                "empleado_id": c.empleado_id,
                "activo": c.activo
            }
            for c in citas
        ],
        "total": len(citas)
    }


@router.get("/debug-bloqueos")
def debug_bloqueos(fecha: str = None, sucursal_id: int = None, db: Session = Depends(get_db)):
    """Debug: ver bloqueos de agenda"""
    from sqlalchemy import text
    
    query = text("""
        SELECT id, sucursal_id, empleado_id, fecha_inicio, fecha_fin, 
               hora_inicio, hora_fin, motivo, horario_id, activo
        FROM bloqueos_agenda
        WHERE activo = true
    """)
    
    params = {}
    if fecha:
        query = text(str(query) + " AND fecha_inicio <= :fecha AND fecha_fin >= :fecha")
        params['fecha'] = fecha
    if sucursal_id:
        query = text(str(query) + " AND sucursal_id = :sucursal_id")
        params['sucursal_id'] = sucursal_id
    
    result = db.execute(query, params)
    bloqueos = []
    for row in result:
        bloqueos.append({
            "id": row[0],
            "sucursal_id": row[1],
            "empleado_id": row[2],
            "fecha_inicio": str(row[3]) if row[3] else None,
            "fecha_fin": str(row[4]) if row[4] else None,
            "hora_inicio": str(row[5]) if row[5] else None,
            "hora_fin": str(row[6]) if row[6] else None,
            "motivo": row[7],
            "horario_id": row[8],
            "activo": row[9]
        })
    
    return {"bloqueos": bloqueos, "total": len(bloqueos)}
