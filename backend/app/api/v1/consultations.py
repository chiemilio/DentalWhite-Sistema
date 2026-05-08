"""
Endpoints de Consultas
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.consultation import Consultation
from app.schemas.consultation import ConsultationCreate, ConsultationUpdate, ConsultationResponse
from app.api.deps import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[ConsultationResponse])
def list_consultations(
    skip: int = 0,
    limit: int = 100,
    paciente_id: int | None = Query(None, description="Filtrar por paciente"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Lista todas las consultas (Solo Doctor, Admin, SuperAdmin)
    """
    query = db.query(Consultation)

    # Filtrar por paciente si se proporciona
    if paciente_id:
        query = query.join(Consultation.cita).filter_by(paciente_id=paciente_id)

    consultations = query.order_by(Consultation.fecha_creacion.desc()).offset(skip).limit(limit).all()
    return [ConsultationResponse.from_orm_with_relations(consultation) for consultation in consultations]


@router.get("/{consultation_id}", response_model=ConsultationResponse)
def get_consultation(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Obtiene una consulta por ID
    """
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta no encontrada"
        )
    return ConsultationResponse.from_orm_with_relations(consultation)


@router.post("/", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
def create_consultation(
    consultation_data: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Crea una nueva consulta (Solo Doctor, Admin, SuperAdmin)
    """
    # Verificar que no exista ya una consulta para esta cita
    existing_consultation = db.query(Consultation).filter(
        Consultation.cita_id == consultation_data.cita_id
    ).first()
    if existing_consultation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una consulta para esta cita"
        )

    db_consultation = Consultation(
        cita_id=consultation_data.cita_id,
        peso=consultation_data.peso,
        talla=consultation_data.talla,
        temperatura=consultation_data.temperatura,
        presion_sistolica=consultation_data.presion_sistolica,
        presion_diastolica=consultation_data.presion_diastolica,
        pulso=consultation_data.pulso,
        glucosa=consultation_data.glucosa,
        motivo_consulta=consultation_data.motivo_consulta,
        padecimiento_actual=consultation_data.padecimiento_actual,
        exploracion_fisica=consultation_data.exploracion_fisica,
        diagnostico=consultation_data.diagnostico,
        plan_tratamiento=consultation_data.plan_tratamiento,
        notas=consultation_data.notas
    )

    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)

    return ConsultationResponse.from_orm_with_relations(db_consultation)


@router.put("/{consultation_id}", response_model=ConsultationResponse)
def update_consultation(
    consultation_id: int,
    consultation_update: ConsultationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Actualiza una consulta (Solo Doctor, Admin, SuperAdmin)
    """
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta no encontrada"
        )

    # Actualizar campos proporcionados
    update_data = consultation_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(consultation, field, value)

    db.commit()
    db.refresh(consultation)

    return ConsultationResponse.from_orm_with_relations(consultation)


@router.delete("/{consultation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_consultation(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Elimina una consulta (Solo Admin, SuperAdmin)
    """
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta no encontrada"
        )

    db.delete(consultation)
    db.commit()

    return None
