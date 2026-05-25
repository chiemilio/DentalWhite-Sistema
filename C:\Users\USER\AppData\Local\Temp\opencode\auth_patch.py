"""
Endpoints de Autenticación
"""
import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, get_password_hash
from app.schemas.auth import LoginRequest, LoginResponse, UserLoginInfo
from app.schemas.user import UserCreate, UserResponse, UserRegisterRequest
from app.api.deps import get_current_user
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    logger.info("LOGIN_ATTEMPT: email=%s password_len=%d", login_data.email, len(login_data.password))
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        logger.warning("LOGIN_FAILED: email=%s user_exists=%s", login_data.email, user is not None)
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
    
    rol_nombre = user.rol.nombre if user.rol else "Paciente"
    frontend_role = role_mapping.get(rol_nombre, "patient")
    
    logger.info("LOGIN_SUCCESS: email=%s role=%s", login_data.email, frontend_role)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "role": frontend_role,
            "name": f"{user.nombre} {user.apellido_paterno}".strip(),
            "workCenter": None,
            "specialty": None,
        }
    )


@router.post("/login/", response_model=LoginResponse)
def login_slash(login_data: LoginRequest, db: Session = Depends(get_db)):
    logger.info("LOGIN_ATTEMPT: email=%s", login_data.email)
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        logger.warning("LOGIN_FAILED: email=%s", login_data.email)
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
        rol_id=4,
        activo=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    paciente = Patient(
        usuario_id=db_user.id,
        tipo_paciente_id=1,
        numero_expediente=f"EXP-{db_user.id:06d}",
        fecha_nacimiento=user_data.fecha_nacimiento or date.today(),
        sexo=user_data.sexo,
        ocupacion=user_data.ocupacion,
        activo=True
    )
    db.add(paciente)
    db.commit()
    db.refresh(paciente)

    return db_user


@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
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
            "name": f"{current_user.nombre} {current_user.apellido_paterno}".strip(),
            "workCenter": None,
            "specialty": None,
        }
    }
