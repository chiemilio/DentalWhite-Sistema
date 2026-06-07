import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient } from '../utils/api';

interface BackendBloqueo {
  id: number;
  sucursal_id: number | null;
  empleado_id: number | null;
  horario_id: number | null;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  motivo: string | null;
  tipo_bloqueo: string | null;
  activo: boolean;
}

interface BackendHorario {
  id: number;
  sucursal_id: number | null;
  hora: string;
  hora_inicio: string;
  hora_fin: string;
  duracion_minutos: number;
  activo: boolean;
}

export interface BlockedDay {
  date: string;
  reason: string;
  blockedBy: string;
  bloqueoId?: number;
}

export interface BlockedTimeSlot {
  date: string;
  time: string;
  branch: string;
  reason: string;
  blockedBy: string;
  bloqueoId?: number;
}

interface AvailabilityContextType {
  catalogHorarios: BackendHorario[];
  blockedDays: BlockedDay[];
  blockedTimeSlots: BlockedTimeSlot[];
  blockDay: (date: string, reason: string, blockedBy: string, sucursalId?: number) => Promise<void>;
  unblockDay: (date: string) => Promise<void>;
  blockTimeSlot: (date: string, time: string, branch: string, reason: string, blockedBy: string) => Promise<void>;
  unblockTimeSlot: (date: string, time: string, branch: string) => Promise<void>;
  isDayBlocked: (date: string) => boolean;
  isTimeSlotBlocked: (date: string, time: string, branch: string) => boolean;
  getAvailableTimeSlots: (date: string, branch: string) => string[];
  isDaySaturated: (date: string, branch: string) => boolean;
  checkDisponibilidad: (fecha: string, hora: string, sucursalId?: number, empleadoId?: number) => Promise<{ disponible: boolean; mensaje: string }>;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

const BASE_TIME_SLOTS: Record<string, string[]> = {
  'Pénjamo': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  'Valle de Santiago': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  'Abasolo': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
};

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<BlockedTimeSlot[]>([]);
  const [catalogHorarios, setCatalogHorarios] = useState<BackendHorario[]>([]);

