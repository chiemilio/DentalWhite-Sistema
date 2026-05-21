"""
Pydantic Schemas para validación de requests/responses
"""
from app.schemas.auth import LoginRequest, LoginResponse, TokenPayload
from app.schemas.user import UserBase, UserCreate, UserUpdate, UserResponse, UserInDB
from app.schemas.patient import PatientBase, PatientCreate, PatientUpdate, PatientResponse
from app.schemas.employee import EmployeeBase, EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.schemas.appointment import AppointmentBase, AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.schemas.consultation import ConsultationBase, ConsultationCreate, ConsultationUpdate, ConsultationResponse
from app.schemas.prescription import PrescriptionBase, PrescriptionCreate, PrescriptionResponse
from app.schemas.clinical_history import ClinicalHistoryBase, ClinicalHistoryCreate, ClinicalHistoryResponse
from app.schemas.clinical_history_ortodoncia import (
    HistorialClinicoOrtodonciaBase,
    HistorialClinicoOrtodonciaCreate,
    HistorialClinicoOrtodonciaUpdate,
    HistorialClinicoOrtodonciaResponse,
)

__all__ = [
    # Auth
    "LoginRequest",
    "LoginResponse",
    "TokenPayload",
    # User
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserInDB",
    # Patient
    "PatientBase",
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    # Employee
    "EmployeeBase",
    "EmployeeCreate",
    "EmployeeUpdate",
    "EmployeeResponse",
    # Appointment
    "AppointmentBase",
    "AppointmentCreate",
    "AppointmentUpdate",
    "AppointmentResponse",
    # Consultation
    "ConsultationBase",
    "ConsultationCreate",
    "ConsultationUpdate",
    "ConsultationResponse",
    # Prescription
    "PrescriptionBase",
    "PrescriptionCreate",
    "PrescriptionResponse",
    # Clinical History
    "ClinicalHistoryBase",
    "ClinicalHistoryCreate",
    "ClinicalHistoryResponse",
    # Clinical History Ortodoncia
    "HistorialClinicoOrtodonciaBase",
    "HistorialClinicoOrtodonciaCreate",
    "HistorialClinicoOrtodonciaUpdate",
    "HistorialClinicoOrtodonciaResponse",
]
