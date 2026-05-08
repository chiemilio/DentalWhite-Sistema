"""
Schemas de Empleado
"""
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class EmployeeBase(BaseModel):
    """Schema base de Empleado"""
    numero_empleado: str = Field(..., max_length=50, description="Número de empleado único")
    puesto: Optional[str] = Field(None, max_length=100, description="Puesto del empleado")
    fecha_ingreso: Optional[date] = None  # CAMBIADO a Optional porque puede ser NULL
    cedula_profesional: Optional[str] = Field(None, max_length=50, description="Cédula profesional")
    salario: Optional[Decimal] = Field(None, ge=0, description="Salario mensual")
    notas: Optional[str] = None


class EmployeeCreate(EmployeeBase):
    """Schema para crear Empleado - acepta campos de usuario"""
    email: str = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=6, description="Contraseña del usuario")
    nombre: str = Field(..., max_length=100, description="Nombre completo del usuario")
    telefono: str = Field(..., max_length=20, description="Teléfono del usuario")
    rol_id: int = Field(..., description="ID del rol (1=Admin, 2=Recepcionista, 3=Doctor, 4=Paciente)")
    especialidad_ids: List[int] = Field(default=[], description="IDs de especialidades del empleado")


class EmployeeUpdate(BaseModel):
    """Schema para actualizar Empleado"""
    numero_empleado: Optional[str] = Field(None, max_length=50)
    puesto: Optional[str] = Field(None, max_length=100)
    fecha_ingreso: Optional[date] = None
    cedula_profesional: Optional[str] = Field(None, max_length=50)
    salario: Optional[Decimal] = Field(None, ge=0)
    notas: Optional[str] = None
    especialidad_ids: Optional[List[int]] = Field(None, description="IDs de especialidades")
    sucursal_id: Optional[int] = Field(None, description="ID de sucursal")
    usuario_rol_id: Optional[int] = Field(None, description="ID del rol de usuario")


class EmployeeResponse(EmployeeBase):
    """Schema de respuesta de Empleado"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    # Información del usuario asociado
    usuario_nombre: Optional[str] = None
    usuario_email: Optional[str] = None
    usuario_telefono: Optional[str] = None
    usuario_rol_id: Optional[int] = None
    usuario_rol_nombre: Optional[str] = None
    
    # Sucursal
    sucursal_id: Optional[int] = None
    sucursal_nombre: Optional[str] = None
    
    # Puesto
    puesto: Optional[str] = None

    # Especialidades
    especialidades: List[str] = Field(default=[], description="Nombres de especialidades")

    @classmethod
    def from_orm_with_relations(cls, employee):
        """Constructor personalizado para incluir relaciones"""
        usuario_nombre = None
        usuario_email = None
        usuario_telefono = None
        usuario_rol_id = None
        usuario_rol_nombre = None
        sucursal_id = None
        sucursal_nombre = None
        
        if employee.usuario:
            nombre = employee.usuario.nombre or ''
            apellido = employee.usuario.apellido_paterno or ''
            usuario_nombre = f"{nombre} {apellido}".strip() or None
            usuario_email = employee.usuario.email or None
            usuario_telefono = employee.usuario.telefono_principal or None
            usuario_rol_id = employee.usuario.rol_id
            print(f"DEBUG: usuario.rol = {employee.usuario.rol}")
            print(f"DEBUG: type(usuario.rol) = {type(employee.usuario.rol)}")
            if employee.usuario.rol:
                usuario_rol_nombre = employee.usuario.rol.nombre
                print(f"DEBUG: usuario_rol_nombre = {usuario_rol_nombre}")
            else:
                # Try to query the role directly
                from sqlalchemy.orm import Session
                print(f"DEBUG: usuario.rol is None, rol_id = {usuario_rol_id}")
        
        if employee.sucursal:
            sucursal_id = employee.sucursal.id
            sucursal_nombre = employee.sucursal.nombre
        
        especialidades = []
        if employee.especialidades:
            especialidades = [esp.nombre for esp in employee.especialidades if esp.nombre]
        
        # Use fecha_contratacion from model
        fecha_ingreso = employee.fecha_contratacion
        
        return cls(
            id=employee.id,
            usuario_id=employee.usuario_id,
            numero_empleado=employee.numero_empleado,
            fecha_ingreso=fecha_ingreso,
            cedula_profesional=employee.cedula_profesional,
            salario=employee.salario,
            notas=None,
            fecha_creacion=employee.fecha_creacion,
            fecha_actualizacion=employee.fecha_actualizacion,
            usuario_nombre=usuario_nombre,
            usuario_email=usuario_email,
            usuario_telefono=usuario_telefono,
            usuario_rol_id=usuario_rol_id,
            usuario_rol_nombre=usuario_rol_nombre,
            sucursal_id=sucursal_id,
            sucursal_nombre=sucursal_nombre,
            puesto=employee.puesto,
            especialidades=especialidades
        )
