import { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import { Calendar, Clock, MapPin, FileText, Plus, X, AlertCircle, Mail, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { Label } from '../../../shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../auth/context/AuthContext';
import { useAvailability } from '../../../shared/context/AvailabilityContext';
import { sendAppointmentConfirmations, getConfirmationMessage } from '../../../shared/utils/appointmentNotifications';
import { apiClient, type BackendAppointment, type BackendCatalogItem } from '../../../shared/utils/api';

export function PatientDashboard() {
  const { user, token } = useAuth();
  const { getAvailableTimeSlots, isDayBlocked, isDaySaturated, catalogHorarios, checkDisponibilidad, isLoading: availabilityLoading } = useAvailability();
  
  // Local Appointment type
  interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    serviceId: string;
    serviceName: string;
    workCenterId: string;
    workCenterName: string;
    date: string;
    time: string;
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
    doctorId: string;
    doctorName: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<BackedCatalogItem[]>([]);
  const [workCenters, setWorkCenters] = useState<BackedCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Map backend appointment to frontend format
  const mapAppointment = (backendAppt: BackendAppointment): Appointment => {
    let date = '';
    let time = '';
    
    if (backendAppt.fecha_hora) {
      const raw = backendAppt.fecha_hora;
      const d = typeof raw === 'string' ? new Date(raw) : raw;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      date = `${y}-${m}-${day}`;
      time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } else if (backendAppt.fecha) {
      const [y, m, d] = backendAppt.fecha.split('-').map(Number);
      date = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    
    // Map status
    const statusMap: Record<string, Appointment['status']> = {
      'Programada': 'scheduled',
      'Confirmada': 'confirmed',
      'Cancelada': 'cancelled',
      'Completada': 'completed',
    };

    return {
      id: backendAppt.id.toString(),
      patientId: backendAppt.paciente_id.toString(),
      patientName: backendAppt.paciente_nombre || '',
      serviceId: backendAppt.servicio_id.toString(),
      serviceName: backendAppt.servicio_nombre || '',
      workCenterId: backendAppt.sucursal_id.toString(),
      workCenterName: backendAppt.sucursal_nombre || '',
      date,
      time,
      status: statusMap[backendAppt.estado_nombre || 'Programada'] || 'scheduled',
      doctorId: backendAppt.empleado_id.toString(),
      doctorName: backendAppt.empleado_nombre || '',
    };
  };

  // Fetch data from backend
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch appointments for current patient
        if (user?.id) {
          const appointmentsData = await apiClient.get<BackendAppointment[]>(
            `/appointments?paciente_id=${user.id}`
          );
          if (!cancelled) setAppointments(appointmentsData.map(mapAppointment));
        }

        // Fetch services catalog
        const servicesData = await apiClient.get<BackedCatalogItem[]>('/catalogos/servicios');
        if (!cancelled) setServices(servicesData);

        // Fetch work centers catalog
        const centersData = await apiClient.get<BackedCatalogItem[]>('/catalogos/sucursales');
        if (!cancelled) setWorkCenters(centersData);
      } catch (error) {
        if (!cancelled) toast.error('Error al cargar los datos');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

    // Timeout para evitar que se quede cargando
    const timeout = setTimeout(() => {
      cancelled = true;
      setIsLoading(false);
    }, 10000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [user]);

  const [newAppointment, setNewAppointment] = useState({
    serviceId: '',
    workCenterId: '',
    date: '',
    time: '',
    doctorId: '',
  });

  const [estadosCita, setEstadosCita] = useState<BackedCatalogItem[]>([]);
  const [doctors, setDoctors] = useState<Array<{ id: number; nombre: string }>>([]);
  const [horariosOcupados, setHorariosOcupados] = useState<Set<string>>(new Set());

  const fetchHorariosOcupados = async (date: string, sucursalId: number) => {
    try {
      // First try with specific sucursal
      let response = await apiClient.get<Array<{ id: number; hora: string }>>(
        `/catalogos/horarios?sucursal_id=${sucursalId}`
      );
      
      // If no horarios for this sucursal, get all active horarios
      if (!response || response.length === 0) {
        response = await apiClient.get<Array<{ id: number; hora: string }>>(
          '/catalogos/horarios'
        );
      }
      
      if (!response || response.length === 0) {
        setHorariosOcupados(new Set());
        return;
      }
      
      // Check all horarios for availability
      const occupiedPromises = response.map(async (horario) => {
        try {
          const result = await checkDisponibilidad(date, horario.hora, sucursalId);
          return { hora: horario.hora, ocupado: !result.disponible };
        } catch (e) {
          return { hora: horario.hora, ocupado: false };
        }
      });
      
      const results = await Promise.all(occupiedPromises);
      const ocupados = new Set(
        results.filter(r => r.ocupado).map(r => r.hora)
      );
      setHorariosOcupados(ocupados);
    } catch (error) {
      console.error('Error fetching horarios:', error);
      setHorariosOcupados(new Set());
    }
  };

// Fetch additional data
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const estadosData = await apiClient.get<BackedCatalogItem[]>('/catalogos/estadoscita');
        setEstadosCita(estadosData);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      }
    };
    fetchCatalogs();
  }, []);

  // Cargar horarios ocupados cuando cambia la fecha o sucursal
  useEffect(() => {
    if (newAppointment.date && newAppointment.workCenterId && catalogHorarios.length > 0) {
      fetchHorariosOcupados(newAppointment.date, parseInt(newAppointment.workCenterId));
    } else {
      setHorariosOcupados(new Set());
    }
  }, [newAppointment.date, newAppointment.workCenterId, catalogHorarios]);

  // Get the ID for "Programada" status
  const getProgramadaStatusId = (): number => {
    const programada = estadosCita.find(e => e.nombre === 'Programada');
    return programada?.id || 1; // Default to 1 if not found
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Obtener el nombre de la sucursal seleccionada
  const getSelectedBranchName = () => {
    const workCenter = workCenters.find((w) => w.id.toString() === newAppointment.workCenterId);
    return workCenter?.nombre || '';
  };

  // Filtrar servicios por sucursal seleccionada
  const getAvailableServices = () => {
    if (!newAppointment.workCenterId) return services;
    return services;
  };

  // Obtener horarios disponibles para la fecha y sucursal seleccionadas
  const getAvailableTimeSlotsForSelection = () => {
    if (!newAppointment.date || !newAppointment.workCenterId) return [];
    const branchName = getSelectedBranchName();
    return getAvailableTimeSlots(newAppointment.date, branchName);
  };

  // Verificar si una fecha está disponible
  const isDateAvailable = (dateString: string): boolean => {
    if (isDayBlocked(dateString)) return false;
    if (!newAppointment.workCenterId) return true; // Si no hay sucursal seleccionada, mostrar todas
    const branchName = getSelectedBranchName();
    return !isDaySaturated(dateString, branchName);
  };

  // Obtener el estado visual de un día
  const getDateStatus = (dateString: string): { disabled: boolean; className: string; message: string } => {
    if (isDayBlocked(dateString)) {
      return {
        disabled: true,
        className: 'bg-red-100 text-red-800',
        message: 'Día bloqueado - No disponible',
      };
    }
    if (newAppointment.workCenterId) {
      const branchName = getSelectedBranchName();
      if (isDaySaturated(dateString, branchName)) {
        return {
          disabled: true,
          className: 'bg-orange-100 text-orange-800',
          message: 'Día saturado - Sin horarios disponibles',
        };
      }
    }
    return {
      disabled: false,
      className: '',
      message: '',
    };
  };

  const handleScheduleAppointment = async () => {
    if (!newAppointment.serviceId || !newAppointment.workCenterId || !newAppointment.date || !newAppointment.time) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Validate that the date is not blocked
    if (isDayBlocked(newAppointment.date)) {
      toast.error('Este día no está disponible para citas');
      return;
    }

    // Validate availability using backend
    const disponibilidad = await checkDisponibilidad(
      newAppointment.date,
      newAppointment.time,
      parseInt(newAppointment.workCenterId)
    );
    
    if (!disponibilidad.disponible) {
      toast.error(disponibilidad.mensaje || 'El día y horario seleccionados ya están ocupados');
      return;
    }

    // Validate that the time is available
    const branchName = getSelectedBranchName();
    const availableSlots = getAvailableTimeSlots(newAppointment.date, branchName);
    if (!availableSlots.includes(newAppointment.time)) {
      toast.error('Este horario ya no está disponible');
      return;
    }

    try {
      // Get employee to find associated doctor (using doctor employee ID 1)
      const empleadoId = 1; // Default doctor - Employee ID 1
      
      const estadoCitaId = getProgramadaStatusId();

      const response = await apiClient.post<BackendAppointment>('/appointments', {
        paciente_id: parseInt(user?.id || '0'),
        empleado_id: empleadoId,
        servicio_id: parseInt(newAppointment.serviceId),
        sucursal_id: parseInt(newAppointment.workCenterId),
        estado_cita_id: estadoCitaId,
        fecha_hora: `${newAppointment.date}T${newAppointment.time}:00`,
        duracion_minutos: 30,
      });

      // Add to local state
      const newAppt = mapAppointment(response);
      setAppointments([...appointments, newAppt]);
      
      setNewAppointment({ serviceId: '', workCenterId: '', date: '', time: '', doctorId: '' });
      setHorariosOcupados(new Set());
      setIsDialogOpen(false);
      toast.success('Cita agendada exitosamente');
      
      // Send confirmations (optional - requires phone/email)
      // await sendAppointmentConfirmations({...});
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al agendar la cita');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      // Cambiar estado a cancelada (3) en lugar de eliminar
      await apiClient.put(`/appointments/${id}`, { estado_cita_id: 3 }, true);
      
      // Actualizar estado en local
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        )
      );
      toast.success('Cita cancelada');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cancelar la cita');
    }
  };

  const todayLocal = new Date();
  const todayStr = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== 'cancelled' && apt.date >= todayStr
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'completed' || apt.date < todayStr
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-sky-600">Bienvenido, {user?.name}</h2>
          <p className="text-gray-600">Gestiona tus citas y consulta tu historial</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600">
              <Plus className="mr-2" size={20} />
              Agendar Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sky-600">Agendar Nueva Cita</DialogTitle>
              <DialogDescription>
                Selecciona el servicio, sucursal, fecha y hora
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sucursal">Sucursal</Label>
                <Select
                  name="sucursal"
                  value={newAppointment.workCenterId}
                  onValueChange={(value) => {
                    setNewAppointment({ ...newAppointment, workCenterId: value, serviceId: '', time: '' });
                  }}
                >
                  <SelectTrigger id="sucursal" className="border-sky-200">
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {workCenters.map((center) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicio">Servicio</Label>
                <Select
                  name="servicio"
                  value={newAppointment.serviceId}
                  onValueChange={(value) =>
                    setNewAppointment({ ...newAppointment, serviceId: value })
                  }
                  disabled={!newAppointment.workCenterId}
                >
                  <SelectTrigger id="servicio" className="border-sky-200">
                    <SelectValue placeholder={!newAppointment.workCenterId ? "Primero selecciona una sucursal" : "Seleccionar servicio"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableServices().map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <input
                  id="fecha"
                  name="fecha"
                  type="date"
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, date: e.target.value, time: '' })
                  }
                  min={new Date().toLocaleDateString('en-CA')}
                  disabled={!newAppointment.workCenterId}
                />
                {newAppointment.date && isDayBlocked(newAppointment.date) && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="text-red-600" size={16} />
                    <p className="text-sm text-red-700">
                      Este día está bloqueado y no está disponible para citas
                    </p>
                  </div>
                )}
                {newAppointment.date && !isDayBlocked(newAppointment.date) && newAppointment.workCenterId && isDaySaturated(newAppointment.date, getSelectedBranchName()) && (
                  <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                    <AlertCircle className="text-orange-600" size={16} />
                    <p className="text-sm text-orange-700">
                      Este día está saturado - No hay horarios disponibles
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <Select
                  name="hora"
                  value={newAppointment.time}
                  onValueChange={(value) =>
                    setNewAppointment({ ...newAppointment, time: value })
                  }
                  disabled={!newAppointment.date || !newAppointment.workCenterId}
                >
                  <SelectTrigger id="hora" className="border-sky-200">
                    <SelectValue placeholder={
                      !newAppointment.date 
                        ? "Primero selecciona una fecha" 
                        : !newAppointment.workCenterId
                        ? "Selecciona una sucursal"
                        : getAvailableTimeSlotsForSelection().length === 0
                        ? "No hay horarios disponibles"
                        : "Seleccionar hora"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTimeSlotsForSelection().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getAvailableTimeSlotsForSelection().length > 0 && (
                  <p className="text-xs text-gray-600">
                    {getAvailableTimeSlotsForSelection().length} horarios disponibles
                  </p>
                )}
              </div>

              <Button
                onClick={handleScheduleAppointment}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                Confirmar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="border-sky-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="text-sky-300 mb-4" size={64} />
                <p className="text-gray-600">No tienes citas próximas</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4 bg-sky-500 hover:bg-sky-600"
                >
                  Agendar Cita
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-sky-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sky-600">{appointment.serviceName}</CardTitle>
                      <CardDescription className="mt-2">
                        {appointment.doctorName && `Con ${appointment.doctorName}`}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.status === 'confirmed' ? 'Confirmada' : 'Programada'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="text-sky-500" size={16} />
                      <span>{(() => { const [a,b,c] = appointment.date.split('-').map(Number); return new Date(a,b-1,c).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); })()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="text-sky-500" size={16} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="text-sky-500" size={16} />
                      <span>{appointment.workCenterName}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2" size={16} />
                      Cancelar Cita
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card className="border-sky-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="text-sky-300 mb-4" size={64} />
                <p className="text-gray-600">No tienes historial de citas</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-sky-200 opacity-75">
                <CardHeader>
                  <CardTitle className="text-sky-600">{appointment.serviceName}</CardTitle>
                  <CardDescription>
                    {appointment.doctorName && `Con ${appointment.doctorName}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="text-sky-500" size={16} />
                      <span>{(() => { const [a,b,c] = appointment.date.split('-').map(Number); return new Date(a,b-1,c).toLocaleDateString('es-MX'); })()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="text-sky-500" size={16} />
                      <span>{appointment.workCenterName}</span>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'completed'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}