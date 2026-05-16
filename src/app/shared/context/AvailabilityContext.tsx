import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../utils/api';

// Tipos de datos del backend
interface BackendBloqueo {
  id: number;
  sucursal_id: number | null;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_bloqueo: string | null;
  activo: boolean;
  horario_id: number | null;
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
  date: string; // formato YYYY-MM-DD
  reason: string;
  blockedBy: string;
}

export interface BlockedTimeSlot {
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:MM
  branch: string;
  reason: string;
  blockedBy: string;
}

interface AvailabilityContextType {
  catalogHorarios: BackendHorario[];
  blockedDays: BlockedDay[];
  blockedTimeSlots: BlockedTimeSlot[];
  blockDay: (date: string, reason: string, blockedBy: string) => void;
  unblockDay: (date: string) => void;
  blockTimeSlot: (date: string, time: string, branch: string, reason: string, blockedBy: string) => void;
  unblockTimeSlot: (date: string, time: string, branch: string) => void;
  isDayBlocked: (date: string) => boolean;
  isTimeSlotBlocked: (date: string, time: string, branch: string) => boolean;
  getAvailableTimeSlots: (date: string, branch: string) => string[];
  isDaySaturated: (date: string, branch: string) => boolean;
  checkDisponibilidad: (fecha: string, hora: string, sucursalId?: number, empleadoId?: number) => Promise<boolean>;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

// Horarios base por sucursal (lunes a viernes)
const BASE_TIME_SLOTS: Record<string, string[]> = {
  'Pénjamo': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  'Valle de Santiago': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  'Abasolo': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
};

// Máximo de citas por horario por sucursal
const MAX_APPOINTMENTS_PER_SLOT = 3;

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [catalogHorarios, setCatalogHorarios] = useState<BackendHorario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar horarios del catálogo al inicio
  useEffect(() => {
    const loadCatalogHorarios = async () => {
      try {
        const response = await apiClient.get<BackendHorario[]>('/catalogos/horarios', false);
        if (response && Array.isArray(response)) {
          setCatalogHorarios(response);
        }
      } catch (error) {
        console.error('Error loading catalog horarios:', error);
      }
    };
    loadCatalogHorarios();
  }, []);

  const [blockedTimeSlots, setBlockedTimeSlots] = useState<BlockedTimeSlot[]>([]);

  const blockDay = (date: string, reason: string, blockedBy: string) => {
    setBlockedDays((prev) => {
      // Evitar duplicados
      if (prev.some((d) => d.date === date)) return prev;
      return [...prev, { date, reason, blockedBy }];
    });
  };

  const unblockDay = (date: string) => {
    setBlockedDays((prev) => prev.filter((d) => d.date !== date));
  };

  const blockTimeSlot = (date: string, time: string, branch: string, reason: string, blockedBy: string) => {
    setBlockedTimeSlots((prev) => {
      // Evitar duplicados
      if (prev.some((slot) => slot.date === date && slot.time === time && slot.branch === branch)) {
        return prev;
      }
      return [...prev, { date, time, branch, reason, blockedBy }];
    });
  };

  const unblockTimeSlot = (date: string, time: string, branch: string) => {
    setBlockedTimeSlots((prev) =>
      prev.filter((slot) => !(slot.date === date && slot.time === time && slot.branch === branch))
    );
  };

  const isDayBlocked = (date: string): boolean => {
    // Verificar si es fin de semana
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return true; // Domingo = 0, Sábado = 6

    // Verificar si está en la lista de días bloqueados
    return blockedDays.some((d) => d.date === date);
  };

  const isTimeSlotBlocked = (date: string, time: string, branch: string): boolean => {
    return blockedTimeSlots.some(
      (slot) => slot.date === date && slot.time === time && slot.branch === branch
    );
  };

  const getAvailableTimeSlots = (date: string, branch: string): string[] => {
    // Usar horarios del catálogo si están disponibles
    if (catalogHorarios.length > 0) {
      const horariosDelCatalogo = catalogHorarios.map(h => h.hora);
      return horariosDelCatalogo.filter((time) => !isTimeSlotBlocked(date, time, branch));
    }
    
    // Fallback a los horarios base
    const baseSlots = BASE_TIME_SLOTS[branch] || [];
    return baseSlots.filter((time) => !isTimeSlotBlocked(date, time, branch));
  };

  const isDaySaturated = (date: string, branch: string): boolean => {
    const availableSlots = getAvailableTimeSlots(date, branch);
    return availableSlots.length === 0;
  };

  const checkDisponibilidad = async (fecha: string, hora: string, sucursalId?: number, empleadoId?: number): Promise<{ disponible: boolean; mensaje: string }> => {
    try {
      const response = await apiClient.post<{ disponible: boolean; mensaje: string }>(
        '/catalogos/validar-disponibilidad',
        {
          fecha,
          hora,
          sucursal_id: sucursalId,
          empleado_id: empleadoId,
        },
        false
      );
      return { disponible: response.disponible, mensaje: response.mensaje };
    } catch (error: any) {
      console.error('Error validando disponibilidad:', error);
      // Si hay error, permitir agendar (comportamiento tolerante)
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
