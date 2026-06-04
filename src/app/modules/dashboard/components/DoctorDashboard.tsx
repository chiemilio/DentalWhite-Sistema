import { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Textarea } from '../../../shared/ui/textarea';
import { Checkbox } from '../../../shared/ui/checkbox';
import { Calendar, FileText, User, Plus, Stethoscope, ClipboardList, FileSignature, X, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { ScrollArea } from '../../../shared/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { toast } from 'sonner';
import {
  appointments as initialAppointments,
  medicalRecords as initialRecords,
  patients,
  services,
  workCenters,
  type Appointment,
  type MedicalRecord,
} from '../../../shared/data/mockData';
import { useAuth } from '../../auth/context/AuthContext';
import { apiClient, type BackendAppointment, type BackendPatient } from '../../../shared/utils/api';

import { PatientDiagnosisView } from '../../patients/components/PatientDiagnosisView';
import { PrintableMedicalRecord } from '../../medical-records/components/PrintableMedicalRecord';
import { ConsentForm } from '../../medical-records/components/ConsentForm';
import { ClinicalHistoryForm, type ClinicalHistoryData } from '../../medical-records/components/ClinicalHistoryForm';

export function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);
  const [patients, setPatients] = useState<BackendPatient[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [empleadoId, setEmpleadoId] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [errorInfo, setErrorInfo] = useState<string>('');
  // Helper para fecha local YYYY-MM-DD
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false);
  const [isConsentFormOpen, setIsConsentFormOpen] = useState(false);
  const [clinicalHistoryData, setClinicalHistoryData] = useState<Partial<ClinicalHistoryData>>({});
  const [isSavingClinicalHistory, setIsSavingClinicalHistory] = useState(false);
  const [existingClinicalHistory, setExistingClinicalHistory] = useState<ClinicalHistoryData | null>(null);
  
  // Appointment management states
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<any | null>(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
  });
  const [attendingAppointment, setAttendingAppointment] = useState<BackendAppointment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  const [viewingServiceId, setViewingServiceId] = useState<number>(0);

  // Cargar datos desde API
  useEffect(() => {
    if (!user?.id) {
      return;
    }
    
    
    
const loadData = async () => {
      try {
        setErrorInfo('');
        
        const userId = parseInt(user.id, 10);
        
        const empResponse = await apiClient.get<any[]>(`/employees/?usuario_id=${userId}`, true);
        
        if (!empResponse || empResponse.length === 0) {
          setErrorInfo('No se encontró empleado para este usuario');
          setAppointments([]);
          return;
        }
        
        const empId = empResponse[0].id;
        const empPuesto = empResponse[0].puesto;
        
        setEmpleadoId(empId);
        
        const appointmentsData = await apiClient.get<any[]>(`/appointments/?empleado_id=${empId}`, true);
        const patientsData = await apiClient.get<any[]>('/patients/', true);
        const servicesData = await apiClient.get<any[]>('/catalogos/servicios', true);
        
        setAppointments(appointmentsData || []);
        setPatients(patientsData || []);
        setServices(servicesData || []);
        
      } catch (error: any) {
        console.error('Error loading data:', error);
        setErrorInfo('Error: ' + (error?.message || 'Error desconocido'));
      }
    };
    
    loadData();
  }, [user?.id, user?.role]);

