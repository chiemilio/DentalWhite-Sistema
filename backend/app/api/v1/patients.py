"""
Endpoints de Pacientes
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.core.security import get_password_hash
from app.api.deps import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[PatientResponse], tags=["Patients"])
def list_patients_slash(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todos los pacientes (trailing slash)
    """
    patients = db.query(Patient).options(joinedload(Patient.usuario)).offset(skip).limit(limit).all()
    return [PatientResponse.from_orm_with_relations(patient) for patient in patients]


@router.get("/search", response_model=List[PatientResponse])
def search_patients(
    q: str = Query(..., min_length=1, description="Búsqueda por nombre o teléfono"),
    limit: int = Query(20, le=50),
    db: Session = Depends(get_db)
):
    """
    Busca pacientes por nombre o teléfono - SIN AUTH requerida
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"=== search_patients called (NO AUTH) ===")
    
    search_term = f"%{q}%"
    
    # Search in users table with rol_id = 4 (paciente)
    patients = (
        db.query(Patient)
        .join(User, User.id == Patient.usuario_id)
        .options(joinedload(Patient.usuario))
        .filter(
            and_(
                User.rol_id == 5,  # Only patients
                or_(
                    User.nombre.ilike(search_term),
                    User.apellido_paterno.ilike(search_term),
                    User.apellido_materno.ilike(search_term),
                    User.telefono_principal.ilike(search_term),
                    User.telefono_secundario.ilike(search_term),
                    User.whatsapp.ilike(search_term),
                    Patient.numero_expediente.ilike(search_term)
                )
            )
        )
        .limit(limit)
        .all()
    )
    
    return [PatientResponse.from_orm_with_relations(patient) for patient in patients]


@router.get("/search/", response_model=List[PatientResponse])
def search_patients_slash(
    q: str = Query(..., min_length=1, description="Búsqueda por nombre o teléfono"),
    limit: int = Query(20, le=50),
    db: Session = Depends(get_db)
):
    """
    Busca pacientes por nombre o teléfono - SIN AUTH requerida
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"=== search_patients_slash called (NO AUTH) ===")
    
    return search_patients(q=q, limit=limit, db=db)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene un paciente por ID
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado"
        )
    return PatientResponse.from_orm_with_relations(patient)


@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista"))
):
    """
    Crea un nuevo paciente y su usuario asociado
    """
    # Crear usuario
    from app.models.user import User
    import random
    import string
    
    # Generar password temporal hasheado
    temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    
    # Generar email único si no se proporcionó o si ya existe
    base_email = patient_data.email or f"paciente_{random.randint(1000, 9999)}@temporal.com"
    email = base_email
    counter = 1
    while db.query(User).filter(User.email == email).first():
        email = f"paciente_{random.randint(10000, 99999)}@temporal.com"
    
    db_user = User(
        nombre=patient_data.nombre,
        apellido_paterno=patient_data.apellido,
        email=email,
        telefono_principal=patient_data.telefono,
        password_hash=get_password_hash(temp_password),
        rol_id=5,  # Rol Paciente
        activo=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generar número de expediente
    last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
    next_number = 1 if not last_patient else int(last_patient.numero_expediente.split("-")[1]) + 1
    numero_expediente = f"PAC-{next_number:06d}"
    
    # Crear paciente
    db_patient = Patient(
        usuario_id=db_user.id,
        tipo_paciente_id=patient_data.tipo_paciente_id,
        sucursal_id=patient_data.sucursal_id or 2,  # Sucursal Principal por defecto
        numero_expediente=numero_expediente,
        fecha_nacimiento=patient_data.fecha_nacimiento,
        sexo=patient_data.sexo
    )
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    return PatientResponse.from_orm_with_relations(db_patient)


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista"))
):
    """
    Actualiza un paciente
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado"
        )

    # Actualizar campos proporcionados
    update_data = patient_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    return PatientResponse.from_orm_with_relations(patient)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Elimina un paciente (Solo Admin/SuperAdmin)
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado"
        )

    db.delete(patient)
    db.commit()

    return None
