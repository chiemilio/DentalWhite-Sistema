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
import { Calendar, Search, CheckCircle, XCircle, Clock, User, DollarSign, Edit, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { workCenters, type Appointment } from '../../../shared/data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../../shared/ui/radio-group';
import { useAvailability } from '../../../shared/context/AvailabilityContext';
import { sendAppointmentConfirmations } from '../../../shared/utils/appointmentNotifications';
import { NewAppointmentDialog } from '../../appointments/components/NewAppointmentDialog';
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

  const mapAppointment = (backendAppt: BackendAppointment): Appointment => {
    const fechaHora = new Date(backendAppt.fecha_hora);
    const date = `${fechaHora.getFullYear()}-${String(fechaHora.getMonth() + 1).padStart(2, '0')}-${String(fechaHora.getDate()).padStart(2, '0')}`;
    const time = fechaHora.toTimeString().split(' ')[0].substring(0, 5);
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

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        const params = new URLSearchParams();
        params.append('sucursal_id', '1');
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
      // Use apiClient instead of raw fetch
      const data = await apiClient.put<BackendAppointment>(`/appointments/${id}`, {
        estado_cita_id: 2  // 2 = Confirmada
      }, true);
      
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'confirmed' as const } : apt
        )
      );
      toast.success('Cita confirmada');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al confirmar cita');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await apiClient.put<BackendAppointment>(`/appointments/${id}`, {
        estado_cita_id: 3  // 3 = Cancelada
      }, true);
      
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        )
      );
      toast.success('Cita cancelada');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cancelar cita');
    }
  };

  const handleViewPatient = (patient: BackendPatient) => {
    setSelectedPatient(patient as any);
    setIsPatientDialogOpen(true);
  };

  const handleOpenPaymentDialog = async (appointment: any) => {
    const appointmentId = appointment.id;
    
    const existingPayment = await apiClient.getOptional<any>(`/payments/cita/${appointmentId}`, true);

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

        const existingPayment = await apiClient.getOptional<any>(`/payments/cita/${citaId}`, true);
        const paymentId = existingPayment?.id ?? null;

        if (paymentId) {
          // Actualizar payment existente
          await apiClient.put<any>(`/payments/${paymentId}`, {
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

        toast.success('Pago registrado correctamente');
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
                  {workCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-600">
            Citas del Día ({filteredAppointments.length})
          </CardTitle>
          <CardDescription>
            {(() => {
              const [y, m, d] = selectedDate.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              });
            })()}
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
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {appointment.status === 'confirmed'
                            ? 'Confirmada'
                            : appointment.status === 'cancelled'
                            ? 'Cancelada'
                            : 'Programada'}
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
                              >
                                <CheckCircle size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
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
                            >
                              <DollarSign size={16} />
                            </Button>
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
                  const data = await apiClient.get<BackendPatient[]>(`/patients/search/?q=${encodeURIComponent(searchTerm)}`, true);
                  const results = Array.isArray(data) ? data : [];
                  if (results.length === 0) {
                    toast.info('No se encontraron pacientes');
                  } else {
                    toast.success(`Encontrados: ${results.length} pacientes`);
                  }
                  setSearchResults(results);
                } catch(error) {
                  toast.error('Error al buscar pacientes');
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
      <div className="fixed bottom-6 right-6">
        <NewAppointmentDialog
          onAppointmentCreated={(appointment) => setAppointments([...appointments, appointment])}
          existingAppointments={appointments}
        />
      </div>
    </div>
  );
}