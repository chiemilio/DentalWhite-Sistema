import { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/button';
import { Label } from '../../../shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { Plus, AlertCircle, User, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { services, workCenters, type Appointment } from '../../../shared/data/mockData';
import { useAvailability } from '../../../shared/context/AvailabilityContext';
import { sendAppointmentConfirmations } from '../../../shared/utils/appointmentNotifications';
import { Input } from '../../../shared/ui/input';
import { Card, CardContent } from '../../../shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import { apiClient, BackendPatient } from '../../../shared/utils/api';

interface NewAppointmentDialogProps {
  onAppointmentCreated: (appointment: Appointment) => void;
  existingAppointments: Appointment[];
}

interface NewPatientData {
  name: string;
  email: string;
  phone: string;
  age: string;
  sex: 'Masculino' | 'Femenino' | '';
}

export function NewAppointmentDialog({ onAppointmentCreated, existingAppointments }: NewAppointmentDialogProps) {
  const { getAvailableTimeSlots, isDayBlocked, isDaySaturated } = useAvailability();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patientType, setPatientType] = useState<'existing' | 'new'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BackendPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatientData, setSelectedPatientData] = useState<BackendPatient | null>(null);
  
  const [newPatientData, setNewPatientData] = useState<NewPatientData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    sex: '',
  });
  
  const [newAppointment, setNewAppointment] = useState({
    serviceId: '',
    workCenterId: '',
    date: '',
    time: '',
    motivo: '',
  });
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employees, setEmployees] = useState<Array<{id: number, nombre: string}>>([]);

  // Search when searchTerm changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchPatients(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load employees when dialog opens
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  
  const loadEmployees = async () => {
    try {
      setEmployeesError(null);
      const data = await apiClient.get<Array<{id: number, usuario_nombre: string, puesto: string, especialidades?: string[]}>>('/employees/?es_doctor=true', true);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setEmployeesError(error.message || 'Error al cargar doctores');
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      loadEmployees();
    }
  }, [isDialogOpen]);

  // Search patients from backend
  const handleSearchPatients = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const data = await apiClient.get<BackendPatient[]>(`/patients/search/?q=${encodeURIComponent(query)}`, true);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load selected patient
  const selectedPatient = selectedPatientData || searchResults.find(p => p.id.toString() === selectedPatientId);

  // Get selected branch name
  const getSelectedBranchName = () => {
    const workCenter = workCenters.find((w) => w.id === newAppointment.workCenterId);
    return workCenter?.name || '';
  };