// Obtener fechas únicas con citas activas (programadas, confirmadas, pagadas)
  const confirmedDates = [...new Set(
    appointments
      .filter(a => [1, 2, 5, 6].includes(a.estado_cita_id))
      .map(a => {
        if (a.fecha) return a.fecha;
        if (a.fecha_hora) {
          const parts = a.fecha_hora.split('T');
          return parts[0] || null;
        }
        return null;
      })
      .filter(Boolean)
  )].sort();

  // Filtrar citas: activas (1=Programada, 2=Confirmada, 5=Pagado Parcial, 6=Pagado Completo) y fecha seleccionada
  const filteredAppointments = appointments.filter(apt => {
    if (![1, 2, 5, 6].includes(apt.estado_cita_id)) return false;
    
    // Extraer fecha de múltiples fuentes posibles
    let aptDate = null;
    
    // Fuente 1: campo fecha directo
    if (apt.fecha) {
      aptDate = apt.fecha;
    }
    // Fuente 2: fecha_hora en formato ISO (2026-05-14T09:00:00)
    else if (apt.fecha_hora) {
      const parts = apt.fecha_hora.split('T');
      if (parts[0]) aptDate = parts[0];
    }
    
    // Normalizar comparación de fechas
    if (!aptDate) return false;
    
    return aptDate === selectedDate;
  });

  // Obtener la fecha de hoy para fallback
  const todayStr = new Date().toISOString().split('T')[0];

  // Cargar expedientes clínicos del médico
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const records = await apiClient.get<any[]>('/clinical-history/', true);
        setMedicalRecords(Array.isArray(records) ? records : []);
      } catch {
        // Silently handle error
      }
    };
    loadRecords();
  }, []);

  const [newRecord, setNewRecord] = useState<any>({
    currentDentalTreatment: '',
    currentMedicalTreatment: '',
    prescribedMedications: '',
    oralHygiene: '',
    diet: '',
    allergies: '',
    observations: '',
    hardTissues: { enamel: '', root: '', dentin: '', bone: '' },
    softTissues: { gum: '', epithelialInsertion: '', pulp: '', palate: '', cheeks: '' },
    habits: {
      bruxism: false,
      muscularContractions: false,
      biteHabits: '',
      sucking: { lips: false, tongue: false, fingers: false },
    },
    personalDiseases: {
      cardiovascular: '',
      nervousSystem: '',
      respiratory: '',
      hemorrhagicTendency: '',
      labTests: '',
      renal: '',
      diabetes: '',
      arthritis: '',
      digestive: '',
      generalState: '',
    },
    consultReason: {
      emergency: false,
      review: false,
      caries: false,
      odontoxesis: false,
      bridge: false,
      extraction: false,
      amalgams: false,
      prosthodontics: false,
      other: '',
    },
    clinicalHistory: { physicalState: 'good', dentalState: 'good' },
    pathologicalHistory: { tonsillitis: false, adenoids: false, herpes: false, flu: false, respiratoryProblems: false },
    nonPathologicalHistory: { lip: false, tongue: false, objects: false, finger: false, other: '' },
    habitFrequency: '',
    habitDuration: '',
    habitIntensity: '',
    receivedMedicalAttention: false,
    medicalAttentionCause: '',
    faceExam: { form: '', profile: '', ears: '', tic: '', rictus: '', bipupilarLine: '' },
    holdawayLine: { labialMusculature: '', mentonianHyperactivity: false },
    oralExam: {
      molarRelation: '', canineRelation: '', incisalRelation: '',
      overJet: '', overBite: '', openBite: '', midline: '',
      absentTeeth: '', malformedTeeth: '', teethWithCavities: '',
      temporaryTeeth: '', posteriorCrossbite: '', brushingTechnique: '', periodontalState: '',
    },
    radiographicExam: {
      cephalography: '', orthoradial: '', palmar: '', occlusal: '',
      oblique: '', orthopantography: '', mesioradial: '',
      congenitalAbsence: '', supernumerary: '', cysts: '',
      periapicalLesions: '', inclusions: '', radicularResorption: '',
      thirdMolars: '', dwarfRoots: '', abnormalRoots: '',
    },
    planTratamiento: {
      diagnostico: '',
      procedimientos: [{ descripcion: '', costo: 0 }],
      costo_total_estimado: 0,
      notas: '',
      estado: 'pendiente',
    },
  });

  // Pre-cargar expediente existente al seleccionar paciente en el diálogo
  useEffect(() => {
    if (!isRecordDialogOpen || !selectedPatientId) return;
    const loadExisting = async () => {
      try {
        const records = await apiClient.get<any[]>(`/expedientes/?paciente_id=${selectedPatientId}`, true);
        if (records && records.length > 0) {
          const datos = records[0].datos || {};
          setNewRecord((prev: any) => ({
            ...prev,
            ...datos,
            hardTissues: datos.hardTissues || prev.hardTissues,
            softTissues: datos.softTissues || prev.softTissues,
            habits: datos.habits || prev.habits,
            personalDiseases: datos.personalDiseases || prev.personalDiseases,
            consultReason: datos.consultReason || prev.consultReason,
            clinicalHistory: datos.clinicalHistory || prev.clinicalHistory,
            pathologicalHistory: datos.pathologicalHistory || prev.pathologicalHistory,
            nonPathologicalHistory: datos.nonPathologicalHistory || prev.nonPathologicalHistory,
            faceExam: datos.faceExam || prev.faceExam,
            holdawayLine: datos.holdawayLine || prev.holdawayLine,
            oralExam: datos.oralExam || prev.oralExam,
            radiographicExam: datos.radiographicExam || prev.radiographicExam,
            planTratamiento: datos.planTratamiento || prev.planTratamiento,
          }));
        }
      } catch {
        // No existe expediente aún — mantener valores por defecto
      }
    };
    loadExisting();
  }, [isRecordDialogOpen, selectedPatientId]);

  const handleCreateRecord = async () => {
    if (!selectedPatientId) {
      toast.error('Selecciona un paciente');
      return;
    }

    try {
      const payload = {
        medico_id: empleadoId,
        datos: {
          currentDentalTreatment: newRecord.currentDentalTreatment,
          currentMedicalTreatment: newRecord.currentMedicalTreatment,
          prescribedMedications: newRecord.prescribedMedications,
          oralHygiene: newRecord.oralHygiene,
          diet: newRecord.diet,
          allergies: newRecord.allergies,
          observations: newRecord.observations,
          hardTissues: newRecord.hardTissues,
          softTissues: newRecord.softTissues,
          habits: newRecord.habits,
          personalDiseases: newRecord.personalDiseases,
          consultReason: newRecord.consultReason,
          clinicalHistory: newRecord.clinicalHistory,
          pathologicalHistory: newRecord.pathologicalHistory,
          nonPathologicalHistory: newRecord.nonPathologicalHistory,
          habitFrequency: newRecord.habitFrequency,
          habitDuration: newRecord.habitDuration,
          habitIntensity: newRecord.habitIntensity,
          receivedMedicalAttention: newRecord.receivedMedicalAttention,
          medicalAttentionCause: newRecord.medicalAttentionCause,
          faceExam: newRecord.faceExam,
          holdawayLine: newRecord.holdawayLine,
          oralExam: newRecord.oralExam,
          radiographicExam: newRecord.radiographicExam,
          planTratamiento: newRecord.planTratamiento,
        },
      };

      await apiClient.put(`/expedientes/by-patient/${selectedPatientId}`, payload, true);

      setIsRecordDialogOpen(false);
      setSelectedPatientId('');
      setNewRecord({
        currentDentalTreatment: '',
        currentMedicalTreatment: '',
        prescribedMedications: '',
        oralHygiene: '',
        diet: '',
        allergies: '',
        observations: '',
        hardTissues: { enamel: '', root: '', dentin: '', bone: '' },
        softTissues: { gum: '', epithelialInsertion: '', pulp: '', palate: '', cheeks: '' },
        habits: {
          bruxism: false,
          muscularContractions: false,
          biteHabits: '',
          sucking: { lips: false, tongue: false, fingers: false },
        },
        personalDiseases: {
          cardiovascular: '', nervousSystem: '', respiratory: '',
          hemorrhagicTendency: '', labTests: '', renal: '',
          diabetes: '', arthritis: '', digestive: '', generalState: '',
        },
        consultReason: {
          emergency: false, review: false, caries: false, odontoxesis: false,
          bridge: false, extraction: false, amalgams: false, prosthodontics: false, other: '',
        },
        clinicalHistory: { physicalState: 'good', dentalState: 'good' },
        pathologicalHistory: { tonsillitis: false, adenoids: false, herpes: false, flu: false, respiratoryProblems: false },
        nonPathologicalHistory: { lip: false, tongue: false, objects: false, finger: false, other: '' },
        habitFrequency: '', habitDuration: '', habitIntensity: '',
        receivedMedicalAttention: false, medicalAttentionCause: '',
        faceExam: { form: '', profile: '', ears: '', tic: '', rictus: '', bipupilarLine: '' },
        holdawayLine: { labialMusculature: '', mentonianHyperactivity: false },
        oralExam: {
          molarRelation: '', canineRelation: '', incisalRelation: '',
          overJet: '', overBite: '', openBite: '', midline: '',
          absentTeeth: '', malformedTeeth: '', teethWithCavities: '',
          temporaryTeeth: '', posteriorCrossbite: '', brushingTechnique: '', periodontalState: '',
        },
        radiographicExam: {
          cephalography: '', orthoradial: '', palmar: '', occlusal: '',
          oblique: '', orthopantography: '', mesioradial: '',
          congenitalAbsence: '', supernumerary: '', cysts: '',
          periapicalLesions: '', inclusions: '', radicularResorption: '',
          thirdMolars: '', dwarfRoots: '', abnormalRoots: '',
        },
        planTratamiento: {
          diagnostico: '',
          procedimientos: [{ descripcion: '', costo: 0 }],
          costo_total_estimado: 0,
          notas: '',
          estado: 'pendiente',
        },
      });
      toast.success('Expediente guardado exitosamente');
    } catch (error: any) {
      toast.error('Error al guardar expediente: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleViewRecord = async (patientId: string, servicioId?: number) => {
    setViewingServiceId(servicioId || 0);
    try {
      const records = await apiClient.get<any[]>(`/expedientes/?paciente_id=${patientId}`, true);
      if (records && records.length > 0) {
        const expediente = records[0];
        const patient = patients.find((p) => p.id === parseInt(patientId));

        const record: MedicalRecord = {
          id: expediente.id.toString(),
          patientId: patientId,
          patientName: patient?.usuario_nombre || `Paciente #${patientId}`,
          createdDate: expediente.fecha_creacion?.split('T')[0] || '',
          startDate: expediente.fecha_creacion?.split('T')[0] || '',
          address: patient?.direccion || '',
          phone: patient?.usuario_telefono || '',
          occupation: patient?.ocupacion || '',
          age: patient?.fecha_nacimiento ? Math.floor((Date.now() - new Date(patient.fecha_nacimiento).getTime()) / 31557600000) : 0,
          reference: 'Sistema',
          sex: patient?.sexo || 'N/A',
          colony: patient?.ciudad || '',
          delegation: patient?.estado || '',
          postalCode: patient?.codigo_postal || '',
          assignedDoctor: user?.name || '',
          clinicalHistory: expediente.datos?.clinicalHistory || { physicalState: 'good', dentalState: 'good' },
          pathologicalHistory: expediente.datos?.pathologicalHistory || {
            tonsillitis: false, adenoids: false, herpes: false, flu: false, respiratoryProblems: false,
          },
          nonPathologicalHistory: expediente.datos?.nonPathologicalHistory || { lip: false, tongue: false, objects: false, finger: false, other: '' },
          habitFrequency: expediente.datos?.habitFrequency || '',
          habitDuration: expediente.datos?.habitDuration || '',
          habitIntensity: expediente.datos?.habitIntensity || '',
          receivedMedicalAttention: expediente.datos?.receivedMedicalAttention || false,
          medicalAttentionCause: expediente.datos?.medicalAttentionCause || '',
          faceExam: expediente.datos?.faceExam || { form: '', profile: '', ears: '', tic: '', rictus: '', bipupilarLine: '' },
          holdawayLine: expediente.datos?.holdawayLine || { labialMusculature: '', mentonianHyperactivity: false },
          oralExam: expediente.datos?.oralExam || {
            molarRelation: '', canineRelation: '', incisalRelation: '',
            overJet: '', overBite: '', openBite: '', midline: '',
            absentTeeth: '', malformedTeeth: '', teethWithCavities: '',
            temporaryTeeth: '', posteriorCrossbite: '', brushingTechnique: '', periodontalState: '',
          },
          radiographicExam: expediente.datos?.radiographicExam || {
            cephalography: '', orthoradial: '', palmar: '', occlusal: '',
            oblique: '', orthopantography: '', mesioradial: '',
            congenitalAbsence: '', supernumerary: '', cysts: '',
            periapicalLesions: '', inclusions: '', radicularResorption: '',
            thirdMolars: '', dwarfRoots: '', abnormalRoots: '',
          },
          observations: expediente.datos?.observations || JSON.stringify(expediente.datos || {}, null, 2),
          appointmentHistory: [],
        };

        setViewingRecord(record);
        setIsViewDialogOpen(true);
      } else {
        toast.error('Este paciente no tiene expediente');
      }
    } catch (error) {
      toast.error('Error al cargar expediente');
    }
  };

  const handleSaveClinicalHistory = async () => {
    if (!selectedPatientId) {
      toast.error('Selecciona un paciente');
      return;
    }
    setIsSavingClinicalHistory(true);
    try {
      const pacienteId = parseInt(selectedPatientId);
      const fechaHoy = new Date().toISOString().split('T')[0];

      // Check if record already exists for this patient+tipo
      const existingRecords = await apiClient.get<any[]>(`/clinical-history/?paciente_id=${pacienteId}`, true);
      const existingRecord = Array.isArray(existingRecords) ? existingRecords.find(
        (r: any) => r.tipo_antecedente_id === 1
      ) : null;

      const descripcion = JSON.stringify(clinicalHistoryData);
      const notas = clinicalHistoryData.atencion_medica || '';

      if (existingRecord) {
        await apiClient.put(`/clinical-history/${existingRecord.id}`, {
          descripcion,
          notas,
        }, true);
        toast.success('Historial clínico actualizado exitosamente');
      } else {
        await apiClient.post('/clinical-history/', {
          paciente_id: pacienteId,
          tipo_antecedente_id: 1,
          descripcion,
          fecha_diagnostico: fechaHoy,
          notas,
          activo: true,
        }, true);
        toast.success('Historial clínico guardado exitosamente');
      }
      setIsClinicalHistoryOpen(false);
      setSelectedPatientId('');
      setClinicalHistoryData({});
      setExistingClinicalHistory(null);
    } catch (error: any) {
      toast.error(`Error al guardar: ${error.message}`);
    } finally {
      setIsSavingClinicalHistory(false);
    }
  };

  const handleLoadClinicalHistory = async (patientId: string) => {
    if (!patientId) {
      setClinicalHistoryData({});
      setExistingClinicalHistory(null);
      return;
    }
    try {
      const records = await apiClient.get<any[]>(`/clinical-history/?paciente_id=${patientId}`, true);
      const record = Array.isArray(records) ? records.find(
        (r: any) => r.tipo_antecedente_id === 1
      ) : null;
      if (record) {
        setExistingClinicalHistory(record);
        try {
          const parsed = JSON.parse(record.descripcion || '{}');
          setClinicalHistoryData(parsed);
        } catch {
          setClinicalHistoryData({});
        }
      } else {
        setClinicalHistoryData({});
        setExistingClinicalHistory(null);
      }
    } catch {
      setClinicalHistoryData({});
      setExistingClinicalHistory(null);
    }
  };

  const handleAttendAppointment = async (appointment: BackendAppointment) => {
    try {
      // 4 = Completada (el backend no tiene "en atención")
      await apiClient.put(`/appointments/${appointment.id}`, {
        estado_cita_id: 4
      }, true);
      toast.success('Cita Iniciada');
      
      // Obtener datos completos del paciente desde el backend
      const patientData = await apiClient.get<BackendPatient>(`/patients/${appointment.paciente_id}`, true);
      
      setAttendingAppointment({
        ...appointment,
        _patientData: patientData
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al iniciar atención');
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      // 3 = Cancelada
      await apiClient.put(`/appointments/${id}`, {
        estado_cita_id: 3
      }, true);
      toast.success('Cita cancelada');
      // Recargar citas
      const data = await apiClient.get<BackendAppointment[]>(`/appointments/?empleado_id=${empleadoId}`, true);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al cancelar cita');
    }
  };

  const handleRescheduleAppointment = async (appointment: BackendAppointment) => {
    if (!rescheduleData.date || !rescheduleData.time) {
      toast.error('Selecciona fecha y hora');
      return;
    }
    try {
      const fecha_hora = `${rescheduleData.date}T${rescheduleData.time}:00`;
      await apiClient.put(`/appointments/${appointment.id}`, {
        fecha_hora
      }, true);
      toast.success('Cita reprogramada');
      setIsRescheduleDialogOpen(false);
      // Recargar citas
      const data = await apiClient.get<BackendAppointment[]>(`/appointments/?empleado_id=${empleadoId}`, true);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al reprogramar');
    }
  };

  const handleBackFromDiagnosis = async () => {
    setAttendingAppointment(null);
    // Recargar citas después de atender
    try {
      const data = await apiClient.get<BackendAppointment[]>(`/appointments/?empleado_id=${empleadoId}`, true);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error reloading appointments:', error);
    }
  };

  // If attending a patient
  if (attendingAppointment) {
    // Use patient data from API or fall back to local patients array
    const patientData = (attendingAppointment as any)._patientData || patients.find((p) => p.id === attendingAppointment.paciente_id);
    if (patientData) {
      // Map BackendPatient to Patient
      const mappedPatient: Patient = {
        id: patientData.id.toString(),
        name: patientData.usuario_nombre || 'Sin nombre',
        email: patientData.usuario_email || '',
        phone: patientData.usuario_telefono || '',
        age: patientData.fecha_nacimiento ? Math.floor((Date.now() - new Date(patientData.fecha_nacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined,
        address: patientData.direccion || '',
        registrationDate: patientData.fecha_creacion || new Date().toISOString(),
      };
      // Map BackendAppointment to Appointment
      const mappedAppointment: Appointment = {
        id: attendingAppointment.id.toString(),
        patientId: attendingAppointment.paciente_id.toString(),
        patientName: attendingAppointment.paciente_nombre || '',
        serviceId: attendingAppointment.servicio_id.toString(),
        serviceName: attendingAppointment.servicio_nombre || '',
        workCenterId: attendingAppointment.sucursal_id.toString(),
        workCenterName: attendingAppointment.sucursal_nombre || '',
        date: attendingAppointment.fecha_hora?.split('T')[0] || '',
        time: attendingAppointment.fecha_hora?.split('T')[1]?.slice(0, 5) || '',
        status: 'confirmed' as const,
      };
      return (
        <PatientDiagnosisView
          patient={mappedPatient}
          appointment={mappedAppointment}
          citaId={attendingAppointment.id}
          onBack={handleBackFromDiagnosis}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-sky-600">Panel del Médico</h2>
          <p className="text-gray-600">Dr. {user?.name}</p>
        </div>
        <div className="flex gap-3">
          
          <Dialog open={isClinicalHistoryOpen} onOpenChange={setIsClinicalHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
                <ClipboardList className="mr-2" size={20} />
                Historial Clínico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full max-h-[95vh]">
              <DialogHeader>
                <DialogTitle className="text-sky-600 text-sm">Historial Clínico del Paciente - Ortodoncia</DialogTitle>
                <DialogDescription className="sr-only">Formulario para llenar el historial clínico completo del paciente</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[85vh] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Seleccionar Paciente ({patients.length} disponibles)</Label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={selectedPatientId}
                      onChange={(e) => {
                        setSelectedPatientId(e.target.value);
                        handleLoadClinicalHistory(e.target.value);
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.usuario_nombre || `Paciente #${patient.id}`} - Exp: {patient.numero_expediente}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatientId && (() => {
                    const patient = patients.find((p) => p.id === parseInt(selectedPatientId));
                    
                    if (!patient) return null;

                    const patientForForm = {
                      id: patient.id.toString(),
                      name: patient.usuario_nombre || 'Paciente',
                      age: patient.fecha_nacimiento ? Math.floor((Date.now() - new Date(patient.fecha_nacimiento).getTime()) / 31557600000) : 0,
                      sex: patient.sexo || 'N/A',
                      address: patient.direccion || '',
                      colony: patient.ciudad || '',
                      municipality: patient.estado || '',
                      postalCode: patient.codigo_postal || '',
                      phone: patient.usuario_telefono || '',
                      occupation: patient.ocupacion || '',
                      tutor: patient.tutor_nombre || '',
                    };
                    
                    return (
                      <div className="space-y-4">
                        <ClinicalHistoryForm
                          patient={patientForForm}
                          doctorName={user?.name || ''}
                          onDataChange={setClinicalHistoryData}
                          initialData={existingClinicalHistory || undefined}
                        />
                        <Button
                          onClick={handleSaveClinicalHistory}
                          disabled={isSavingClinicalHistory}
                          className="w-full bg-sky-500 hover:bg-sky-600 text-sm"
                        >
                          {isSavingClinicalHistory ? 'Guardando...' : (existingClinicalHistory ? 'Actualizar Historial Clínico' : 'Guardar e Imprimir Historial Clínico')}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={isConsentFormOpen} onOpenChange={setIsConsentFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
                <FileSignature className="mr-2" size={20} />
                Consentimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-sky-600">Consentimiento Informado</DialogTitle>
                <DialogDescription className="sr-only">Formulario de consentimiento informado del paciente para tratamientos estéticos</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[75vh] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Seleccionar Paciente</Label>
                    <select
                      className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.usuario_nombre || `Paciente #${patient.id}`} - Exp: {patient.numero_expediente}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatientId && (() => {
                    const patient = patients.find((p) => p.id === parseInt(selectedPatientId));
                    
                    return (
                      <div className="space-y-4">
                        <ConsentForm
                          patientName={patient?.usuario_nombre || ''}
                          doctorName={user?.name || ''}
                        />
                        <Button
                          onClick={async () => {
                            if (!selectedPatientId) return;
                            try {
                              const today = new Date();
                              const dateStr = today.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
                              const texto = `Consentimiento para Tratamiento Cosmético (Incluye Blanqueamiento y/o Carillas).\nPaciente: ${patient?.usuario_nombre || ''}\nDoctor: ${user?.name || ''}\nFecha: ${dateStr}\n\nEl paciente declara haber sido informado de los riesgos, beneficios y alternativas del tratamiento, autorizando su realización de forma voluntaria.`;
                              await apiClient.post('/consentimientos/', {
                                paciente_id: parseInt(selectedPatientId),
                                servicio_id: 1,
                                texto_consentimiento: texto,
                              }, true);
                              toast.success('Consentimiento registrado exitosamente');
                              setIsConsentFormOpen(false);
                              setSelectedPatientId('');
                            } catch (error: any) {
                              toast.error('Error al guardar consentimiento: ' + (error.message || ''));
                            }
                          }}
                          className="w-full bg-sky-500 hover:bg-sky-600"
                        >
                          Guardar e Imprimir Consentimiento
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sky-500 hover:bg-sky-600">
                <Plus className="mr-2" size={20} />
                Crear Expediente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-sky-600">Nuevo Expediente Dental</DialogTitle>
                <DialogDescription className="sr-only">Formulario para crear un nuevo expediente dental del paciente</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Patient Selection */}
                  <div className="space-y-2">
                    <Label>Seleccionar Paciente</Label>
                    <select
                      className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.usuario_nombre || `Paciente #${patient.id}`} - Exp: {patient.numero_expediente}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="tissues">Tejidos</TabsTrigger>
                      <TabsTrigger value="habits">Hábitos</TabsTrigger>
                      <TabsTrigger value="antecedentes">Antecedentes</TabsTrigger>
                      <TabsTrigger value="exam">Examen Clínico</TabsTrigger>
                      <TabsTrigger value="plan">Plan Tratamiento</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tratamiento Dental Actual</Label>
                          <Input
                            value={newRecord.currentDentalTreatment}
                            onChange={(e) =>
                              setNewRecord({ ...newRecord, currentDentalTreatment: e.target.value })
                            }
                            className="border-sky-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tratamiento Médico Actual</Label>
                          <Input
                            value={newRecord.currentMedicalTreatment}
                            onChange={(e) =>
                              setNewRecord({ ...newRecord, currentMedicalTreatment: e.target.value })
                            }
                            className="border-sky-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Medicamentos Recetados</Label>
                          <Input
                            value={newRecord.prescribedMedications}
                            onChange={(e) =>
                              setNewRecord({ ...newRecord, prescribedMedications: e.target.value })
                            }
                            className="border-sky-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Higiene Bucal</Label>
                          <Input
                            value={newRecord.oralHygiene}
                            onChange={(e) =>
                              setNewRecord({ ...newRecord, oralHygiene: e.target.value })
                            }
                            className="border-sky-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Alimentación</Label>
                          <Input
                            value={newRecord.diet}
                            onChange={(e) => setNewRecord({ ...newRecord, diet: e.target.value })}
                            className="border-sky-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Alergias</Label>
                          <Input
                            value={newRecord.allergies}
                            onChange={(e) => setNewRecord({ ...newRecord, allergies: e.target.value })}
                            className="border-sky-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Motivo de Consulta</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries({
                            emergency: 'Emergencia',
                            review: 'Revisión',
                            caries: 'Caries',
                            odontoxesis: 'Odontoxesis',
                            bridge: 'Puente',
                            extraction: 'Extracción',
                            amalgams: 'Amalgamas',
                            prosthodontics: 'Prostodoncia',
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={newRecord.consultReason?.[key as keyof typeof newRecord.consultReason] as boolean}
                                onCheckedChange={(checked) =>
                                  setNewRecord({
                                    ...newRecord,
                                    consultReason: {
                                      ...newRecord.consultReason!,
                                      [key]: checked,
                                    },
                                  })
                                }
                              />
                              <Label htmlFor={key} className="text-sm cursor-pointer">
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Observaciones</Label>
                        <Textarea
                          value={newRecord.observations}
                          onChange={(e) => setNewRecord({ ...newRecord, observations: e.target.value })}
                          rows={4}
                          className="border-sky-200"
                        />
                      </div>

                      <div>
                        <h3 className="text-sky-600 mb-3">Antecedentes Personales Patológicos</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries({
                            cardiovascular: 'Cardiovascular', nervousSystem: 'Sistema Nervioso',
                            respiratory: 'Respiratorio', hemorrhagicTendency: 'Propensión Hemorrágica',
                            labTests: 'Pruebas de Laboratorio', renal: 'Renal',
                            diabetes: 'Diabetes', arthritis: 'Artritis',
                            digestive: 'Digestivo', generalState: 'Estado General',
                          }).map(([key, label]) => (
                            <div key={key} className="space-y-2">
                              <Label>{label}</Label>
                              <Input value={(newRecord.personalDiseases as any)?.[key] || ''}
                                onChange={(e) => setNewRecord({...newRecord, personalDiseases: {...newRecord.personalDiseases, [key]: e.target.value}})}
                                className="border-sky-200" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tissues" className="space-y-4">
                      <div>
                        <h3 className="text-sky-600 mb-3">Tejidos Duros</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Esmalte</Label>
                            <Input
                              value={newRecord.hardTissues?.enamel}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  hardTissues: { ...newRecord.hardTissues!, enamel: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Raíz</Label>
                            <Input
                              value={newRecord.hardTissues?.root}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  hardTissues: { ...newRecord.hardTissues!, root: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Dentina</Label>
                            <Input
                              value={newRecord.hardTissues?.dentin}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  hardTissues: { ...newRecord.hardTissues!, dentin: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Hueso</Label>
                            <Input
                              value={newRecord.hardTissues?.bone}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  hardTissues: { ...newRecord.hardTissues!, bone: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sky-600 mb-3">Tejidos Blandos</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Encía</Label>
                            <Input
                              value={newRecord.softTissues?.gum}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  softTissues: { ...newRecord.softTissues!, gum: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Inserción Epitelial</Label>
                            <Input
                              value={newRecord.softTissues?.epithelialInsertion}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  softTissues: {
                                    ...newRecord.softTissues!,
                                    epithelialInsertion: e.target.value,
                                  },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pulpa</Label>
                            <Input
                              value={newRecord.softTissues?.pulp}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  softTissues: { ...newRecord.softTissues!, pulp: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Velo del Paladar</Label>
                            <Input
                              value={newRecord.softTissues?.palate}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  softTissues: { ...newRecord.softTissues!, palate: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Carrillos</Label>
                            <Input
                              value={newRecord.softTissues?.cheeks}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  softTissues: { ...newRecord.softTissues!, cheeks: e.target.value },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="habits" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bruxism"
                            checked={newRecord.habits?.bruxism}
                            onCheckedChange={(checked) =>
                              setNewRecord({
                                ...newRecord,
                                habits: { ...newRecord.habits!, bruxism: checked as boolean },
                              })
                            }
                          />
                          <Label htmlFor="bruxism" className="cursor-pointer">
                            Bruxismo
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="muscularContractions"
                            checked={newRecord.habits?.muscularContractions}
                            onCheckedChange={(checked) =>
                              setNewRecord({
                                ...newRecord,
                                habits: {
                                  ...newRecord.habits!,
                                  muscularContractions: checked as boolean,
                                },
                              })
                            }
                          />
                          <Label htmlFor="muscularContractions" className="cursor-pointer">
                            Contracciones Musculares
                          </Label>
                        </div>

                        <div className="space-y-2">
                          <Label>Hábitos de Mordida</Label>
                          <Input
                            value={newRecord.habits?.biteHabits}
                            onChange={(e) =>
                              setNewRecord({
                                ...newRecord,
                                habits: { ...newRecord.habits!, biteHabits: e.target.value },
                              })
                            }
                            className="border-sky-200"
                          />
                        </div>

                        <div>
                          <Label className="mb-3 block">Chupadores</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="lips"
                                checked={newRecord.habits?.sucking?.lips}
                                onCheckedChange={(checked) =>
                                  setNewRecord({
                                    ...newRecord,
                                    habits: {
                                      ...newRecord.habits!,
                                      sucking: {
                                        ...newRecord.habits!.sucking,
                                        lips: checked as boolean,
                                      },
                                    },
                                  })
                                }
                              />
                              <Label htmlFor="lips" className="cursor-pointer">
                                Labios
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="tongue"
                                checked={newRecord.habits?.sucking?.tongue}
                                onCheckedChange={(checked) =>
                                  setNewRecord({
                                    ...newRecord,
                                    habits: {
                                      ...newRecord.habits!,
                                      sucking: {
                                        ...newRecord.habits!.sucking,
                                        tongue: checked as boolean,
                                      },
                                    },
                                  })
                                }
                              />
                              <Label htmlFor="tongue" className="cursor-pointer">
                                Lengua
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="fingers"
                                checked={newRecord.habits?.sucking?.fingers}
                                onCheckedChange={(checked) =>
                                  setNewRecord({
                                    ...newRecord,
                                    habits: {
                                      ...newRecord.habits!,
                                      sucking: {
                                        ...newRecord.habits!.sucking,
                                        fingers: checked as boolean,
                                      },
                                    },
                                  })
                                }
                              />
                              <Label htmlFor="fingers" className="cursor-pointer">
                                Dedos
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="antecedentes" className="space-y-4">
                      <div>
                        <h3 className="text-sky-600 mb-3">Antecedentes Patológicos</h3>
                        <div className="flex flex-wrap gap-4">
                          {Object.entries({
                            tonsillitis: 'Amigdalitis', adenoids: 'Adenoides', herpes: 'Herpes',
                            flu: 'Gripe', respiratoryProblems: 'Problemas Respiratorios',
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={`path-${key}`}
                                checked={(newRecord.pathologicalHistory as any)?.[key]}
                                onCheckedChange={(checked) =>
                                  setNewRecord({
                                    ...newRecord,
                                    pathologicalHistory: {
                                      ...newRecord.pathologicalHistory,
                                      [key]: checked,
                                    },
                                  })
                                }
                              />
                              <Label htmlFor={`path-${key}`} className="text-sm cursor-pointer">{label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sky-600 mb-3">Antecedentes No Patológicos</h3>
                        <div className="flex flex-wrap gap-4">
                          {Object.entries({
                            lip: 'Labio', tongue: 'Lengua', objects: 'Objetos', finger: 'Dedo',
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={`nonpath-${key}`}
                                checked={(newRecord.nonPathologicalHistory as any)?.[key]}
                                onCheckedChange={(checked) =>
                                  setNewRecord({
                                    ...newRecord,
                                    nonPathologicalHistory: {
                                      ...newRecord.nonPathologicalHistory,
                                      [key]: checked,
                                    },
                                  })
                                }
                              />
                              <Label htmlFor={`nonpath-${key}`} className="text-sm cursor-pointer">{label}</Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Otro:</Label>
                            <Input
                              value={newRecord.nonPathologicalHistory?.other || ''}
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  nonPathologicalHistory: { ...newRecord.nonPathologicalHistory, other: e.target.value },
                                })
                              }
                              className="border-sky-200 max-w-[200px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Frecuencia del Hábito</Label>
                          <Input value={newRecord.habitFrequency} onChange={(e) => setNewRecord({...newRecord, habitFrequency: e.target.value})} className="border-sky-200" />
                        </div>
                        <div className="space-y-2">
                          <Label>Duración del Hábito</Label>
                          <Input value={newRecord.habitDuration} onChange={(e) => setNewRecord({...newRecord, habitDuration: e.target.value})} className="border-sky-200" />
                        </div>
                        <div className="space-y-2">
                          <Label>Intensidad del Hábito</Label>
                          <Input value={newRecord.habitIntensity} onChange={(e) => setNewRecord({...newRecord, habitIntensity: e.target.value})} className="border-sky-200" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>¿Recibió atención médica en el último año?</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="med-attention-yes"
                              checked={newRecord.receivedMedicalAttention === true}
                              onCheckedChange={() => setNewRecord({...newRecord, receivedMedicalAttention: true})}
                            />
                            <Label htmlFor="med-attention-yes" className="cursor-pointer">Sí</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="med-attention-no"
                              checked={newRecord.receivedMedicalAttention === false}
                              onCheckedChange={() => setNewRecord({...newRecord, receivedMedicalAttention: false})}
                            />
                            <Label htmlFor="med-attention-no" className="cursor-pointer">No</Label>
                          </div>
                        </div>
                        {newRecord.receivedMedicalAttention && (
                          <div className="space-y-2">
                            <Label>Causa</Label>
                            <Input value={newRecord.medicalAttentionCause} onChange={(e) => setNewRecord({...newRecord, medicalAttentionCause: e.target.value})} className="border-sky-200" />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="exam" className="space-y-4">
                      <div>
                        <h3 className="text-sky-600 mb-3">Examen de la Cara</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Forma</Label>
                            <div className="flex gap-4">
                              {[{value:'symmetric',label:'Simétrica'},{value:'asymmetric',label:'Asimétrica'}].map(o => (
                                <div key={o.value} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`face-form-${o.value}`}
                                    checked={newRecord.faceExam?.form === o.value}
                                    onCheckedChange={() => setNewRecord({...newRecord, faceExam: {...newRecord.faceExam, form: o.value as any}})}
                                  />
                                  <Label htmlFor={`face-form-${o.value}`} className="text-sm cursor-pointer">{o.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Perfil</Label>
                            <Input value={newRecord.faceExam?.profile || ''} onChange={(e) => setNewRecord({...newRecord, faceExam: {...newRecord.faceExam, profile: e.target.value}})} className="border-sky-200" />
                          </div>
                          <div className="space-y-2">
                            <Label>Orejas</Label>
                            <Input value={newRecord.faceExam?.ears || ''} onChange={(e) => setNewRecord({...newRecord, faceExam: {...newRecord.faceExam, ears: e.target.value}})} className="border-sky-200" />
                          </div>
                          <div className="space-y-2">
                            <Label>TIC</Label>
                            <Input value={newRecord.faceExam?.tic || ''} onChange={(e) => setNewRecord({...newRecord, faceExam: {...newRecord.faceExam, tic: e.target.value}})} className="border-sky-200" />
                          </div>
                          <div className="space-y-2">
                            <Label>Rictus</Label>
                            <Input value={newRecord.faceExam?.rictus || ''} onChange={(e) => setNewRecord({...newRecord, faceExam: {...newRecord.faceExam, rictus: e.target.value}})} className="border-sky-200" />
                          </div>
                          <div className="space-y-2">
                            <Label>Línea Bipupilar</Label>
                            <Input value={newRecord.faceExam?.bipupilarLine || ''} onChange={(e) => setNewRecord({...newRecord, faceExam: {...newRecord.faceExam, bipupilarLine: e.target.value}})} className="border-sky-200" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sky-600 mb-3">Línea de Holdaway</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Musculatura Labial</Label>
                            <div className="flex gap-4">
                              {[{value:'weak',label:'Débil'},{value:'normal',label:'Normal'},{value:'strong',label:'Fuerte'}].map(o => (
                                <div key={o.value} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`holdaway-${o.value}`}
                                    checked={newRecord.holdawayLine?.labialMusculature === o.value}
                                    onCheckedChange={() => setNewRecord({...newRecord, holdawayLine: {...newRecord.holdawayLine, labialMusculature: o.value as any}})}
                                  />
                                  <Label htmlFor={`holdaway-${o.value}`} className="text-sm cursor-pointer">{o.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Hiperactividad Mentoniana</Label>
                            <div className="flex gap-4">
                              {[{value:true,label:'Sí'},{value:false,label:'No'}].map(o => (
                                <div key={String(o.value)} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`mentonian-${o.value}`}
                                    checked={newRecord.holdawayLine?.mentonianHyperactivity === o.value}
                                    onCheckedChange={() => setNewRecord({...newRecord, holdawayLine: {...newRecord.holdawayLine, mentonianHyperactivity: o.value}})}
                                  />
                                  <Label htmlFor={`mentonian-${o.value}`} className="text-sm cursor-pointer">{o.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sky-600 mb-3">Examen Bucal</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            {key:'molarRelation',label:'Relación Molar'},{key:'canineRelation',label:'Canina'},
                            {key:'incisalRelation',label:'Incisal'},{key:'overJet',label:'Over Jet (MM)'},
                            {key:'overBite',label:'Over Bite (MM)'},{key:'openBite',label:'Mordida Abierta (MM)'},
                            {key:'midline',label:'Línea Media'},{key:'absentTeeth',label:'Dientes Ausentes'},
                            {key:'malformedTeeth',label:'Malformados'},{key:'teethWithCavities',label:'Con Caries'},
                            {key:'temporaryTeeth',label:'Temporales'},{key:'posteriorCrossbite',label:'Mordida Cruzada Posterior'},
                            {key:'brushingTechnique',label:'Técnica de Cepillado'},{key:'periodontalState',label:'Estado Periodontal'},
                          ].map(({key,label}) => (
                            <div key={key} className="space-y-2">
                              <Label>{label}</Label>
                              <Input value={(newRecord.oralExam as any)?.[key] || ''} onChange={(e) => setNewRecord({...newRecord, oralExam: {...newRecord.oralExam, [key]: e.target.value}})} className="border-sky-200" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sky-600 mb-3">Examen Radiográfico</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            {key:'cephalography',label:'Cefalografía'},{key:'orthoradial',label:'Ortoradial'},
                            {key:'palmar',label:'Palmar'},{key:'occlusal',label:'Oclusal'},
                            {key:'oblique',label:'Oblicua'},{key:'orthopantography',label:'Ortopantografía'},
                            {key:'mesioradial',label:'Mesioradial'},{key:'congenitalAbsence',label:'Ausencia Congénita'},
                            {key:'supernumerary',label:'Supernumerarios'},{key:'cysts',label:'Quistes'},
                            {key:'periapicalLesions',label:'Lesiones Periapicales'},{key:'inclusions',label:'Inclusiones'},
                            {key:'radicularResorption',label:'Resorción Radicular'},{key:'thirdMolars',label:'Terceros Molares'},
                            {key:'dwarfRoots',label:'Raíces Enanas'},{key:'abnormalRoots',label:'Raíces Anormales'},
                          ].map(({key,label}) => (
                            <div key={key} className="space-y-2">
                              <Label>{label}</Label>
                              <Input value={(newRecord.radiographicExam as any)?.[key] || ''} onChange={(e) => setNewRecord({...newRecord, radiographicExam: {...newRecord.radiographicExam, [key]: e.target.value}})} className="border-sky-200" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="plan" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Diagnóstico</Label>
                        <Textarea value={newRecord.planTratamiento?.diagnostico || ''} onChange={(e) => setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, diagnostico: e.target.value}})} rows={3} className="border-sky-200" />
                      </div>

                      <div>
                        <Label className="mb-2 block">Procedimientos</Label>
                        {(newRecord.planTratamiento?.procedimientos || []).map((proc: any, idx: number) => (
                          <div key={idx} className="flex gap-2 mb-2 items-end">
                            <div className="flex-1">
                              <Input placeholder="Descripción" value={proc.descripcion} onChange={(e) => {
                                const procs = [...(newRecord.planTratamiento?.procedimientos || [])];
                                procs[idx] = {...procs[idx], descripcion: e.target.value};
                                const total = procs.reduce((s: number, p: any) => s + (Number(p.costo) || 0), 0);
                                setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, procedimientos: procs, costo_total_estimado: total}});
                              }} className="border-sky-200" />
                            </div>
                            <div className="w-32">
                              <Input type="number" placeholder="Costo" value={proc.costo} onChange={(e) => {
                                const procs = [...(newRecord.planTratamiento?.procedimientos || [])];
                                procs[idx] = {...procs[idx], costo: Number(e.target.value)};
                                const total = procs.reduce((s: number, p: any) => s + (Number(p.costo) || 0), 0);
                                setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, procedimientos: procs, costo_total_estimado: total}});
                              }} className="border-sky-200" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {
                              const procs = (newRecord.planTratamiento?.procedimientos || []).filter((_: any, i: number) => i !== idx);
                              const total = procs.reduce((s: number, p: any) => s + (Number(p.costo) || 0), 0);
                              setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, procedimientos: procs, costo_total_estimado: total}});
                            }}>
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="border-sky-300 text-sky-600" onClick={() => {
                          const procs = [...(newRecord.planTratamiento?.procedimientos || []), {descripcion: '', costo: 0}];
                          setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, procedimientos: procs}});
                        }}>
                          <Plus className="mr-1" size={14} /> Agregar Procedimiento
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Costo Total Estimado</Label>
                          <Input value={`$${newRecord.planTratamiento?.costo_total_estimado || 0}`} disabled className="border-sky-200 bg-sky-50 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label>Estado del Plan</Label>
                          <select className="w-full px-3 py-2 border border-sky-200 rounded-md" value={newRecord.planTratamiento?.estado || 'pendiente'} onChange={(e) => setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, estado: e.target.value}})}>
                            <option value="pendiente">Pendiente</option>
                            <option value="en_progreso">En Progreso</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Notas del Plan</Label>
                        <Textarea value={newRecord.planTratamiento?.notas || ''} onChange={(e) => setNewRecord({...newRecord, planTratamiento: {...newRecord.planTratamiento, notas: e.target.value}})} rows={3} className="border-sky-200" />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button
                    onClick={handleCreateRecord}
                    className="w-full bg-sky-500 hover:bg-sky-600"
                  >
                    Guardar Expediente
                  </Button>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Today's Appointments */}
      <Card className="border-sky-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sky-600">Citas ({filteredAppointments.length})</CardTitle>
              <CardDescription>
                {(() => {
                  const [y, m, d] = selectedDate.split('-');
                  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                })()}
              </CardDescription>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Seleccionar Fecha</Label>
              <input
                type="date"
                className="px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="text-sky-300 mb-4" size={64} />
              <p className="text-gray-600">No tienes citas confirmadas para esta fecha</p>
              <div className="mt-4 text-sm text-gray-500 text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="font-semibold text-yellow-700">DEBUG INFO:</p>
                <p>User ID: <span className="font-mono">{user?.id}</span></p>
                <p>User Role: <span className="font-mono">{user?.role}</span></p>
                <p>Empleado ID: <span className="font-mono">{empleadoId || 'No encontrado'}</span></p>
                <p>Fecha seleccionada: <span className="font-mono">{selectedDate}</span></p>
                <p>Total citas cargadas: <span className="font-mono">{appointments.length}</span></p>
                {errorInfo && (
                  <p className="mt-2 text-red-600">ERROR: {errorInfo}</p>
                )}
                {appointments.length > 0 && (
                  <div className="mt-2">
                    <p>Estados encontrados:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {[...new Set(appointments.map(a => a.estado_cita_id))].sort().map(state => {
                        const count = appointments.filter(a => a.estado_cita_id === state).length;
                        return (
                          <span key={state} className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs">
                            Estado {state}: {count}
                          </span>
                        );
                      })}
                    </div>
                    
                  </div>
                )}
                {confirmedDates.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="font-semibold text-yellow-700">Fechas con citas confirmadas:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {confirmedDates.map(date => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-sky-100">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                        <User className="text-sky-600" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.paciente_nombre}</p>
                        <p className="text-sm text-gray-600">{appointment.servicio_nombre}</p>
                        <p className="text-sm text-sky-600">{appointment.fecha_hora?.split('T')[1]?.slice(0,5)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAttendAppointment(appointment)}
                        className="bg-sky-500 hover:bg-sky-600"
                      >
                        <Stethoscope className="mr-2" size={16} />
                        Atender
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRecord(appointment.paciente_id.toString(), appointment.servicio_id)}
                        className="border-sky-300 text-sky-600 hover:bg-sky-50"
                      >
                        <FileText className="mr-2" size={16} />
                        Ver Expediente
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Expediente Dental - {viewingRecord?.patientName}</DialogTitle>
            <DialogDescription className="sr-only">Vista completa del expediente dental del paciente</DialogDescription>
          </DialogHeader>
          {viewingRecord && (
            <ScrollArea className="h-[80vh] pr-4">
              <PrintableMedicalRecord record={viewingRecord} serviceId={viewingServiceId} />
              <PatientPhotosViewer patientId={parseInt(viewingRecord.patientId)} />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PatientPhotosViewer({ patientId }: { patientId: number }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const consultas = await apiClient.get<any[]>(`/consultations/?paciente_id=${patientId}`, true);
        const allPhotos: any[] = [];
        for (const c of consultas) {
          try {
            const fotos = await apiClient.get<any[]>(`/consultations/${c.id}/photos/`, true);
            allPhotos.push(...(Array.isArray(fotos) ? fotos : []));
          } catch { /* skip */ }
        }
        setPhotos(allPhotos);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [patientId]);

  if (photos.length === 0 && !loading) return null;

  return (
    <Card className="border-sky-200 mt-6">
      <CardHeader className="bg-sky-50">
        <CardTitle className="text-sky-600 text-lg">Fotos del Paciente ({photos.length})</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <p className="text-gray-500">Cargando fotos...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="border border-sky-200 rounded-lg overflow-hidden">
                <img src={photo.url_foto} alt={photo.descripcion || 'Foto'} className="w-full h-36 object-cover" />
                <div className="p-2 text-xs text-gray-600 flex justify-between">
                  <span>{photo.tipo_foto === 'ANTES' ? 'Antes' : photo.tipo_foto === 'DURANTE' ? 'Durante' : 'Después'}</span>
                  {photo.fecha_creacion && <span>{photo.fecha_creacion.split('T')[0]}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}