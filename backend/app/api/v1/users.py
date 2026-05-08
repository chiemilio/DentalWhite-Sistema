"""
Endpoints de Usuarios
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.api.deps import get_current_user, require_role
from app.core.security import get_password_hash

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Lista todos los usuarios (Solo Admin/SuperAdmin)
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return [UserResponse.from_orm_with_relations(user) for user in users]


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Obtiene un usuario por ID (Solo Admin/SuperAdmin)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return UserResponse.from_orm_with_relations(user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Actualiza un usuario (Solo Admin/SuperAdmin)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    # Actualizar campos proporcionados
    update_data = user_update.model_dump(exclude_unset=True)

    # Verificar email único si se está actualizando
    if "email" in update_data and update_data["email"] != user.email:
        existing_email = db.query(User).filter(User.email == update_data["email"]).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está en uso"
            )

    # Verificar CURP único si se está actualizando
    if "curp" in update_data and update_data["curp"] and update_data["curp"] != user.curp:
        existing_curp = db.query(User).filter(User.curp == update_data["curp"]).first()
        if existing_curp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El CURP ya está en uso"
            )

    # Verificar RFC único si se está actualizando
    if "rfc" in update_data and update_data["rfc"] and update_data["rfc"] != user.rfc:
        existing_rfc = db.query(User).filter(User.rfc == update_data["rfc"]).first()
        if existing_rfc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El RFC ya está en uso"
            )

    # Hash de password si se está actualizando
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))

    # Aplicar actualizaciones
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return UserResponse.from_orm_with_relations(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("SuperAdmin"))
):
    """
    Elimina (desactiva) un usuario (Solo SuperAdmin)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    # Soft delete - marcar como inactivo
    user.activo = False
    db.commit()

    return None