// Get available services for selected branch - now uses database data
  const [servicesData, setServicesData] = useState<Array<{id: number, nombre: string, sucursal_id?: number}>>([]);
  
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await apiClient.get<Array<{id: number, nombre: string, sucursal_id?: number}>>('/catalogos/servicios/', true);
        setServicesData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading services:', error);
        setServicesData([]);
      }
    };
    loadServices();
  }, []);

  const getAvailableServices = () => {
    if (!newAppointment.workCenterId) return [];
    // Return all services since they are not filtered by sucursal in DB
    return servicesData;
  };

  // Get available time slots
  const getAvailableTimeSlotsForSelection = () => {
    if (!newAppointment.date || !newAppointment.workCenterId) return [];
    const branchName = getSelectedBranchName();
    return getAvailableTimeSlots(newAppointment.date, branchName);
  };

  const validateNewPatient = () => {
    if (!newPatientData.name.trim()) {
      toast.error('El nombre del paciente es obligatorio');
      return false;
    }
    if (!newPatientData.phone.trim()) {
      toast.error('El teléfono del paciente es obligatorio');
      return false;
    }
    if (!newPatientData.email.trim()) {
      toast.error('El email del paciente es obligatorio');
      return false;
    }
    if (!newPatientData.email.includes('@')) {
      toast.error('El email no es válido');
      return false;
    }
    return true;
  };

  const handleScheduleAppointment = async () => {
    // Validar según el tipo de paciente
    if (patientType === 'existing' && !selectedPatientId) {
      toast.error('Por favor selecciona un paciente');
      return;
    }

    if (patientType === 'new' && !validateNewPatient()) {
      return;
    }
    
    if (!selectedEmployeeId) {
      toast.error('Por favor selecciona un doctor');
      return;
    }
    
    if (!newAppointment.serviceId || !newAppointment.workCenterId || !newAppointment.date || !newAppointment.time) {
      toast.error('Por favor completa todos los campos de la cita');
      return;
    }

    // Validar que la fecha no esté bloqueada
    if (isDayBlocked(newAppointment.date)) {
      toast.error('Este día no está disponible para citas');
      return;
    }

    // Validar que el horario esté disponible
    const branchName = getSelectedBranchName();
    const availableSlots = getAvailableTimeSlots(newAppointment.date, branchName);
    if (!availableSlots.includes(newAppointment.time)) {
      toast.error('Este horario ya no está disponible');
      return;
    }

    const service = services.find((s) => s.id === newAppointment.serviceId);
    const workCenter = workCenters.find((w) => w.id === newAppointment.workCenterId);

    let patientName = '';
    let patientEmail = '';
    let patientPhone = '';
    let patientId = 0;

    if (patientType === 'existing') {
      if (!selectedPatient) {
        toast.error('Paciente no encontrado');
        return;
      }
      patientName = selectedPatient.usuario_nombre || '';
      patientEmail = selectedPatient.usuario_email || '';
      patientPhone = selectedPatient.usuario_telefono || '';
      patientId = selectedPatient.id;
    } else {
      // Paciente nuevo - usar endpoint simplificado
      
      const newPatientDataCombined = {
        email: newPatientData.email,
        password: 'TempPass123!',
        nombre: newPatientData.name.split(' ')[0] || newPatientData.name,
        apellido_paterno: newPatientData.name.split(' ').slice(1).join(' ') || '',
        telefono: newPatientData.phone,
        empleado_id: parseInt(selectedEmployeeId),
        servicio_id: parseInt(newAppointment.serviceId),
        sucursal_id: parseInt(newAppointment.workCenterId),
        fecha_hora: `${newAppointment.date}T${newAppointment.time}:00`,
        duracion_minutos: 30,
        motivo_consulta: newAppointment.motivo || '',
      };
      
      const response = await apiClient.post<any>('/appointments/register-and-appointment', newPatientDataCombined, true);
      
      if (response && response.id) {
        toast.success('Paciente registrado y cita agendada');
        patientName = newPatientData.name;
        patientEmail = newPatientData.email;
        patientPhone = newPatientData.phone;
        
        if (onAppointmentCreated) {
          const newAppointmentData: Appointment = {
            id: response.id.toString(),
            patientId: response.paciente_id?.toString() || '0',
            patientName: patientName,
            serviceId: newAppointment.serviceId,
            serviceName: service?.name || '',
            workCenterId: newAppointment.workCenterId,
            workCenterName: workCenter?.name || '',
            date: newAppointment.date,
            time: newAppointment.time,
            status: 'scheduled',
          };
          onAppointmentCreated(newAppointmentData);
        }
        
        setIsDialogOpen(false);
        return;
      }
    }
    
    // Crear la cita
    try {
      const appointmentData = {
        paciente_id: patientId,
        empleado_id: parseInt(selectedEmployeeId),
        servicio_id: parseInt(newAppointment.serviceId),
        sucursal_id: parseInt(newAppointment.workCenterId),
        estado_cita_id: 1,
        fecha_hora: `${newAppointment.date}T${newAppointment.time}:00`,
        duracion_minutos: 30,
      };

      const response = await apiClient.post<any>('/appointments/', appointmentData, true);
      
      toast.success('Cita agendada exitosamente');
      
      // Enviar confirmaciones por correo y WhatsApp
      await sendAppointmentConfirmations({
        patientName: patientName,
        patientEmail: patientEmail,
        patientPhone: patientPhone,
        serviceName: service?.name || '',
        date: newAppointment.date,
        time: newAppointment.time,
        workCenterName: workCenter?.name || '',
        workCenterAddress: workCenter?.address || '',
      });

      // Llamar al callback con la cita creada
      if (onAppointmentCreated && response) {
        const newAppointmentData: Appointment = {
          id: response.id?.toString() || Date.now().toString(),
          patientId: patientId.toString(),
          patientName: patientName,
          serviceId: newAppointment.serviceId,
          serviceName: service?.name || '',
          workCenterId: newAppointment.workCenterId,
          workCenterName: workCenter?.name || '',
          date: newAppointment.date,
          time: newAppointment.time,
          status: 'scheduled',
        };
        onAppointmentCreated(newAppointmentData);
      }
    } catch (error: any) {
      toast.error(`Error al agendar cita: ${error.message}`);
      return;
    }

    // Reset form
    setNewAppointment({ serviceId: '', workCenterId: '', date: '', time: '', motivo: '' });
    setSelectedPatientId('');
    setSelectedPatientData(null);
    setSearchTerm('');
    setNewPatientData({ name: '', email: '', phone: '', age: '', sex: '' });
    setPatientType('existing');
    setSelectedEmployeeId('');
    setIsDialogOpen(false);
  };

  const isFormValid = () => {
    const appointmentValid = newAppointment.serviceId && newAppointment.workCenterId && newAppointment.date && newAppointment.time;
    
    if (patientType === 'existing') {
      return appointmentValid && selectedPatientId;
    } else {
      return appointmentValid && newPatientData.name && newPatientData.email && newPatientData.phone;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-500 hover:bg-sky-600">
          <Plus className="mr-2" size={20} />
          Agendar Cita para Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sky-600">Agendar Nueva Cita</DialogTitle>
          <DialogDescription>
            Registra un paciente nuevo o busca uno existente. Se enviará confirmación por correo y WhatsApp.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Tabs para seleccionar tipo de paciente */}
          <Tabs value={patientType} onValueChange={(value) => setPatientType(value as 'existing' | 'new')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing" className="flex items-center gap-2">
                <Search size={16} />
                Paciente Existente
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-2">
                <UserPlus size={16} />
                Paciente Nuevo
              </TabsTrigger>
            </TabsList>

            {/* Paciente Existente */}
            <TabsContent value="existing" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label htmlFor="search-patient">Buscar Paciente *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="search-patient"
                    name="search-patient"
                    placeholder="Buscar por nombre, teléfono o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                    className="pl-10 border-sky-200 focus:border-sky-500"
                  />
                </div>
                
                {searchTerm && (
                  <div className="max-h-48 overflow-y-auto space-y-2 border border-sky-200 rounded-md p-2">
                    {searchResults.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-2">No se encontraron pacientes</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPatientType('new');
                            setSearchTerm('');
                          }}
                          className="border-sky-300 text-sky-600"
                        >
                          <UserPlus className="mr-2" size={16} />
                          Registrar como Paciente Nuevo
                        </Button>
                      </div>
                    ) : (
                      searchResults.map((patient) => (
                        <Card
                          key={patient.id}
                          className={`cursor-pointer transition-all ${
                            selectedPatientId === patient.id
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-sky-100 hover:border-sky-300'
                          }`}
                          onClick={() => {
                            setSelectedPatientId(patient.id.toString());
                            setSelectedPatientData(patient);
                            setSearchTerm('');
                          }}
                        >
                          <CardContent className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                              <User className="text-sky-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{patient.usuario_nombre}</p>
                              <p className="text-sm text-gray-600">{patient.usuario_telefono} • {patient.usuario_email}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {selectedPatient && !searchTerm && (
                  <Card className="border-sky-500 bg-sky-50">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
                          <User className="text-sky-700" size={20} />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{selectedPatient.name}</p>
                          <p className="text-sm text-gray-600">{selectedPatient.phone} • {selectedPatient.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPatientId('')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cambiar
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Paciente Nuevo */}
            <TabsContent value="new" className="space-y-4 mt-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <UserPlus className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-green-800">Registro de Paciente Nuevo</p>
                    <p className="text-xs text-green-700 mt-1">
                      Complete los datos del paciente. Después de agendar la cita, se enviará confirmación automática.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-patient-name">Nombre Completo *</Label>
                  <Input
                    id="new-patient-name"
                    name="name"
                    placeholder="Ej: Juan Pérez García"
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    autoComplete="name"
                    className="border-sky-200 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-patient-phone">Teléfono *</Label>
                  <Input
                    id="new-patient-phone"
                    name="phone"
                    placeholder="Ej: 4611234567"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    autoComplete="tel"
                    className="border-sky-200 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="new-patient-email">Correo Electrónico *</Label>
                  <Input
                    id="new-patient-email"
                    name="email"
                    type="email"
                    placeholder="Ej: juan.perez@example.com"
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                    autoComplete="email"
                    className="border-sky-200 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-patient-age">Edad (Opcional)</Label>
                  <Input
                    id="new-patient-age"
                    name="age"
                    type="number"
                    placeholder="Ej: 30"
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                    autoComplete="off"
                    className="border-sky-200 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-patient-sex">Sexo (Opcional)</Label>
                  <Select
                    name="sex"
                    value={newPatientData.sex}
                    onValueChange={(value) => setNewPatientData({ ...newPatientData, sex: value as 'Masculino' | 'Femenino' })}
                  >
                    <SelectTrigger id="new-patient-sex" className="border-sky-200">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
</TabsContent>
          </Tabs>
          
          {/* Solo mostrar campos de cita para paciente existente */}
          {patientType === 'existing' && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <div>
              <Label>Sucursal</Label>
              <Select
                value={newAppointment.workCenterId}
                onValueChange={(value) => setNewAppointment({ ...newAppointment, workCenterId: value, serviceId: '', time: '' })}
              >
                <SelectTrigger><SelectValue placeholder="Sucursal" /></SelectTrigger>
                <SelectContent>
                  {workCenters.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Servicio</Label>
              <Select
                value={newAppointment.serviceId}
                onValueChange={(v) => setNewAppointment({ ...newAppointment, serviceId: v })}
                disabled={!newAppointment.workCenterId}
              >
                <SelectTrigger><SelectValue placeholder="Servicio" /></SelectTrigger>
                <SelectContent>
                  {getAvailableServices().map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha</Label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value, time: '' })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label>Hora</Label>
              <Select
                value={newAppointment.time}
                onValueChange={(v) => setNewAppointment({ ...newAppointment, time: v })}
                disabled={!newAppointment.date}
              >
                <SelectTrigger><SelectValue placeholder="Hora" /></SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlotsForSelection().map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Doctor</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger><SelectValue placeholder="Doctor" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.usuario_nombre || 'Doctor'}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Motivo</Label>
              <Input
                placeholder="Motivo"
                value={newAppointment.motivo}
                onChange={(e) => setNewAppointment({ ...newAppointment, motivo: e.target.value })}
              />
            </div>
          </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNewAppointment({ serviceId: '', workCenterId: '', date: '', time: '', motivo: '' });
                setSelectedPatientId('');
                setSearchTerm('');
                setNewPatientData({ name: '', email: '', phone: '', age: '', sex: '' });
                setPatientType('existing');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleScheduleAppointment}
              className="bg-sky-500 hover:bg-sky-600"
              disabled={!isFormValid()}
            >
              {patientType === 'new' ? 'Registrar Paciente y Agendar Cita' : 'Confirmar y Enviar Notificaciones'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}