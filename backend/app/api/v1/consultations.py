"""
Endpoints de Consultas
"""
import logging
import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.database import get_db
from app.models.user import User
from app.models.consultation import Consultation, ConsultationPhoto
from app.schemas.consultation import ConsultationCreate, ConsultationUpdate, ConsultationResponse
from app.schemas.consultation_photo import ConsultationPhotoCreate, ConsultationPhotoResponse
from app.api.deps import get_current_user, require_role

UPLOAD_DIR = "/app/uploads/consultations"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    logger.info(f"Creating consultation with data: {consultation_data.model_dump()}")
    
    # Verificar que no exista ya una consulta para esta cita
    existing_consultation = db.query(Consultation).filter(
        Consultation.cita_id == consultation_data.cita_id
    ).first()
    if existing_consultation:
        logger.warning(f"Consultation already exists for cita_id={consultation_data.cita_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una consulta para esta cita"
        )
    
    # Obtener datos de la cita para llenar paciente_id y empleado_id
    from app.models.appointment import Appointment
    cita = db.query(Appointment).filter(Appointment.id == consultation_data.cita_id).first()
    if not cita:
        logger.error(f"Cita not found: {consultation_data.cita_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )

    logger.info(f"Creating consultation for cita_id={consultation_data.cita_id}, paciente_id={cita.paciente_id}, empleado_id={cita.empleado_id}")

    db_consultation = Consultation(
        cita_id=consultation_data.cita_id,
        paciente_id=cita.paciente_id,
        empleado_id=cita.empleado_id,
        peso=consultation_data.peso,
        talla=consultation_data.talla,
        temperatura=consultation_data.temperatura,
        presion_sistolica=consultation_data.presion_sistolica,
        presion_diastolica=consultation_data.presion_diastolica,
        pulso=consultation_data.pulso,
        glucosa=consultation_data.glucosa,
        reconocimiento_hallazgos=consultation_data.reconocimiento_hallazgos,
        diagnostico=consultation_data.diagnostico,
        tratamiento_indicaciones=consultation_data.tratamiento_indicaciones,
        notas_adicionales=consultation_data.notas_adicionales
    )

    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    
    logger.info(f"Consultation created successfully with id={db_consultation.id}")

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


ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/{consulta_id}/photos/", response_model=ConsultationPhotoResponse, status_code=status.HTTP_201_CREATED)
async def upload_consultation_photo(
    consulta_id: int,
    tipo_foto: str = Form(...),
    descripcion: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    consultation = db.query(Consultation).filter(Consultation.id == consulta_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Tipo de archivo no permitido: {file.content_type}. Solo se permiten imágenes (JPEG, PNG, WebP, GIF).")

    ext = os.path.splitext(file.filename or ".jpg")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Extensión de archivo no permitida: {ext}")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"Archivo demasiado grande. Tamaño máximo: {MAX_FILE_SIZE // (1024*1024)} MB")

    safe_filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, safe_filename)

    with open(filepath, "wb") as f:
        f.write(content)

    url = f"/uploads/consultations/{safe_filename}"

    db_photo = ConsultationPhoto(
        consulta_id=consulta_id,
        servicio_id=None,
        tipo_foto=tipo_foto,
        url_foto=url,
        descripcion=descripcion,
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)

    return db_photo


@router.get("/{consulta_id}/photos/", response_model=List[ConsultationPhotoResponse])
def list_consultation_photos(
    consulta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    consultation = db.query(Consultation).filter(Consultation.id == consulta_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    return consultation.fotos


@router.delete("/{consulta_id}/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_consultation_photo(
    consulta_id: int,
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor"))
):
    photo = db.query(ConsultationPhoto).filter(
        ConsultationPhoto.id == photo_id,
        ConsultationPhoto.consulta_id == consulta_id
    ).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Foto no encontrada")

    filepath = os.path.join(UPLOAD_DIR, os.path.basename(photo.url_foto))
    if os.path.exists(filepath):
        os.remove(filepath)

    db.delete(photo)
    db.commit()
    return None
