"""
Endpoints de Historial Clínico de Ortodoncia
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.clinical_history_ortodoncia import HistorialClinicoOrtodoncia
from app.schemas.clinical_history_ortodoncia import (
    HistorialClinicoOrtodonciaCreate,
    HistorialClinicoOrtodonciaUpdate,
    HistorialClinicoOrtodonciaResponse,
)
from app.api.deps import get_current_user, require_role

router = APIRouter()


def build_response(record: HistorialClinicoOrtodoncia) -> HistorialClinicoOrtodonciaResponse:
    paciente_nombre = None
    if record.paciente and record.paciente.usuario:
        paciente_nombre = f"{record.paciente.usuario.nombre} {record.paciente.usuario.apellido_paterno}"
    
    return HistorialClinicoOrtodonciaResponse(
        id=record.id,
        paciente_id=record.paciente_id,
        dni=record.dni,
        representante=record.representante,
        ocupacion=record.ocupacion,
        nombre_doctor=record.nombre_doctor,
        estado_fisico=record.estado_fisico,
        estado_dental=record.estado_dental,
        atencion_medica=record.atencion_medica,
        forma=record.forma,
        simetria=record.simetria,
        perfil=record.perfil,
        frente=record.frente,
        orejas=record.orejas,
        tic=record.tic,
        rictus=record.rictus,
        linea_bipupilar=record.linea_bipupilar,
        musculatura_labial=record.musculatura_labial,
        hiperactividad_mentoniana=record.hiperactividad_mentoniana,
        relacion_molar=record.relacion_molar,
        relacion_canina=record.relacion_canina,
        relacion_incisal=record.relacion_incisal,
        over_jet=record.over_jet,
        over_bite=record.over_bite,
        mordida_abierta=record.mordida_abierta,
        linea_media=record.linea_media,
        dientes_ausentes=record.dientes_ausentes,
        dientes_malformados=record.dientes_malformados,
        dientes_con_caries=record.dientes_con_caries,
        temporales=record.temporales,
        mordida_cruzada=record.mordida_cruzada,
        tecnica_cepillado=record.tecnica_cepillado,
        estado_parodontal=record.estado_parodontal,
        cefalografia=record.cefalografia,
        ortoradiales=record.ortoradiales,
        palmar=record.palmar,
        oclusal=record.oclusal,
        oblicua=record.oblicua,
        ortopantografias=record.ortopantografias,
        mesioradial=record.mesioradial,
        ausencia_congenita=record.ausencia_congenita,
        supernumerarios=record.supernumerarios,
        quistes=record.quistes,
        lesiones_periapicales=record.lesiones_periapicales,
        inclusiones=record.inclusiones,
        resorcion_radicular=record.resorcion_radicular,
        terceros_molares=record.terceros_molares,
        raices_enanas=record.raices_enanas,
        raices_anormales=record.raices_anormales,
        fecha_creacion=record.fecha_creacion,
        fecha_actualizacion=record.fecha_actualizacion,
        paciente_nombre=paciente_nombre,
    )


@router.get("/ortodoncia/", response_model=Optional[HistorialClinicoOrtodonciaResponse])
def get_historial_ortodoncia(
    paciente_id: int = Query(..., description="ID del paciente"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Obtiene el historial clínico de ortodoncia de un paciente
    """
    record = db.query(HistorialClinicoOrtodoncia).filter(
        HistorialClinicoOrtodoncia.paciente_id == paciente_id
    ).first()
    
    if not record:
        return None
    
    return build_response(record)


@router.post("/ortodoncia/", response_model=HistorialClinicoOrtodonciaResponse, status_code=status.HTTP_201_CREATED)
def create_historial_ortodoncia(
    history_data: HistorialClinicoOrtodonciaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Crea un nuevo historial clínico de ortodoncia
    """
    existing = db.query(HistorialClinicoOrtodoncia).filter(
        HistorialClinicoOrtodoncia.paciente_id == history_data.paciente_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El paciente ya tiene un historial de ortodoncia. Use PUT para actualizar."
        )
    
    db_record = HistorialClinicoOrtodoncia(**history_data.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return build_response(db_record)


@router.put("/ortodoncia/{paciente_id}", response_model=HistorialClinicoOrtodonciaResponse)
def update_historial_ortodoncia(
    paciente_id: int,
    history_data: HistorialClinicoOrtodonciaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Actualiza o crea el historial clínico de ortodoncia de un paciente
    """
    record = db.query(HistorialClinicoOrtodoncia).filter(
        HistorialClinicoOrtodoncia.paciente_id == paciente_id
    ).first()
    
    if not record:
        create_data = HistorialClinicoOrtodonciaCreate(paciente_id=paciente_id, **history_data.model_dump(exclude_unset=True))
        db_record = HistorialClinicoOrtodoncia(**create_data.model_dump())
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return build_response(db_record)
    
    update_data = history_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
    
    db.commit()
    db.refresh(record)
    
    return build_response(record)
