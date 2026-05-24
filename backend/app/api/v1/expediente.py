from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.expediente import Expediente
from app.models.patient import Patient
from app.schemas.expediente import ExpedienteCreate, ExpedienteUpdate, ExpedienteResponse
from app.api.deps import get_current_user, require_role
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=ExpedienteResponse, status_code=status.HTTP_201_CREATED)
def create_expediente(
    data: ExpedienteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista"))
):
    patient = db.query(Patient).filter(Patient.id == data.paciente_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    existing = db.query(Expediente).filter(Expediente.paciente_id == data.paciente_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="El paciente ya tiene un expediente")
    expediente = Expediente(
        paciente_id=data.paciente_id,
        medico_id=data.medico_id,
        datos=data.datos
    )
    db.add(expediente)
    db.commit()
    db.refresh(expediente)
    return expediente

@router.get("", response_model=list[ExpedienteResponse])
@router.get("/", response_model=list[ExpedienteResponse])
def list_expedientes(
    paciente_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista", "Paciente"))
):
    query = db.query(Expediente)
    if paciente_id:
        query = query.filter(Expediente.paciente_id == paciente_id)
    return query.all()

@router.get("/{expediente_id}", response_model=ExpedienteResponse)
def get_expediente(
    expediente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista", "Paciente"))
):
    expediente = db.query(Expediente).filter(Expediente.id == expediente_id).first()
    if not expediente:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    return expediente

@router.put("/{expediente_id}", response_model=ExpedienteResponse)
def update_expediente(
    expediente_id: int,
    data: ExpedienteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista"))
):
    expediente = db.query(Expediente).filter(Expediente.id == expediente_id).first()
    if not expediente:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    if data.medico_id is not None:
        expediente.medico_id = data.medico_id
    expediente.datos = data.datos
    db.commit()
    db.refresh(expediente)
    return expediente

@router.put("/by-patient/{paciente_id}", response_model=ExpedienteResponse)
def upsert_expediente_by_patient(
    paciente_id: int,
    data: ExpedienteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Doctor", "Recepcionista"))
):
    patient = db.query(Patient).filter(Patient.id == paciente_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    expediente = db.query(Expediente).filter(Expediente.paciente_id == paciente_id).first()
    if expediente:
        if data.medico_id is not None:
            expediente.medico_id = data.medico_id
        expediente.datos = data.datos
    else:
        expediente = Expediente(
            paciente_id=paciente_id,
            medico_id=data.medico_id,
            datos=data.datos
        )
        db.add(expediente)
    db.commit()
    db.refresh(expediente)
    return expediente

@router.delete("/{expediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expediente(
    expediente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    expediente = db.query(Expediente).filter(Expediente.id == expediente_id).first()
    if not expediente:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    db.delete(expediente)
    db.commit()