  // Cargar horarios del catálogo al inicio
  useEffect(() => {
    const loadCatalogHorarios = async () => {
      try {
        const response = await apiClient.get<BackendHorario[]>('/catalogos/horarios', false);
        setCatalogHorarios(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error loading catalog horarios:', error);
        setCatalogHorarios([]);
      }
    };
    loadCatalogHorarios();
  }, []);

  // Cargar bloqueos de agenda desde backend al inicio
  useEffect(() => {
    const loadBloqueosAgenda = async () => {
      try {
        const data = await apiClient.get<BackendBloqueo[]>('/catalogos/bloqueos-agenda', true);
        if (!Array.isArray(data)) return;

        const days: BlockedDay[] = [];
        const slots: BlockedTimeSlot[] = [];

        for (const b of data) {
          if (b.hora_inicio && b.hora_fin) {
            // Time range block - generate all 30-min slots between hora_inicio and hora_fin
            const cur = new Date(`1970-01-01T${b.hora_inicio}`);
            const end = new Date(`1970-01-01T${b.hora_fin}`);
            let dateCursor = new Date(b.fecha_inicio);
            const endDate = new Date(b.fecha_fin);
            while (dateCursor <= endDate) {
              const dateStr = dateCursor.toISOString().split('T')[0];
              const cursor = new Date(cur);
              while (cursor < end) {
                const hh = String(cursor.getHours()).padStart(2, '0');
                const mm = String(cursor.getMinutes()).padStart(2, '0');
                slots.push({
                  date: dateStr,
                  time: `${hh}:${mm}`,
                  branch: '',
                  reason: b.motivo || '',
                  blockedBy: 'Sistema',
                  bloqueoId: b.id,
                });
                cursor.setMinutes(cursor.getMinutes() + 30);
              }
              dateCursor.setDate(dateCursor.getDate() + 1);
            }
          } else {
            // Full-day block
            let dateCursor = new Date(b.fecha_inicio);
            const endDate = new Date(b.fecha_fin);
            while (dateCursor <= endDate) {
              const dateStr = dateCursor.toISOString().split('T')[0];
              days.push({
                date: dateStr,
                reason: b.motivo || b.tipo_bloqueo || 'Bloqueado',
                blockedBy: 'Sistema',
                bloqueoId: b.id,
              });
              dateCursor.setDate(dateCursor.getDate() + 1);
            }
          }
        }
        setBlockedDays(days);
        setBlockedTimeSlots(slots);
      } catch (error) {
        console.error('Error loading bloqueos-agenda:', error);
      }
    };
    loadBloqueosAgenda();
  }, []);

  const blockDay = async (date: string, reason: string, blockedBy: string, sucursalId?: number) => {
    try {
      const response = await apiClient.post<BackendBloqueo>('/catalogos/bloqueos-agenda', {
        fecha_inicio: date,
        fecha_fin: date,
        motivo: reason,
        tipo_bloqueo: 'BLOQUEO_MANUAL',
        sucursal_id: sucursalId || null,
      }, true);
      setBlockedDays((prev) => {
        if (prev.some((d) => d.date === date)) return prev;
        return [...prev, { date, reason, blockedBy, bloqueoId: response.id }];
      });
    } catch (error) {
      console.error('Error blocking day:', error);
    }
  };

  const unblockDay = async (date: string) => {
    const day = blockedDays.find((d) => d.date === date);
    if (day?.bloqueoId) {
      try {
        await apiClient.delete(`/catalogos/bloqueos-agenda/${day.bloqueoId}`, true);
      } catch (error) {
        console.error('Error unblocking day:', error);
      }
    }
    setBlockedDays((prev) => prev.filter((d) => d.date !== date));
  };

  const blockTimeSlot = async (date: string, time: string, branch: string, reason: string, blockedBy: string) => {
    try {
      const response = await apiClient.post<BackendBloqueo>('/catalogos/bloqueos-agenda', {
        fecha_inicio: date,
        fecha_fin: date,
        hora_inicio: time,
        hora_fin: `${String(parseInt(time) + 1).padStart(2, '0')}:${time.split(':')[1]}`,
        motivo: reason,
        tipo_bloqueo: 'BLOQUEO_MANUAL',
      }, true);
      setBlockedTimeSlots((prev) => {
        if (prev.some((s) => s.date === date && s.time === time && s.branch === branch)) return prev;
        return [...prev, { date, time, branch, reason, blockedBy, bloqueoId: response.id }];
      });
    } catch (error) {
      console.error('Error blocking time slot:', error);
    }
  };

  const unblockTimeSlot = async (date: string, time: string, branch: string) => {
    const slot = blockedTimeSlots.find((s) => s.date === date && s.time === time && s.branch === branch);
    if (slot?.bloqueoId) {
      try {
        await apiClient.delete(`/catalogos/bloqueos-agenda/${slot.bloqueoId}`, true);
      } catch (error) {
        console.error('Error unblocking time slot:', error);
      }
    }
    setBlockedTimeSlots((prev) =>
      prev.filter((s) => !(s.date === date && s.time === time && s.branch === branch))
    );
  };

  const isDayBlocked = (date: string): boolean => {
    return blockedDays.some((d) => d.date === date);
  };

  const isTimeSlotBlocked = (date: string, time: string, branch: string): boolean => {
    return blockedTimeSlots.some(
      (s) => s.date === date && s.time === time && (!s.branch || s.branch === branch)
    );
  };

  const getAvailableTimeSlots = (date: string, branch: string): string[] => {
    if (catalogHorarios.length > 0) {
      return catalogHorarios.map((h) => h.hora).filter((t) => !isTimeSlotBlocked(date, t, branch));
    }
    return (BASE_TIME_SLOTS[branch] || []).filter((t) => !isTimeSlotBlocked(date, t, branch));
  };

  const isDaySaturated = (date: string, branch: string): boolean => {
    return getAvailableTimeSlots(date, branch).length === 0;
  };

  const checkDisponibilidad = async (fecha: string, hora: string, sucursalId?: number, empleadoId?: number) => {
    try {
      const response = await apiClient.post<{ disponible: boolean; mensaje: string }>(
        '/catalogos/validar-disponibilidad',
        { fecha, hora, sucursal_id: sucursalId, empleado_id: empleadoId },
        false
      );
      return response;
    } catch (error: any) {
      console.error('Error validando disponibilidad:', error);
      return { disponible: true, mensaje: 'Disponible' };
    }
  };

  const value = {
    catalogHorarios,
    blockedDays,
    blockedTimeSlots,
    blockDay,
    unblockDay,
    blockTimeSlot,
    unblockTimeSlot,
    isDayBlocked,
    isTimeSlotBlocked,
    getAvailableTimeSlots,
    isDaySaturated,
    checkDisponibilidad,
  };

  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>;
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability debe usarse dentro de un AvailabilityProvider');
  }
  return context;
}
