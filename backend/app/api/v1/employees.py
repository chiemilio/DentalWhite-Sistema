"""
Endpoints de Empleados
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.employee import Employee
from app.models.catalogos import Especialidad
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.api.deps import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[EmployeeResponse])
def list_employees(
    skip: int = 0,
    limit: int = 1000,
    usuario_id: Optional[int] = Query(None, description="Filtrar por usuario_id"),
    es_doctor: Optional[bool] = Query(None, description="Solo doctores"),
    especialidad: Optional[str] = Query(None, description="Filtrar por especialidad"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todos los empleados, opcionalmente filtrados por usuario_id, solo doctores o especialidad
    """
    try:
        query = db.query(Employee).options(
            joinedload(Employee.usuario).joinedload(User.rol),
            joinedload(Employee.especialidades),
            joinedload(Employee.sucursal)
        )
        
        if usuario_id:
            query = query.filter(Employee.usuario_id == usuario_id)

        if es_doctor:
            query = query.filter(Employee.puesto.ilike('%doctor%'))

        if especialidad:
            from app.models.catalogos import Especialidad
            emp_ids = db.query(Employee.id).join(
                Employee.especialidades
            ).filter(
                Especialidad.nombre.ilike(f'%{especialidad}%')
            ).all()
            emp_ids = [e[0] for e in emp_ids]
            if emp_ids:
                query = query.filter(Employee.id.in_(emp_ids))
            else:
                query = query.filter(Employee.id == 0)

        employees = query.offset(skip).limit(limit).all()
        return [EmployeeResponse.from_orm_with_relations(employee) for employee in employees]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene un empleado por ID
    """
    employee = db.query(Employee).options(
        joinedload(Employee.usuario).joinedload(User.rol),
        joinedload(Employee.especialidades),
        joinedload(Employee.sucursal)
    ).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empleado no encontrado"
        )
    return EmployeeResponse.from_orm_with_relations(employee)


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Crea un nuevo empleado (Solo Admin/SuperAdmin)
    """
    # First check if user exists by email
    user = db.query(User).filter(User.email == employee_data.email).first()
    
    if user:
        # Check if user already has employee profile
        existing_employee = db.query(Employee).filter(Employee.usuario_id == user.id).first()
        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya tiene un perfil de empleado"
            )
        # User exists but no employee profile - use this user
    else:
        # Create new user
        from app.api.v1.auth import get_password_hash
        user = User(
            email=employee_data.email,
            password_hash=get_password_hash(employee_data.password),
            nombre=employee_data.nombre,
            telefono_principal=employee_data.telefono,
            rol_id=employee_data.rol_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Verify number of employee unique
    existing_numero = db.query(Employee).filter(Employee.numero_empleado == employee_data.numero_empleado).first()
    if existing_numero:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de empleado ya está en uso"
        )

    # Crear empleado
    db_employee = Employee(
        usuario_id=user.id,
        numero_empleado=employee_data.numero_empleado,
        fecha_contratacion=employee_data.fecha_ingreso,
        cedula_profesional=employee_data.cedula_profesional,
        puesto=employee_data.puesto,
        salario=employee_data.salario
    )

    # Asignar especialidades si se proporcionan
    if employee_data.especialidad_ids:
        especialidades = db.query(Especialidad).filter(
            Especialidad.id.in_(employee_data.especialidad_ids)
        ).all()
        db_employee.especialidades = especialidades

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return EmployeeResponse.from_orm_with_relations(db_employee)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Actualiza un empleado (Solo Admin/SuperAdmin)
    """
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empleado no encontrado"
        )

# Actualizar campos proporcionados
    update_data = employee_update.model_dump(exclude_unset=True, exclude={"especialidad_ids"})
    
    # Map fecha_ingreso to fecha_contratacion for the model
    if "fecha_ingreso" in update_data:
        update_data["fecha_contratacion"] = update_data.pop("fecha_ingreso")
    
    # Extract usuario_rol_id but don't apply yet - will handle separately after employee update
    nuevo_rol_id = None
    if "usuario_rol_id" in update_data:
        nuevo_rol_id = update_data.pop("usuario_rol_id")
        print(f"=== UPDATE EMPLOYEE {employee_id} ===")
        print(f"nuevo_rol_id extract: {nuevo_rol_id}")
        print(f"employee.usuario_id: {employee.usuario_id}")
    
    # Verificar número de empleado único si se está actualizando
    if "numero_empleado" in update_data and update_data["numero_empleado"] != employee.numero_empleado:
        existing_numero = db.query(Employee).filter(
            Employee.numero_empleado == update_data["numero_empleado"]
        ).first()
        if existing_numero:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El número de empleado ya está en uso"
            )

    # Apply simple field updates first
    for field, value in update_data.items():
        if value is not None:
            setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    
    # Then update user role separately
    if nuevo_rol_id is not None and nuevo_rol_id > 0:
        try:
            user = db.query(User).filter(User.id == employee.usuario_id).first()
            if user:
                print(f"Found user id={user.id}, current rol_id={user.rol_id}, setting to {nuevo_rol_id}")
                user.rol_id = nuevo_rol_id
                db.commit()
                print(f"User role updated to {nuevo_rol_id}")
        except Exception as e:
            print(f"Error updating user role: {e}")

    # Actualizar especialidades si se proporcionan
    if employee_update.especialidad_ids is not None:
        especialidades = db.query(Especialidad).filter(
            Especialidad.id.in_(employee_update.especialidad_ids)
        ).all()
        employee.especialidades = especialidades

    db.commit()
    db.refresh(employee)

    return EmployeeResponse.from_orm_with_relations(employee)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Elimina un empleado (Solo Admin/SuperAdmin)
    """
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empleado no encontrado"
        )

    db.delete(employee)
    db.commit()

    return None


@router.patch("/{employee_id}/toggle-status/", response_model=EmployeeResponse)
def toggle_employee_status(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("Admin", "SuperAdmin"))
):
    """
    Cambia el estado activo/inactivo de un empleado (Solo Admin/SuperAdmin)
    """
    employee = db.query(Employee).options(
        joinedload(Employee.usuario),
        joinedload(Employee.especialidades),
        joinedload(Employee.sucursal)
    ).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empleado no encontrado"
        )
    
    # Toggle status - employee
    new_status = not employee.activo
    employee.activo = new_status
    db.commit()
    db.refresh(employee)
    
    # Also toggle user status
    if employee.usuario:
        employee.usuario.activo = new_status
        db.commit()
    
    return EmployeeResponse.from_orm_with_relations(employee)
