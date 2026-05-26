import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/table';
import { Calendar, Search, CheckCircle, XCircle, Clock, User, DollarSign, Edit, Plus, AlertCircle, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';
import { workCenters, type Appointment } from '../../../shared/data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../../shared/ui/radio-group';
import { useAvailability } from '../../../shared/context/AvailabilityContext';
import { sendAppointmentConfirmations } from '../../../shared/utils/appointmentNotifications';

import { apiClient, type BackendAppointment, type BackendPatient } from '../../../shared/utils/api';

export function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedWorkCenter, setSelectedWorkCenter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BackendPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<BackendPatient | null>(null);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    servicePrice: 0,
    amountPaid: 0,
    paymentType: 'complete' as 'complete' | 'installment',
    numberOfPayments: 1,
    currentPayment: 1,
  });

  // Backend appointments state
  const [isLoading, setIsLoading] = useState(false);
  const [backendAppointments, setBackendAppointments] = useState<BackendAppointment[]>([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState<any[]>([]);

  // New appointment dialog state
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointmentData, setNewAppointmentData] = useState({
    patientId: '',
    serviceId: '',
    date: '',
    time: '',
    employeeId: '',
    notes: '',
  });
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [newAppointmentSearch, setNewAppointmentSearch] = useState('');
  const [availableBranches, setAvailableBranches] = useState<any[]>([]);

  // Patient registration dialog state
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
  });

  // Load employees, services, patients, estados and branches
  useEffect(() => {
    const loadData = async () => {
      try {
        const [employees, services, patients, estados, branches] = await Promise.all([
          apiClient.get<any[]>('/employees/', true),
          apiClient.get<any[]>('/catalogos/servicios', true),
          apiClient.get<any[]>('/patients/', true),
          apiClient.get<any[]>('/catalogos/estados-cita', true),
          apiClient.get<any[]>('/catalogos/sucursales', true),
        ]);
        setAvailableEmployees(employees || []);
        setAvailableServices(services || []);
        setAllPatients(patients || []);
        setAppointmentStatuses(estados || []);
        setAvailableBranches(branches || []);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    };
    loadData();
  }, []);

  const handleSearchPatients = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const data = await apiClient.get<BackendPatient[]>(`/patients/search/?q=${encodeURIComponent(query)}`, true);
      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Helper function to map backend appointment to frontend format
  const mapAppointment = (backendApt: BackendAppointment): Appointment => {
    const [datePart, timePart] = (backendApt.fecha_hora || '').split('T');
    return {
      id: backendApt.id.toString(),
      patientId: backendApt.paciente_id.toString(),
      patientName: backendApt.paciente_nombre || 'Sin nombre',
      serviceId: backendApt.servicio_id.toString(),
      serviceName: backendApt.servicio_nombre || 'Sin servicio',
      workCenterId: backendApt.sucursal_id.toString(),
      workCenterName: backendApt.sucursal_nombre || 'Sin sucursal',
      date: datePart || '',
      time: timePart ? timePart.slice(0, 5) : '',
      status: backendApt.estado_cita_id === 1 ? 'scheduled' as const :
             backendApt.estado_cita_id === 2 ? 'confirmed' as const :
             backendApt.estado_cita_id === 3 ? 'cancelled' as const :
             backendApt.estado_cita_id === 4 ? 'completed' as const :
             backendApt.estado_cita_id === 5 ? 'paid_partial' as const :
             backendApt.estado_cita_id === 6 ? 'paid_full' as const : 'scheduled' as const,
      estadoNombre: backendApt.estado_nombre || 'Sin estado',
    };
  };

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        const params = new URLSearchParams();
        // Use selected branch filter
        if (selectedWorkCenter !== 'all') {
          params.append('sucursal_id', selectedWorkCenter);
        }
        if (selectedDate) {
          params.append('fecha_inicio', `${selectedDate}T00:00:00`);
          params.append('fecha_fin', `${selectedDate}T23:59:59`);
        }
        
        const data = await apiClient.get<BackendAppointment[]>(`/appointments?${params.toString()}`, true);
        setBackendAppointments(Array.isArray(data) ? data : []);
        setAppointments(Array.isArray(data) ? data.map(mapAppointment) : []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al cargar citas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [selectedDate]);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === selectedDate;
    const matchesWorkCenter = selectedWorkCenter === 'all' || apt.workCenterId === selectedWorkCenter;
    return matchesDate && matchesWorkCenter;
  });

  const handleConfirmAppointment = async (id: string) => {
    try {
      const data = await apiClient.put<BackendAppointment>(`/appointments/${id}/`, {
        estado_cita_id: 2  // 2 = Confirmada
      }, true);
      
      // Update local state with the response from server
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'confirmed' as const } : apt
        )
      );
      // Also update backend appointments
      setBackendAppointments(
        backendAppointments.map((apt) =>
          apt.id.toString() === id ? { ...apt, estado_cita_id: 2, estado_nombre: 'Confirmada' } : apt
        )
      );
      toast.success('Cita confirmada');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al confirmar cita');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await apiClient.put<BackendAppointment>(`/appointments/${id}/`, {
        estado_cita_id: 3  // 3 = Cancelada
      }, true);
      
      // Update local state
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        )
      );
      // Also update backend appointments
      setBackendAppointments(
        backendAppointments.map((apt) =>
          apt.id.toString() === id ? { ...apt, estado_cita_id: 3, estado_nombre: 'Cancelada' } : apt
        )
      );
      toast.success('Cita cancelada');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cancelar cita');
    }
  };

  const handleViewPatient = (patient: BackendPatient) => {
    setSelectedPatient(patient as any);
    setIsPatientDialogOpen(true);
  };

  const handleOpenPaymentDialog = async (appointment: any) => {
    const appointmentId = appointment.id;
    
    // Try to fetch existing payment from backend
    let existingPayment = null;
    try {
      existingPayment = await apiClient.get<any>(`/payments/cita/${appointmentId}`, true);
    } catch (e) {
      // No payment exists yet
    }

    setSelectedAppointment(appointment);
    setPaymentData({
      servicePrice: existingPayment?.monto_total || appointment.servicePrice || 0,
      amountPaid: existingPayment?.monto_pagado || appointment.amountPaid || 0,
      paymentType: existingPayment?.estado === 'PAGADO' ? 'complete' : 
                  (existingPayment?.monto_restante > 0 && existingPayment?.monto_restante < existingPayment?.monto_total) ? 'installment' : 'complete',
      numberOfPayments: appointment.numberOfPayments || 2,
      currentPayment: appointment.currentPayment || 1,
    });
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentChange = (key: keyof typeof paymentData, value: any) => {
    setPaymentData({
      ...paymentData,
      [key]: value,
    });
  };

  const handleSavePayment = async () => {
    if (selectedAppointment) {
      try {
        const token = localStorage.getItem('dental_white_token');
        if (!token) {
          toast.error('No autenticado');
          return;
        }

        const citaId = selectedAppointment.id; // string
        const pacienteId = parseInt(selectedAppointment.patientId); // convertir a int
        const montoAPagar = paymentData.amountPaid;

        // Verificar si existe payment para esta cita
        let paymentId: number | null = null;
        const existingPayment = await apiClient.get<any>(`/payments/cita/${citaId}`, true);
        if (existingPayment) {
          paymentId = existingPayment.id;
        }

        if (paymentId) {
          // Actualizar payment existente
          await apiClient.put<any>(`/payments/${paymentId}`, {
            monto_total: paymentData.servicePrice,
            monto_pagado: montoAPagar,
            metodo_pago: paymentData.paymentType === 'complete' ? 'EFECTIVO' : 'PARCIAL'
          }, true);
        } else {
          // Crear nuevo payment
          await apiClient.post<any>('/payments/', {
            cita_id: parseInt(citaId), // convertir a int
            paciente_id: pacienteId, // ya es int
            monto_total: paymentData.servicePrice,
            monto_pagado: montoAPagar,
            metodo_pago: paymentData.paymentType === 'complete' ? 'EFECTIVO' : 'PARCIAL'
          }, true);
        }

        // Auto-update appointment status based on payment
        if (paymentData.servicePrice > 0 && montoAPagar >= paymentData.servicePrice) {
          // Pago completo -> estado 6 (Pagado Completo)
          await apiClient.put<any>(`/appointments/${citaId}/`, {
            estado_cita_id: 6
          }, true);

          setAppointments(
            appointments.map((apt) =>
              apt.id === citaId ? { ...apt, status: 'paid_full' as const, estadoNombre: 'Pagado Completo' } : apt
            )
          );
          setBackendAppointments(
            backendAppointments.map((apt) =>
              apt.id.toString() === citaId ? { ...apt, estado_cita_id: 6, estado_nombre: 'Pagado Completo' } : apt
            )
          );
          toast.success('Pago completo registrado. Cita marcada como Pagado Completo.');
        } else if (montoAPagar > 0) {
          // Pago parcial -> estado 5 (Pagado Parcial)
          await apiClient.put<any>(`/appointments/${citaId}/`, {
            estado_cita_id: 5
          }, true);

          setAppointments(
            appointments.map((apt) =>
              apt.id === citaId ? { ...apt, status: 'paid_partial' as const, estadoNombre: 'Pagado Parcial' } : apt
            )
          );
          setBackendAppointments(
            backendAppointments.map((apt) =>
              apt.id.toString() === citaId ? { ...apt, estado_cita_id: 5, estado_nombre: 'Pagado Parcial' } : apt
            )
          );
          toast.success('Pago parcial registrado.');
        } else {
          toast.success('Pago registrado correctamente');
        }
      } catch (error) {
        console.error('Error saving payment:', error);
        toast.error('Error al registrar pago');
      }
      setIsPaymentDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl text-sky-600">Panel de Recepción</h2>
        <p className="text-gray-600">Gestión de citas y atención a pacientes</p>
      </div>

      {/* Filters */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-600">Filtros de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select value={selectedWorkCenter} onValueChange={setSelectedWorkCenter}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button onClick={() => setIsNewAppointmentOpen(true)} className="bg-sky-500 hover:bg-sky-600">
          <CalendarPlus className="mr-2" size={20} />
          Nueva Cita
        </Button>
        <Button variant="outline" onClick={() => setIsNewPatientOpen(true)} className="border-sky-300 text-sky-600 hover:bg-sky-50">
          <Plus className="mr-2" size={20} />
          Registrar Paciente
        </Button>
      </div>

      {/* Appointments Table */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-600">
            Citas del Día ({filteredAppointments.length})
          </CardTitle>
          <CardDescription>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="text-sky-300 mb-4" size={64} />
              <p className="text-gray-600">No hay citas para esta fecha</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="text-sky-500" size={16} />
                          {appointment.time}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.serviceName}</TableCell>
                      <TableCell>{appointment.doctorName || 'Sin asignar'}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : appointment.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : appointment.status === 'paid_partial'
                              ? 'bg-orange-100 text-orange-700'
                              : appointment.status === 'paid_full'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {appointment.estadoNombre || 
                            (appointment.status === 'confirmed' ? 'Confirmada' :
                             appointment.status === 'cancelled' ? 'Cancelada' :
                             appointment.status === 'completed' ? 'Completada' :
                             appointment.status === 'paid_partial' ? 'Pagado Parcial' :
                             appointment.status === 'paid_full' ? 'Pagado Completo' : 'Programada')}
                        </div>
                      </TableCell>
                      <TableCell>
                          <div className="flex gap-2">
                            {appointment.status === 'scheduled' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                  title="Confirmar"
                                >
                                  <CheckCircle size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                  title="Cancelar"
                                >
                                  <XCircle size={16} />
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenPaymentDialog(appointment)}
                                className="border-sky-300 text-sky-600 hover:bg-sky-50"
                                title="Pago"
                              >
                                <DollarSign size={16} />
                              </Button>
                            )}
                            {appointment.status === 'completed' && (
                              <CheckCircle className="text-green-500" size={16} />
                            )}
                            {appointment.status === 'paid_partial' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenPaymentDialog(appointment)}
                                className="border-green-300 text-green-600 hover:bg-green-50"
                                title="Completar Pago"
                              >
                                <DollarSign size={16} />
                              </Button>
                            )}
                            {appointment.status === 'cancelled' && (
                              <XCircle className="text-gray-400" size={16} />
                            )}
                          </div>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Patient Search */}
        <Card className="border-sky-200">
          <CardHeader>
            <CardTitle className="text-sky-600">Búsqueda de Pacientes</CardTitle>
            <CardDescription>Buscar por nombre o teléfono</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-sky-200"
              />
              <Button onClick={async () => {
                if (searchTerm.length < 2) {
                  toast.warning('Ingresa al menos 2 caracteres');
                  return;
                }
                try {
                  setIsSearching(true);
                  const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
                  console.log('[Search] VITE_API_URL:', apiUrl);
                  console.log('[Search] Calling:', `/patients/search/?q=${encodeURIComponent(searchTerm)}`);
                  const data = await apiClient.get<BackendPatient[]>(`/patients/search/?q=${encodeURIComponent(searchTerm)}`, true);
                  console.log('[Search] Response:', data);
                  const results = Array.isArray(data) ? data : [];
                  if (results.length === 0) {
                    toast.info('No se encontraron pacientes');
                  } else {
                    toast.success(`Encontrados: ${results.length} pacientes`);
                  }
                  setSearchResults(results);
                } catch(error) {
                  console.error('[Search] Error:', error);
                  const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
                  toast.error(`Error al buscar pacientes (API: ${apiUrl})`);
                  setSearchResults([]);
                } finally {
                  setIsSearching(false);
                }
              }}>Buscar</Button>
            </div>
           
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map(p => (
                  <div key={p.id} className="p-2 border rounded">
                    <p className="font-bold">{p.usuario_nombre || 'Sin nombre'}</p>
                    <p className="text-sm">Exp: {p.numero_expediente}</p>
                    <p className="text-sm">Tel: {p.usuario_telefono || 'Sin teléfono'}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Información del Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Nombre</Label>
                  <p className="text-gray-900">{selectedPatient.usuario_nombre}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="text-gray-900">{selectedPatient.usuario_email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Teléfono</Label>
                  <p className="text-gray-900">{selectedPatient.usuario_telefono || 'No registrado'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Número de Expediente</Label>
                  <p className="text-gray-900">{selectedPatient.numero_expediente}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Género</Label>
                  <p className="text-gray-900">{selectedPatient.genero}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Fecha de Nacimiento</Label>
                  <p className="text-gray-900">{selectedPatient.fecha_nacimiento}</p>
                </div>
                {selectedPatient.ciudad && (
                  <div className="md:col-span-2">
                    <Label className="text-gray-600">Ubicación</Label>
                    <p className="text-gray-900">
                      {selectedPatient.ciudad}, {selectedPatient.estado} {selectedPatient.codigo_postal}
                    </p>
                  </div>
                )}
                {selectedPatient.nombre_tutor && (
                  <div>
                    <Label className="text-gray-600">Tutor</Label>
                    <p className="text-gray-900">{selectedPatient.nombre_tutor}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Información de Pago</DialogTitle>
            <DialogDescription>
              Registra el precio del servicio y el pago realizado
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Patient and Service Info */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-sky-50 rounded-lg">
                <div>
                  <Label className="text-gray-600 text-sm">Paciente</Label>
                  <p className="text-gray-900">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Servicio</Label>
                  <p className="text-gray-900">{selectedAppointment.serviceName}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Fecha</Label>
                  <p className="text-gray-900">
                    {new Date(selectedAppointment.date).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Hora</Label>
                  <p className="text-gray-900">{selectedAppointment.time}</p>
                </div>
              </div>

              {/* Payment Fields */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="servicePrice">Precio del Servicio *</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      step="0.01"
                      value={paymentData.servicePrice}
                      onChange={(e) => handlePaymentChange('servicePrice', parseFloat(e.target.value) || 0)}
                      className="border-sky-200 focus:border-sky-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountPaid">Monto Pagado / A Cta *</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      step="0.01"
                      value={paymentData.amountPaid}
                      onChange={(e) => handlePaymentChange('amountPaid', parseFloat(e.target.value) || 0)}
                      className="border-sky-200 focus:border-sky-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Pago</Label>
                  <RadioGroup
                    value={paymentData.paymentType}
                    onValueChange={(value) => handlePaymentChange('paymentType', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complete" id="complete" />
                      <Label htmlFor="complete" className="cursor-pointer">Pago Completo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="installment" id="installment" />
                      <Label htmlFor="installment" className="cursor-pointer">Pago en Cuotas (A Cta)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentData.paymentType === 'installment' && (
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfPayments">Número Total de Pagos</Label>
                      <Input
                        id="numberOfPayments"
                        type="number"
                        min="2"
                        value={paymentData.numberOfPayments}
                        onChange={(e) => handlePaymentChange('numberOfPayments', parseInt(e.target.value) || 1)}
                        className="border-yellow-300 focus:border-yellow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPayment">Pago Actual (Número)</Label>
                      <Input
                        id="currentPayment"
                        type="number"
                        min="1"
                        max={paymentData.numberOfPayments}
                        value={paymentData.currentPayment}
                        onChange={(e) => handlePaymentChange('currentPayment', parseInt(e.target.value) || 1)}
                        className="border-yellow-300 focus:border-yellow-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">
                        <strong>Pendiente:</strong> ${(paymentData.servicePrice - paymentData.amountPaid).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Pagando cuota {paymentData.currentPayment} de {paymentData.numberOfPayments}
                      </p>
                    </div>
                  </div>
                )}

                {paymentData.paymentType === 'complete' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Pago completo de ${paymentData.servicePrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSavePayment}
                  className="bg-sky-500 hover:bg-sky-600"
                >
                  Guardar Información de Pago
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Agendar Nueva Cita</DialogTitle>
            <DialogDescription>Selecciona paciente, servicio y horario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <div className="relative">
                <Input
                  placeholder="Buscar paciente..."
                  value={newAppointmentSearch}
                  onChange={(e) => setNewAppointmentSearch(e.target.value)}
                  className="border-sky-200"
                />
                {newAppointmentSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-sky-200 rounded-md shadow-lg max-h-48 overflow-auto">
                    {allPatients
                      .filter(p => 
                        ((p.usuario_nombre || '').toLowerCase().includes(newAppointmentSearch.toLowerCase())) ||
                        ((p.usuario_email || '').toLowerCase().includes(newAppointmentSearch.toLowerCase())) ||
                        ((p.usuario_telefono || '').includes(newAppointmentSearch))
                      )
                      .map((p) => (
                        <div
                          key={p.id}
                          className="px-3 py-2 cursor-pointer hover:bg-sky-50"
                          onClick={() => {
                            setNewAppointmentData({...newAppointmentData, patientId: p.id.toString()});
                            setNewAppointmentSearch(p.usuario_nombre || '');
                          }}
                        >
                          {p.usuario_nombre} {p.usuario_telefono ? `- ${p.usuario_telefono}` : ''}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {newAppointmentData.patientId && (
                <p className="text-sm text-green-600">Paciente seleccionado</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select value={newAppointmentData.serviceId} onValueChange={(v) => setNewAppointmentData({...newAppointmentData, serviceId: v})}>
                <SelectTrigger className="border-sky-200"><SelectValue placeholder="Seleccionar servicio" /></SelectTrigger>
                <SelectContent>
                  {availableServices.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select value={newAppointmentData.employeeId} onValueChange={(v) => setNewAppointmentData({...newAppointmentData, employeeId: v})}>
                <SelectTrigger className="border-sky-200"><SelectValue placeholder="Seleccionar doctor" /></SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>{e.usuario_nombre || e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="date" value={newAppointmentData.date} onChange={(e) => setNewAppointmentData({...newAppointmentData, date: e.target.value})} className="border-sky-200" />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Select value={newAppointmentData.time} onValueChange={(v) => setNewAppointmentData({...newAppointmentData, time: v})}>
                  <SelectTrigger className="border-sky-200"><SelectValue placeholder="Seleccionar hora" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="12:30">12:30</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="13:30">13:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="16:30">16:30</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="17:30">17:30</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="18:30">18:30</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                    <SelectItem value="19:30">19:30</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (!newAppointmentData.patientId || !newAppointmentData.serviceId || !newAppointmentData.employeeId || !newAppointmentData.date || !newAppointmentData.time) {
                  toast.error('Completa todos los campos');
                  return;
                }
                try {
                  const fecha_hora = `${newAppointmentData.date}T${newAppointmentData.time}:00`;
                  await apiClient.post('/appointments/', {
                    paciente_id: parseInt(newAppointmentData.patientId),
                    servicio_id: parseInt(newAppointmentData.serviceId),
                    empleado_id: parseInt(newAppointmentData.employeeId),
                    sucursal_id: 2,
                    fecha_hora,
                    estado_cita_id: 1,
                    duracion_minutos: 30,
                    notas: newAppointmentData.notes,
                  }, true);
                  toast.success('Cita creada correctamente');
                  setIsNewAppointmentOpen(false);
                  setNewAppointmentData({ patientId: '', serviceId: '', date: '', time: '', employeeId: '', notes: '' });
                  const params = new URLSearchParams();
                  params.append('sucursal_id', '2');
                  if (selectedDate) {
                    params.append('fecha_inicio', `${selectedDate}T00:00:00`);
                    params.append('fecha_fin', `${selectedDate}T23:59:59`);
                  }
                  const data = await apiClient.get<BackendAppointment[]>(`/appointments?${params.toString()}`, true);
                  setBackendAppointments(Array.isArray(data) ? data : []);
                  setAppointments(Array.isArray(data) ? data.map(mapAppointment) : []);
                } catch (e) {
                  toast.error('Error al crear cita');
                }
              }} className="bg-sky-500 hover:bg-sky-600">Crear Cita</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Patient Dialog */}
      <Dialog open={isNewPatientOpen} onOpenChange={setIsNewPatientOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Registrar Nuevo Paciente</DialogTitle>
            <DialogDescription>Completa los datos del paciente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={newPatientData.nombre} onChange={(e) => setNewPatientData({...newPatientData, nombre: e.target.value})} className="border-sky-200" placeholder="Nombre" />
            </div>
            <div className="space-y-2">
              <Label>Apellido *</Label>
              <Input value={newPatientData.apellido} onChange={(e) => setNewPatientData({...newPatientData, apellido: e.target.value})} className="border-sky-200" placeholder="Apellido" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={newPatientData.email} onChange={(e) => setNewPatientData({...newPatientData, email: e.target.value})} className="border-sky-200" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={newPatientData.telefono} onChange={(e) => setNewPatientData({...newPatientData, telefono: e.target.value})} className="border-sky-200" placeholder="1234567890" />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Input type="date" value={newPatientData.fecha_nacimiento} onChange={(e) => setNewPatientData({...newPatientData, fecha_nacimiento: e.target.value})} className="border-sky-200" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewPatientOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (!newPatientData.nombre || !newPatientData.apellido) {
                  toast.error('Completa nombre y apellido');
                  return;
                }
                try {
                  await apiClient.post('/patients/', {
                    nombre: newPatientData.nombre,
                    apellido: newPatientData.apellido,
                    email: newPatientData.email || null,
                    telefono: newPatientData.telefono || null,
                    fecha_nacimiento: newPatientData.fecha_nacimiento || null,
                  }, true);
                  toast.success('Paciente registrado correctamente');
                  setIsNewPatientOpen(false);
                  setNewPatientData({ nombre: '', apellido: '', email: '', telefono: '', fecha_nacimiento: '' });
                } catch (e) {
                  toast.error('Error al registrar paciente');
                }
              }} className="bg-sky-500 hover:bg-sky-600">Registrar Paciente</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAB placeholder removed */}
    </div>
  );
}