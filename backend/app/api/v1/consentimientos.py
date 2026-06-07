from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.clinical_history import ConsentimientoPaciente
from app.schemas.consentimiento import ConsentimientoCreate, ConsentimientoResponse
from app.api.deps import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[ConsentimientoResponse])
def list_consentimientos(
    paciente_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista")),
):
    query = db.query(ConsentimientoPaciente)
    if paciente_id:
        query = query.filter(ConsentimientoPaciente.paciente_id == paciente_id)
    records = query.order_by(ConsentimientoPaciente.fecha_consentimiento.desc()).all()

    result = []
    for r in records:
        paciente_nombre = None
        try:
            if r.paciente and r.paciente.usuario:
                paciente_nombre = f"{r.paciente.usuario.nombre} {r.paciente.usuario.apellido_paterno}"
        except:
            pass
        servicio_nombre = None
        try:
            if r.servicio:
                servicio_nombre = r.servicio.nombre
        except:
            pass
        result.append(ConsentimientoResponse(
            id=r.id,
            paciente_id=r.paciente_id,
            servicio_id=r.servicio_id,
            cita_id=r.cita_id,
            texto_consentimiento=r.texto_consentimiento,
            firma_paciente=r.firma_paciente,
            fecha_consentimiento=r.fecha_consentimiento,
            paciente_nombre=paciente_nombre,
            servicio_nombre=servicio_nombre,
        ))
    return result


@router.post("/", response_model=ConsentimientoResponse, status_code=status.HTTP_201_CREATED)
def create_consentimiento(
    data: ConsentimientoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista")),
):
    record = ConsentimientoPaciente(
        paciente_id=data.paciente_id,
        servicio_id=data.servicio_id,
        cita_id=data.cita_id,
        texto_consentimiento=data.texto_consentimiento,
        firma_paciente=data.firma_paciente,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    paciente_nombre = None
    try:
        if record.paciente and record.paciente.usuario:
            paciente_nombre = f"{record.paciente.usuario.nombre} {record.paciente.usuario.apellido_paterno}"
    except:
        pass
    servicio_nombre = None
    try:
        if record.servicio:
            servicio_nombre = record.servicio.nombre
    except:
        pass
    return ConsentimientoResponse(
        id=record.id,
        paciente_id=record.paciente_id,
        servicio_id=record.servicio_id,
        cita_id=record.cita_id,
        texto_consentimiento=record.texto_consentimiento,
        firma_paciente=record.firma_paciente,
        fecha_consentimiento=record.fecha_consentimiento,
        paciente_nombre=paciente_nombre,
        servicio_nombre=servicio_nombre,
    )
