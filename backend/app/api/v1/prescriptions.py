"""
Endpoints de Recetas
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.prescription import Prescription, PrescriptionMedicine
from app.schemas.prescription import PrescriptionCreate, PrescriptionResponse
from app.api.deps import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[PrescriptionResponse])
def list_prescriptions(
    skip: int = 0,
    limit: int = 100,
    paciente_id: int | None = Query(None, description="Filtrar por paciente"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Lista todas las recetas (Solo Doctor, Admin, SuperAdmin)
    """
    query = db.query(Prescription)

    # Filtrar por paciente si se proporciona
    if paciente_id:
        query = query.join(Prescription.consulta).join_from(
            Prescription.consulta, "cita"
        ).filter_by(paciente_id=paciente_id)

    prescriptions = query.order_by(Prescription.fecha_emision.desc()).offset(skip).limit(limit).all()
    return [PrescriptionResponse.from_orm_with_relations(prescription) for prescription in prescriptions]


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def get_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Obtiene una receta por ID
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receta no encontrada"
        )
    return PrescriptionResponse.from_orm_with_relations(prescription)


@router.get("/folio/{folio}", response_model=PrescriptionResponse)
def get_prescription_by_folio(
    folio: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Obtiene una receta por folio
    """
    prescription = db.query(Prescription).filter(Prescription.folio == folio).first()
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receta no encontrada"
        )
    return PrescriptionResponse.from_orm_with_relations(prescription)


@router.post("/", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_prescription(
    prescription_data: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    """
    Crea una nueva receta (Solo Doctor, Admin, SuperAdmin)
    """
    # Generar folio único (año-mes-consecutivo)
    now = datetime.now()
    prefix = now.strftime("%Y%m")

    # Obtener último folio del mes
    last_prescription = db.query(Prescription).filter(
        Prescription.folio.like(f"{prefix}%")
    ).order_by(Prescription.id.desc()).first()

    if last_prescription:
        last_number = int(last_prescription.folio.split("-")[1])
        next_number = last_number + 1
    else:
        next_number = 1

    folio = f"{prefix}-{next_number:05d}"

    # Crear receta con signos vitales
    db_prescription = Prescription(
        consulta_id=prescription_data.consulta_id,
        folio=folio,
        indicaciones_generales=prescription_data.indicaciones_generales,
        peso=prescription_data.peso,
        talla=prescription_data.talla,
        temperatura=prescription_data.temperatura,
        presion_sistolica=prescription_data.presion_sistolica,
        presion_diastolica=prescription_data.presion_diastolica,
        pulso=prescription_data.pulso,
        glucosa=prescription_data.glucosa
    )

    db.add(db_prescription)
    db.flush()  # Para obtener el ID de la receta

    # Crear medicamentos
    for med_data in prescription_data.medicamentos:
        db_medicine = PrescriptionMedicine(
            receta_id=db_prescription.id,
            medicamento=med_data.medicamento,
            presentacion=med_data.presentacion,
            dosis=med_data.dosis,
            frecuencia=med_data.frecuencia,
            duracion=med_data.duracion,
            indicaciones=med_data.indicaciones
        )
        db.add(db_medicine)

    db.commit()
    db.refresh(db_prescription)

    return PrescriptionResponse.from_orm_with_relations(db_prescription)


@router.delete("/{prescription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Elimina una receta (Solo Admin, SuperAdmin)
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receta no encontrada"
        )

    db.delete(prescription)
    db.commit()

    return None
