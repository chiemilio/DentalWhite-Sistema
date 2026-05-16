import { useState } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { Label } from '../../../shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { BanIcon, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAvailability } from '../../../shared/context/AvailabilityContext';
import { workCenters } from '../../../shared/data/mockData';
import { useAuth } from '../../auth/context/AuthContext';

export function BlockSchedule() {
  const { user } = useAuth();
  const { blockedDays, blockedTimeSlots, blockDay, unblockDay, blockTimeSlot, unblockTimeSlot } = useAvailability();
  
  const [isBlockDayDialogOpen, setIsBlockDayDialogOpen] = useState(false);
  const [isBlockTimeDialogOpen, setIsBlockTimeDialogOpen] = useState(false);
  
  const [newBlockedDay, setNewBlockedDay] = useState({
    date: '',
    reason: '',
  });
  
  const [newBlockedTime, setNewBlockedTime] = useState({
    date: '',
    time: '',
    branch: '',
    reason: '',
  });

  const handleBlockDay = () => {
    if (!newBlockedDay.date || !newBlockedDay.reason) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    blockDay(newBlockedDay.date, newBlockedDay.reason, user?.name || 'Usuario');
    setNewBlockedDay({ date: '', reason: '' });
    setIsBlockDayDialogOpen(false);
    toast.success('Día bloqueado exitosamente');
  };

  const handleUnblockDay = (date: string) => {
    unblockDay(date);
    toast.success('Día desbloqueado');
  };

  const handleBlockTimeSlot = () => {
    if (!newBlockedTime.date || !newBlockedTime.time || !newBlockedTime.branch || !newBlockedTime.reason) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    blockTimeSlot(
      newBlockedTime.date,
      newBlockedTime.time,
      newBlockedTime.branch,
      newBlockedTime.reason,
      user?.name || 'Usuario'
    );
    setNewBlockedTime({ date: '', time: '', branch: '', reason: '' });
    setIsBlockTimeDialogOpen(false);
    toast.success('Horario bloqueado exitosamente');
  };

  const handleUnblockTimeSlot = (date: string, time: string, branch: string) => {
    unblockTimeSlot(date, time, branch);
    toast.success('Horario desbloqueado');
  };

  // Horarios disponibles para bloquear
  const availableTimeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return (
    <div className="space-y-6">
      <Card className="border-sky-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sky-600 flex items-center gap-2">
              <BanIcon size={24} />
              Gestión de Disponibilidad
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={isBlockDayDialogOpen} onOpenChange={setIsBlockDayDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600">
                    <CalendarIcon className="mr-2" size={18} />
                    Bloquear Día
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Bloquear Día Completo</DialogTitle>
                    <DialogDescription>
                      El día bloqueado no estará disponible para citas en ninguna sucursal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={newBlockedDay.date}
                        onChange={(e) => setNewBlockedDay({ ...newBlockedDay, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo del bloqueo</Label>
                      <Select
                        value={newBlockedDay.reason}
                        onValueChange={(value) => setNewBlockedDay({ ...newBlockedDay, reason: value })}
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue placeholder="Seleccionar motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Capacitación del personal">Capacitación del personal</SelectItem>
                          <SelectItem value="Mantenimiento general">Mantenimiento general</SelectItem>
                          <SelectItem value="Día festivo">Día festivo</SelectItem>
                          <SelectItem value="Evento especial">Evento especial</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleBlockDay} className="w-full bg-red-500 hover:bg-red-600">
                      Bloquear Día
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isBlockTimeDialogOpen} onOpenChange={setIsBlockTimeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Clock className="mr-2" size={18} />
                    Bloquear Horario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-orange-600">Bloquear Horario Específico</DialogTitle>
                    <DialogDescription>
                      El horario bloqueado no estará disponible para citas en la sucursal seleccionada
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Sucursal</Label>
                      <Select
                        value={newBlockedTime.branch}
                        onValueChange={(value) => setNewBlockedTime({ ...newBlockedTime, branch: value })}
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue placeholder="Seleccionar sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                          {workCenters.map((center) => (
                            <SelectItem key={center.id} value={center.name}>
                              {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={newBlockedTime.date}
                        onChange={(e) => setNewBlockedTime({ ...newBlockedTime, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Select
                        value={newBlockedTime.time}
                        onValueChange={(value) => setNewBlockedTime({ ...newBlockedTime, time: value })}
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue placeholder="Seleccionar hora" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo del bloqueo</Label>
                      <Select
                        value={newBlockedTime.reason}
                        onValueChange={(value) => setNewBlockedTime({ ...newBlockedTime, reason: value })}
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue placeholder="Seleccionar motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mantenimiento de equipo">Mantenimiento de equipo</SelectItem>
                          <SelectItem value="Reunión de equipo">Reunión de equipo</SelectItem>
                          <SelectItem value="Capacitación">Capacitación</SelectItem>
                          <SelectItem value="Ausencia del doctor">Ausencia del doctor</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleBlockTimeSlot} className="w-full bg-orange-500 hover:bg-orange-600">
                      Bloquear Horario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Días Bloqueados */}
          <div>
            <h3 className="text-lg text-gray-700 mb-3">Días Bloqueados</h3>
            {blockedDays.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay días bloqueados</p>
            ) : (
              <div className="space-y-2">
                {blockedDays.map((day) => (
                  <Card key={day.date} className="border-red-200 bg-red-50">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">
                            <CalendarIcon className="inline mr-2" size={16} />
                            {new Date(day.date + 'T12:00:00').toLocaleDateString('es-MX', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Motivo:</strong> {day.reason}
                          </p>
                          <p className="text-xs text-gray-500">Bloqueado por: {day.blockedBy}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockDay(day.date)}
                          className="border-red-300 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Horarios Bloqueados */}
          <div>
            <h3 className="text-lg text-gray-700 mb-3">Horarios Bloqueados</h3>
            {blockedTimeSlots.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay horarios bloqueados</p>
            ) : (
              <div className="space-y-2">
                {blockedTimeSlots.map((slot, index) => (
                  <Card key={`${slot.date}-${slot.time}-${slot.branch}-${index}`} className="border-orange-200 bg-orange-50">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">
                            <Clock className="inline mr-2" size={16} />
                            {new Date(slot.date + 'T12:00:00').toLocaleDateString('es-MX')} - {slot.time}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Sucursal:</strong> {slot.branch}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Motivo:</strong> {slot.reason}
                          </p>
                          <p className="text-xs text-gray-500">Bloqueado por: {slot.blockedBy}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockTimeSlot(slot.date, slot.time, slot.branch)}
                          className="border-orange-300 text-orange-600 hover:bg-orange-100"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
