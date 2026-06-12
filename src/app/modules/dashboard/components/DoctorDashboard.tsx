import { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Textarea } from '../../../shared/ui/textarea';
import { Checkbox } from '../../../shared/ui/checkbox';
import { Calendar, FileText, User, Plus, Stethoscope, ClipboardList, FileSignature, X, Edit2, CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { ScrollArea } from '../../../shared/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { toast } from 'sonner';
import { getLocalDateString } from '../../../shared/utils/dateUtils';
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
import { ClinicalHistoryForm } from '../../medical-records/components/ClinicalHistoryForm';

export function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);
  const [patients, setPatients] = useState<BackendPatient[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [empleadoId, setEmpleadoId] = useState<number>(0);
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
  const [errorInfo, setErrorInfo] = useState<string>('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any | null>(null);
  
  // Appointment management states
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<any | null>(null);
  const [attendingAppointment, setAttendingAppointment] = useState<any | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    serviceId: '',
    workCenterId: '',
    date: '',
    time: '',
  });
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
  });

  // Cargar datos desde API
  useEffect(() => {
    if (!user?.id) {
      console.log('DoctorDashboard: No hay usuario');
      return;
    }
    
    console.log('DoctorDashboard: user.id =', user.id, 'role =', user.role);
    
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
        
        const appointmentsData = await apiClient.get<any[]>(`/appointments/?usuario_id=${userId}`, true);
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

  // Filtrar citas: Confirmadas (2) y fecha seleccionada
  const filteredAppointments = appointments.filter(apt => {
    if (apt.estado_cita_id !== 2) return false;
    const aptDate = apt.fecha_hora?.split('T')[0];
    return aptDate === selectedDate;
  });

  // Cargar expedientes clínicos del médico
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const records = await apiClient.get<any[]>('/clinical-history/', true);
        setMedicalRecords(Array.isArray(records) ? records : []);
      } catch (error) {
        // Silently handle error
      }
    };
    loadRecords();
  }, []);

  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
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
  });

  const handleCreateRecord = () => {
    if (!selectedPatientId) {
      toast.error('Selecciona un paciente');
      return;
    }

    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const record: MedicalRecord = {
      id: (medicalRecords.length + 1).toString(),
      patientId: patient.id,
      patientName: patient.name,
      createdDate: getLocalDateString(),
      startDate: getLocalDateString(),
      address: patient.address,
      phone: patient.phone,
      occupation: patient.occupation,
      age: patient.age,
      reference: 'Sistema',
      sex: patient.sex,
      color: 'Normal',
      assignedDoctor: user?.name || '',
      appointmentHistory: [],
      ...newRecord,
    } as MedicalRecord;

    setMedicalRecords([...medicalRecords, record]);
    setIsRecordDialogOpen(false);
    setSelectedPatientId('');
    toast.success('Expediente creado exitosamente');
  };

  const handleViewRecord = async (patientId: string) => {
    try {
      const record = await apiClient.get<any[]>(`/clinical-history/?paciente_id=${patientId}`, true);
      if (record && record.length > 0) {
        setViewingRecord(record[0]);
        setIsViewDialogOpen(true);
      } else {
        toast.error('Este paciente no tiene expediente');
      }
    } catch (error) {
      toast.error('Error al cargar expediente');
    }
  };

  const handleAttendAppointment = async (appointment: BackendAppointment) => {
    try {
      await apiClient.put(`/appointments/${appointment.id}/status`, {
        estado_cita_id: 3 // 3 = en atención
      }, true);
      toast.success('Cita Iniciada');
      setAttendingAppointment(appointment);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al iniciar atención');
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      await apiClient.put(`/appointments/${id}/status`, {
        estado_cita_id: 4 // 4 = cancelada
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

  const handleCreateAppointmentSubmit = async () => {
    if (!newAppointment.patientId || !newAppointment.serviceId || !newAppointment.date || !newAppointment.time) {
      toast.error('Completa todos los campos');
      return;
    }
    try {
      const fecha_hora = `${newAppointment.date}T${newAppointment.time}:00`;
      await apiClient.post('/appointments/', {
        paciente_id: parseInt(newAppointment.patientId),
        empleado_id: empleadoId,
        servicio_id: parseInt(newAppointment.serviceId),
        sucursal_id: 1,
        estado_cita_id: 2,  // Confirmada
        fecha_hora,
        duracion_minutos: 30,
      }, true);
      toast.success('Cita creada');
      setIsCreateAppointmentOpen(false);
      const data = await apiClient.get<BackendAppointment[]>(`/appointments/?empleado_id=${empleadoId}`, true);
      setAppointments(Array.isArray(data) ? data : []);
      setNewAppointment({ patientId: '', serviceId: '', workCenterId: '', date: '', time: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al crear');
    }
  };

  // If attending a patient
  if (attendingAppointment) {
    const patient = patients.find((p) => p.id === attendingAppointment.paciente_id);
    if (patient) {
      return (
        <PatientDiagnosisView
          patient={patient}
          appointment={attendingAppointment}
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
          <Dialog open={isCreateAppointmentOpen} onOpenChange={setIsCreateAppointmentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
                <CalendarPlus className="mr-2" size={20} />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-sky-600">Crear Nueva Cita</DialogTitle>
                <DialogDescription>Selecciona paciente, servicio y horario</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select value={newAppointment.patientId} onValueChange={(v) => setNewAppointment({...newAppointment, patientId: v})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.usuario_nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Servicio</Label>
                  <Select value={newAppointment.serviceId} onValueChange={(v) => setNewAppointment({...newAppointment, serviceId: v})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar servicio" /></SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} />
                  </div>
                </div>
                <Button onClick={handleCreateAppointmentSubmit} className="w-full bg-sky-500 hover:bg-sky-600">Crear Cita</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                    <Label className="text-xs">Seleccionar Paciente</Label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatientId && (() => {
                    const patient = patients.find((p) => p.id === selectedPatientId);
                    
                    if (!patient) return null;
                    
                    return (
                      <div className="space-y-4">
                        <ClinicalHistoryForm
                          patient={patient}
                          doctorName={user?.name || ''}
                        />
                        <Button
                          onClick={() => {
                            toast.success('Historial clínico guardado exitosamente');
                            setIsClinicalHistoryOpen(false);
                            setSelectedPatientId('');
                          }}
                          className="w-full bg-sky-500 hover:bg-sky-600 text-sm"
                        >
                          Guardar e Imprimir Historial Clínico
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
                          {patient.name} - {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatientId && (() => {
                    const patient = patients.find((p) => p.id === selectedPatientId);
                    
                    return (
                      <div className="space-y-4">
                        <ConsentForm
                          patientName={patient?.name || ''}
                          doctorName={user?.name || ''}
                        />
                        <Button
                          onClick={() => {
                            toast.success('Consentimiento registrado exitosamente');
                            setIsConsentFormOpen(false);
                            setSelectedPatientId('');
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
                          {patient.name} - {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="tissues">Tejidos</TabsTrigger>
                      <TabsTrigger value="habits">Hábitos</TabsTrigger>
                      <TabsTrigger value="diseases">Enfermedades</TabsTrigger>
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

                    <TabsContent value="diseases" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries({
                          cardiovascular: 'Cardiovascular',
                          nervousSystem: 'Sistema Nervioso',
                          respiratory: 'Respiratorio',
                          hemorrhagicTendency: 'Propensión Hemorrágica',
                          labTests: 'Pruebas de Laboratorio',
                          renal: 'Renal',
                          diabetes: 'Diabetes',
                          arthritis: 'Artritis',
                          digestive: 'Digestivo',
                          generalState: 'Estado General',
                        }).map(([key, label]) => (
                          <div key={key} className="space-y-2">
                            <Label>{label}</Label>
                            <Input
                              value={
                                newRecord.personalDiseases?.[
                                  key as keyof typeof newRecord.personalDiseases
                                ]
                              }
                              onChange={(e) =>
                                setNewRecord({
                                  ...newRecord,
                                  personalDiseases: {
                                    ...newRecord.personalDiseases!,
                                    [key]: e.target.value,
                                  },
                                })
                              }
                              className="border-sky-200"
                            />
                          </div>
                        ))}
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
                        onClick={() => handleViewRecord(appointment.paciente_id.toString())}
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
              <PrintableMedicalRecord record={viewingRecord} />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}