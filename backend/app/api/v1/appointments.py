"""
Endpoints de Citas
"""
from typing import List, Optional
from datetime import datetime, date, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.patient import Patient
from app.models.employee import Employee

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.api.deps import get_current_user, require_role
from app.core.security import get_password_hash

router = APIRouter()


class RegisterAndAppointmentRequest(BaseModel):
    """Request para registrar paciente y crear cita"""
    email: str
    password: str
    nombre: str
    apellido_paterno: str
    telefono: str
    empleado_id: int
    servicio_id: int
    sucursal_id: int
    fecha_hora: str
    duracion_minutos: int = 30
    motivo_consulta: Optional[str] = None


@router.post("/register-and-appointment/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def register_and_appointment(
    data: RegisterAndAppointmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista"))
):
    """Registra paciente y crea cita en una sola llamada"""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        existing_patient = db.query(Patient).filter(Patient.usuario_id == existing_user.id).first()
        if existing_patient:
            paciente_db = existing_patient
        else:
            raise HTTPException(status_code=400, detail="El usuario existe pero no tiene perfil de paciente")
    else:
        # Create user
        db_user = User(
            email=data.email,
            password_hash=get_password_hash(data.password),
            nombre=data.nombre,
            apellido_paterno=data.apellido_paterno,
            telefono_principal=data.telefono,
            rol_id=4,
            activo=True
        )
        db.add(db_user)
        db.flush()
        
        # Create patient
        last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
        next_num = 1
        if last_patient and last_patient.numero_expediente:
            try:
                parts = last_patient.numero_expediente.split("-")
                if len(parts) == 2 and parts[1].isdigit():
                    next_num = int(parts[1]) + 1
            except (ValueError, IndexError):
                next_num = 1
        
        db_patient = Patient(
            usuario_id=db_user.id,
            tipo_paciente_id=1,
            numero_expediente=f"PAC-{next_num:06d}",
            fecha_nacimiento=date(1990, 1, 1),
            activo=True
        )
        db.add(db_patient)
        db.flush()
        paciente_db = db_patient
    
    # Create appointment - parse fecha_hora as local time (no timezone conversion)
    fecha_hora_str = data.fecha_hora.replace("Z", "+00:00")
    if "+" not in fecha_hora_str and fecha_hora_str[-1] != "Z":
        # No timezone info, treat as local time
        fecha_hora_dt = datetime.fromisoformat(data.fecha_hora)
    else:
        # Has timezone info, convert to local (America/Mexico_City, UTC-6)
        fecha_hora_dt = datetime.fromisoformat(fecha_hora_str)
        mexico_tz = timezone(timedelta(hours=-6))
        fecha_hora_dt = fecha_hora_dt.astimezone(mexico_tz)
    
    nueva_cita = Appointment(
        paciente_id=paciente_db.id,
        empleado_id=data.empleado_id,
        servicio_id=data.servicio_id,
        sucursal_id=data.sucursal_id,
        estado_cita_id=1,
        medio_contacto_id=1,
        fecha=fecha_hora_dt.date(),
        hora=fecha_hora_dt.time(),
        duracion_minutos=data.duracion_minutos,
        motivo_consulta=data.motivo_consulta,
        activo=True
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    
    return AppointmentResponse.from_orm_with_relations(nueva_cita)


@router.get("/", response_model=List[AppointmentResponse])
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    fecha_inicio: datetime | None = Query(None, description="Filtrar desde fecha"),
    fecha_fin: datetime | None = Query(None, description="Filtrar hasta fecha"),
    paciente_id: int | None = Query(None, description="Filtrar por paciente"),
    usuario_id: int | None = Query(None, description="Filtrar por usuario ID"),
    empleado_id: int | None = Query(None, description="Filtrar por empleado"),
    estado_id: int | None = Query(None, description="Filtrar por estado"),
    sucursal_id: int | None = Query(None, description="Filtrar por sucursal"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todas las citas con filtros opcionales
    """
    try:
        # Cargar relaciones necesarias
        query = db.query(Appointment).options(
            joinedload(Appointment.paciente).joinedload(Patient.usuario),
            joinedload(Appointment.empleado).joinedload(Employee.usuario),
            joinedload(Appointment.servicio),
            joinedload(Appointment.sucursal),
            joinedload(Appointment.estado_cita)
        )

        # Aplicar filtros
        if fecha_inicio:
            query = query.filter(Appointment.fecha >= fecha_inicio.date())
        if fecha_fin:
            query = query.filter(Appointment.fecha <= fecha_fin.date())
        
        # Handle paciente_id - can be either patient table ID or user ID
        if paciente_id:
            patient = db.query(Patient).filter(
                (Patient.usuario_id == paciente_id) | 
                (Patient.id == paciente_id)
            ).first()
            if patient:
                query = query.filter(Appointment.paciente_id == patient.id)
            else:
                query = query.filter(Appointment.paciente_id == paciente_id)
        
        # Handle usuario_id - busca empleado y filtra por empleado_id
        if usuario_id:
            emp = db.query(Employee).filter(Employee.usuario_id == usuario_id).first()
            if emp:
                query = query.filter(Appointment.empleado_id == emp.id)
            else:
                query = query.filter(Appointment.empleado_id == 0)  # No results
        
        if empleado_id:
            query = query.filter(Appointment.empleado_id == empleado_id)
            print(f"DEBUG: Filtrando por empleado_id={empleado_id}")
        if estado_id:
            query = query.filter(Appointment.estado_cita_id == estado_id)
        if sucursal_id:
            query = query.filter(Appointment.sucursal_id == sucursal_id)

        appointments = query.order_by(Appointment.fecha.desc(), Appointment.hora.desc()).offset(skip).limit(limit).all()
        print(f"Total citas: {len(appointments)} - Usuario: {current_user.email}")
        for apt in appointments:
            print(f"  Cita {apt.id}: fecha={apt.fecha}, hora={apt.hora}, estado={apt.estado_cita_id}")
        return [AppointmentResponse.from_orm_with_relations(appointment) for appointment in appointments]
    except Exception as e:
        print(f"Error en list_appointments: {e}")
        import traceback
        traceback.print_exc()
        raise


@router.get("", response_model=List[AppointmentResponse])
def list_appointments_no_slash(
    skip: int = 0,
    limit: int = 100,
    fecha_inicio: datetime | None = Query(None, description="Filtrar desde fecha"),
    fecha_fin: datetime | None = Query(None, description="Filtrar hasta fecha"),
    paciente_id: int | None = Query(None, description="Filtrar por paciente"),
    usuario_id: int | None = Query(None, description="Filtrar por usuario ID"),
    empleado_id: int | None = Query(None, description="Filtrar por empleado"),
    estado_id: int | None = Query(None, description="Filtrar por estado"),
    sucursal_id: int | None = Query(None, description="Filtrar por sucursal"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todas las citas con filtros opcionales (without trailing slash)
    """
    return list_appointments(skip, limit, fecha_inicio, fecha_fin, paciente_id, usuario_id, empleado_id, estado_id, sucursal_id, db, current_user)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene una cita por ID
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    return AppointmentResponse.from_orm_with_relations(appointment)


@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista", "Doctor", "Paciente"))
):
    """
    Crea una nueva cita
    """
    from datetime import datetime, date
    from app.models.patient import Patient
    
    # Get patient ID - accept either user ID or patient ID
    paciente_db = db.query(Patient).filter(
        (Patient.usuario_id == appointment_data.paciente_id) | 
        (Patient.id == appointment_data.paciente_id)
    ).first()
    if not paciente_db:
        # Auto-create Patient record if the current user is a patient scheduling for themselves
        if current_user.rol.nombre == "Paciente" and current_user.id == appointment_data.paciente_id:
            last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
            next_num = 1
            if last_patient and last_patient.numero_expediente:
                try:
                    parts = last_patient.numero_expediente.split("-")
                    if len(parts) == 2 and parts[1].isdigit():
                        next_num = int(parts[1]) + 1
                except (ValueError, IndexError):
                    next_num = 1
            paciente_db = Patient(
                usuario_id=current_user.id,
                tipo_paciente_id=1,
                numero_expediente=f"PAC-{next_num:06d}",
                fecha_nacimiento=date(1990, 1, 1),
                activo=True
            )
            db.add(paciente_db)
            db.flush()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El paciente no existe en el sistema"
            )
    
    # Buscar empleado - puede ser employee.id o employee.usuario_id
    empleado_db = db.query(Employee).filter(
        (Employee.id == appointment_data.empleado_id) |
        (Employee.usuario_id == appointment_data.empleado_id)
    ).first()
    if not empleado_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El empleado no existe en el sistema"
        )
    empleado_id_real = empleado_db.id
    
    # Extraer fecha y hora del campo fecha_hora - parse as local time
    fecha_hora_dt = appointment_data.fecha_hora
    if isinstance(fecha_hora_dt, str):
        fecha_hora_str = fecha_hora_dt.replace('Z', '+00:00')
        if '+' not in fecha_hora_str and fecha_hora_str[-1] != 'Z':
            # No timezone info, treat as local time
            fecha_hora_dt = datetime.fromisoformat(fecha_hora_dt)
        else:
            # Has timezone info, convert to local (America/Mexico_City, UTC-6)
            fecha_hora_dt = datetime.fromisoformat(fecha_hora_str)
            mexico_tz = timezone(timedelta(hours=-6))
            fecha_hora_dt = fecha_hora_dt.astimezone(mexico_tz)
    
    fecha_cita = fecha_hora_dt.date() if hasattr(fecha_hora_dt, 'date') else fecha_hora_dt.date()
    hora_cita = fecha_hora_dt.time() if hasattr(fecha_hora_dt, 'time') else fecha_hora_dt.time()

    db_appointment = Appointment(
        paciente_id=paciente_db.id,  # Use the internal patient ID
        empleado_id=empleado_id_real,
        servicio_id=appointment_data.servicio_id,
        sucursal_id=appointment_data.sucursal_id,
        estado_cita_id=appointment_data.estado_cita_id,
        medio_contacto_id=1,
        fecha=fecha_cita,
        hora=hora_cita,
        duracion_minutos=appointment_data.duracion_minutos,
        motivo_consulta=appointment_data.motivo,
        notas=appointment_data.notas
    )

    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)

    return AppointmentResponse.from_orm_with_relations(db_appointment)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista", "Doctor"))
):
    """
    Actualiza una cita
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    
    # Actualizar campos proporcionados
    update_data = appointment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == 'fecha_hora' and value is not None:
            # Parse fecha_hora as local time
            if isinstance(value, str):
                fecha_hora_str = value.replace('Z', '+00:00')
                if '+' not in fecha_hora_str and fecha_hora_str[-1] != 'Z':
                    value = datetime.fromisoformat(value)
                else:
                    value = datetime.fromisoformat(fecha_hora_str)
                    mexico_tz = timezone(timedelta(hours=-6))
                    value = value.astimezone(mexico_tz)
            appointment.fecha = value.date()
            appointment.hora = value.time()
        else:
            setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    
    return AppointmentResponse.from_orm_with_relations(appointment)


@router.put("/{appointment_id}/", response_model=AppointmentResponse, tags=["Appointments"])
def update_appointment_slash(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista", "Doctor"))
):
    """
    Actualiza una cita (trailing slash)
    """
    return update_appointment(appointment_id, appointment_update, db, current_user)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin", "Recepcionista"))
):
    """
    Cancela/Elimina una cita
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )

    # Podríamos cambiar el estado a "Cancelada" en lugar de eliminar
    # Por ahora, eliminamos
    db.delete(appointment)
    db.commit()

    return None
