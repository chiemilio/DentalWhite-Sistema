"""
Endpoint de debug para ver citas existentes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from datetime import date

router = APIRouter()


@router.get("/debug-citas")
def debug_citas(fecha: str = None, sucursal_id: int = None, db: Session = Depends(get_db)):
    """Debug: ver citas existentes"""
    query = text("""
        SELECT c.id, c.fecha, c.hora, c.paciente_id, c.sucursal_id, c.empleado_id, c.activo,
               p.nombre as paciente_nombre,
               s.nombre as sucursal_nombre,
               e.nombre as empleado_nombre
        FROM citas c
        LEFT JOIN pacientes p ON c.paciente_id = p.id
        LEFT JOIN cat_sucursales s ON c.sucursal_id = s.id
        LEFT JOIN empleados e ON c.empleado_id = e.id
        WHERE c.activo = true
    """)
    
    params = {}
    if fecha:
        query = text(str(query) + " AND c.fecha = :fecha")
        params['fecha'] = fecha
    if sucursal_id:
        query = text(str(query) + " AND c.sucursal_id = :sucursal_id")
        params['sucursal_id'] = sucursal_id
    
    result = db.execute(query, params)
    citas = []
    for row in result:
        citas.append({
            "id": row[0],
            "fecha": str(row[1]) if row[1] else None,
            "hora": str(row[2]) if row[2] else None,
            "paciente_id": row[3],
            "sucursal_id": row[4],
            "empleado_id": row[5],
            "activo": row[6],
            "paciente_nombre": row[7],
            "sucursal_nombre": row[8],
            "empleado_nombre": row[9]
        })
    
    return {"citas": citas, "total": len(citas)}


@router.get("/debug-bloqueos")
def debug_bloqueos(fecha: str = None, sucursal_id: int = None, db: Session = Depends(get_db)):
    """Debug: ver bloqueos de agenda"""
    query = text("""
        SELECT id, sucursal_id, empleado_id, fecha_inicio, fecha_fin, 
               hora_inicio, hora_fin, motivo, horario_id, activo
        FROM bloqueos_agenda
        WHERE activo = true
    """)
    
    params = {}
    if fecha:
        query = text(str(query) + " AND fecha_inicio <= :fecha AND fecha_fin >= :fecha")
        params['fecha'] = fecha
    if sucursal_id:
        query = text(str(query) + " AND sucursal_id = :sucursal_id")
        params['sucursal_id'] = sucursal_id
    
    result = db.execute(query, params)
    bloqueos = []
    for row in result:
        bloqueos.append({
            "id": row[0],
            "sucursal_id": row[1],
            "empleado_id": row[2],
            "fecha_inicio": str(row[3]) if row[3] else None,
            "fecha_fin": str(row[4]) if row[4] else None,
            "hora_inicio": str(row[5]) if row[5] else None,
            "hora_fin": str(row[6]) if row[6] else None,
            "motivo": row[7],
            "horario_id": row[8],
            "activo": row[9]
        })
    
    return {"bloqueos": bloqueos, "total": len(bloqueos)}