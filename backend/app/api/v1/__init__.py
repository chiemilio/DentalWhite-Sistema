"""
API v1 Routes
"""
from fastapi import APIRouter
from app.api.v1 import auth, users, patients, employees, appointments, consultations, prescriptions, clinical_history, clinical_history_ortodoncia, catalogos, payments

api_router = APIRouter(prefix="/api/v1")

# Incluir todos los routers
api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(catalogos.router, prefix="/catalogos", tags=["Catálogos"])
api_router.include_router(users.router, prefix="/users", tags=["Usuarios"])
api_router.include_router(patients.router, prefix="/patients", tags=["Pacientes"])
api_router.include_router(employees.router, prefix="/employees", tags=["Empleados"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["Citas"])
api_router.include_router(consultations.router, prefix="/consultations", tags=["Consultas"])
api_router.include_router(prescriptions.router, prefix="/prescriptions", tags=["Recetas"])
api_router.include_router(clinical_history.router, prefix="/clinical-history", tags=["Historial Clínico"])
api_router.include_router(clinical_history_ortodoncia.router, prefix="/clinical-history", tags=["Historial Clínico Ortodoncia"])
api_router.include_router(payments.router, prefix="/payments", tags=["Pagos"])
