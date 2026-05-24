"""
SQLAlchemy Models
"""
from app.models.catalogos import (
    TipoPaciente,
    Sucursal,
    Nacionalidad,
    Rol,
    Especialidad,
    Servicio,
    MedioContacto,
    EstadoCita,
    TipoAntecedente
)
from app.models.user import User
from app.models.patient import Patient
from app.models.employee import Employee
from app.models.appointment import Appointment, BloqueoAgenda
from app.models.consultation import Consultation, ConsultationPhoto
from app.models.prescription import Prescription, PrescriptionMedicine
from app.models.clinical_history import ClinicalHistory, ConsentimientoPaciente
from app.models.clinical_history_ortodoncia import HistorialClinicoOrtodoncia
from app.models.expediente import Expediente
from app.models.payment import Payment, PaymentPartial

__all__ = [
    # Catálogos
    "TipoPaciente",
    "Sucursal",
    "Nacionalidad",
    "Rol",
    "Especialidad",
    "Servicio",
    "MedioContacto",
    "EstadoCita",
    "TipoAntecedente",
    # Principales
    "User",
    "Patient",
    "Employee",
    "Appointment",
    "BloqueoAgenda",
    "Consultation",
    "ConsultationPhoto",
    "Prescription",
    "PrescriptionMedicine",
    "ClinicalHistory",
    "ConsentimientoPaciente",
    "HistorialClinicoOrtodoncia",
    "Expediente",
    "Payment",
    "PaymentPartial",
]
