"""
Endpoints de Autenticación
"""
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

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    print(f"LOGIN_DEBUG: email='{login_data.email}' pw_len={len(login_data.password)}", flush=True)
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        print(f"LOGIN_DEBUG FAILED: email='{login_data.email}' user_found={user is not None}", flush=True)
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
    
    # Verificar que el usuario esté activo
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    
    # Crear access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    # Mapear roles
    role_mapping = {
        "Admin": "admin",
        "Recepcionista": "receptionist",
        "Doctor": "doctor",
        "Paciente": "patient",
    }
    
    # Obtener nombre del rol
    rol_nombre = user.rol.nombre if user.rol else "Paciente"
    frontend_role = role_mapping.get(rol_nombre, "patient")
    
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
    """
    Login de usuario - Retorna JWT token (with trailing slash)
    """
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
    
    # Crear access token
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
    
    print(f"LOGIN_DEBUG SUCCESS: email='{login_data.email}' role={frontend_role}", flush=True)
    
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
    print(f"LOGIN_DEBUG slash: email='{login_data.email}'", flush=True)
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        print(f"LOGIN_DEBUG slash FAILED: email='{login_data.email}'", flush=True)
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
    
    # Crear access token
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
            workCenter=None,  # TODO: obtener de la relación con empleado/paciente
            specialty=None,  # TODO: obtener de la relación con empleado
        )
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Registro de nuevo usuario (paciente por defecto)
    """
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
    
    db_patient = Patient(
        usuario_id=db_user.id,
        fecha_nacimiento=date(1990, 1, 1),
        activo=True
    )
    db.add(db_patient)
    db.commit()
    
    return UserResponse.from_orm_with_relations(db_user)


@router.post("/register/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_slash(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Registro de nuevo usuario (paciente por defecto, with trailing slash)
    """
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
    
    db_patient = Patient(
        usuario_id=db_user.id,
        fecha_nacimiento=date(1990, 1, 1),
        activo=True
    )
    db.add(db_patient)
    db.commit()
    
    return UserResponse.from_orm_with_relations(db_user)


@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Obtiene información del usuario autenticado actual
    """
    # Map roles de español a inglés
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


@router.get("/me/")
def get_current_user_info_slash(current_user: User = Depends(get_current_user)):
    """
    Obtiene información del usuario autenticado actual (with trailing slash)
    """
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
