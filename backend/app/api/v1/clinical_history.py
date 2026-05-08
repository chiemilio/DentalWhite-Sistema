"""
Endpoints de Historial Clínico
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.clinical_history import ClinicalHistory
from app.schemas.clinical_history import ClinicalHistoryCreate, ClinicalHistoryUpdate, ClinicalHistoryResponse
from app.api.deps import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[ClinicalHistoryResponse])
def list_clinical_history(
    skip: int = 0,
    limit: int = 100,
    paciente_id: int | None = Query(None, description="Filtrar por paciente"),
    activo: bool | None = Query(None, description="Filtrar por estado activo"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Lista historial clínico (Solo Doctor, Admin, SuperAdmin)
    """
    query = db.query(ClinicalHistory)

    # Aplicar filtros
    if paciente_id:
        query = query.filter(ClinicalHistory.paciente_id == paciente_id)
    if activo is not None:
        query = query.filter(ClinicalHistory.activo == activo)

    history_records = query.order_by(ClinicalHistory.fecha_creacion.desc()).offset(skip).limit(limit).all()
    return [ClinicalHistoryResponse.from_orm_with_relations(record) for record in history_records]


@router.get("/{history_id}", response_model=ClinicalHistoryResponse)
def get_clinical_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Obtiene un registro de historial clínico por ID
    """
    history = db.query(ClinicalHistory).filter(ClinicalHistory.id == history_id).first()
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de historial clínico no encontrado"
        )
    return ClinicalHistoryResponse.from_orm_with_relations(history)


@router.post("/", response_model=ClinicalHistoryResponse, status_code=status.HTTP_201_CREATED)
def create_clinical_history(
    history_data: ClinicalHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Crea un nuevo registro de historial clínico (Solo Doctor, Admin, SuperAdmin)
    """
    db_history = ClinicalHistory(
        paciente_id=history_data.paciente_id,
        tipo_antecedente_id=history_data.tipo_antecedente_id,
        descripcion=history_data.descripcion,
        fecha_diagnostico=history_data.fecha_diagnostico,
        notas=history_data.notas,
        activo=history_data.activo
    )

    db.add(db_history)
    db.commit()
    db.refresh(db_history)

    return ClinicalHistoryResponse.from_orm_with_relations(db_history)


@router.put("/{history_id}", response_model=ClinicalHistoryResponse)
def update_clinical_history(
    history_id: int,
    history_update: ClinicalHistoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Actualiza un registro de historial clínico (Solo Doctor, Admin, SuperAdmin)
    """
    history = db.query(ClinicalHistory).filter(ClinicalHistory.id == history_id).first()
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de historial clínico no encontrado"
        )

    # Actualizar campos proporcionados
    update_data = history_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(history, field, value)

    db.commit()
    db.refresh(history)

    return ClinicalHistoryResponse.from_orm_with_relations(history)


@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clinical_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Elimina un registro de historial clínico (Solo Admin, SuperAdmin)
    """
    history = db.query(ClinicalHistory).filter(ClinicalHistory.id == history_id).first()
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de historial clínico no encontrado"
        )

    db.delete(history)
    db.commit()

    return None
