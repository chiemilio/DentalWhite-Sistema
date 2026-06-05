"""
Endpoints de Autenticación
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, get_password_hash, decode_token
from app.schemas.auth import LoginRequest, LoginResponse, RefreshRequest, UserLoginInfo
from app.schemas.user import UserCreate, UserResponse, UserRegisterRequest
from app.api.deps import get_current_user
from app.config import settings
from app.core.limiter import limiter

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
@router.post("/login/", response_model=LoginResponse)
@limiter.limit("10/minute")
def login(login_data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    role_mapping = {
        "Admin": "admin",
        "Recepcionista": "receptionist",
        "Doctor": "doctor",
        "Paciente": "patient",
    }
    role_english = role_mapping.get(user.rol.nombre, "patient") if user.rol else "patient"

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserLoginInfo(
            id=user.id,
            email=user.email,
            role=role_english,
            name=f"{user.nombre} {user.apellido_paterno}",
            workCenter=None,
            specialty=None,
        )
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@router.post("/register/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    from app.models.patient import Patient
    from datetime import date

    db_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        nombre=user_data.nombre,
        apellido_paterno=user_data.apellido_paterno or '',
        apellido_materno=user_data.apellido_materno,
        telefono_principal=user_data.telefono,
        rol_id=5,
        activo=True
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
    next_number = 1
    if last_patient and last_patient.numero_expediente:
        try:
            parts = last_patient.numero_expediente.split("-")
            if len(parts) == 2 and parts[1].isdigit():
                next_number = int(parts[1]) + 1
        except (ValueError, IndexError):
            next_number = 1
    numero_expediente = f"PAC-{next_number:06d}"
    
    db_patient = Patient(
        usuario_id=db_user.id,
        numero_expediente=numero_expediente,
        fecha_nacimiento=date(1990, 1, 1),
        activo=True
    )
    db.add(db_patient)
    db.commit()
    
    return UserResponse.from_orm_with_relations(db_user)


@router.post("/refresh", response_model=LoginResponse)
def refresh_token(refresh_data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(refresh_data.access_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    role_mapping = {
        "Admin": "admin",
        "Recepcionista": "receptionist",
        "Doctor": "doctor",
        "Paciente": "patient",
    }
    role_english = role_mapping.get(user.rol.nombre, "patient") if user.rol else "patient"

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserLoginInfo(
            id=user.id,
            email=user.email,
            role=role_english,
            name=f"{user.nombre} {user.apellido_paterno}",
            workCenter=None,
            specialty=None,
        )
    )


@router.get("/me")
@router.get("/me/")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    role_mapping = {
        "Admin": "admin",
        "Recepcionista": "receptionist",
        "Doctor": "doctor",
        "Paciente": "patient",
    }
    role_english = role_mapping.get(current_user.rol.nombre, "patient") if current_user.rol else "patient"

    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "role": role_english,
            "name": f"{current_user.nombre} {current_user.apellido_paterno}",
            "workCenter": None,
            "specialty": None,
        }
    }
