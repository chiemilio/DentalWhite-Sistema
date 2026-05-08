import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Calendar, FileText, User, Plus, Stethoscope, ClipboardList, FileSignature, X, Edit2, CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import {
  appointments as initialAppointments,
  medicalRecords as initialRecords,
  patients,
  services,
  workCenters,
  type Appointment,
  type MedicalRecord,
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { PatientDiagnosisView } from '../PatientDiagnosisView';
import { PrintableMedicalRecord } from '../PrintableMedicalRecord';
import { ConsentForm } from '../ConsentForm';
import { ClinicalHistoryForm } from '../ClinicalHistoryForm';

export function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointments.filter((apt) => apt.doctorId === user?.id)
  );
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialRecords);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendingAppointment, setAttendingAppointment] = useState<Appointment | null>(null);
  const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false);
  const [isConsentFormOpen, setIsConsentFormOpen] = useState(false);
  
  // Appointment management states
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
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

  const filteredAppointments = appointments.filter(
    (apt) => apt.date === selectedDate && apt.status !== 'cancelled'
  );

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
      createdDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
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

  const handleViewRecord = (patientId: string) => {
    const record = medicalRecords.find((r) => r.patientId === patientId);
    if (record) {
      setViewingRecord(record);
      setIsViewDialogOpen(true);
    } else {
      toast.error('Este paciente no tiene expediente');
    }
  };

  const handleAttendAppointment = (appointment: Appointment) => {
    setAttendingAppointment(appointment);
  };

  const handleBackFromDiagnosis = () => {
    setAttendingAppointment(null);
  };

  // If attending a patient, show diagnosis view
  if (attendingAppointment) {
    const patient = patients.find((p) => p.id === attendingAppointment.patientId);
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
                {new Date(selectedDate).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
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
              <p className="text-gray-600">No tienes citas para esta fecha</p>
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
                        <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                        <p className="text-sm text-sky-600">{appointment.time}</p>
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
                        onClick={() => handleViewRecord(appointment.patientId)}
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