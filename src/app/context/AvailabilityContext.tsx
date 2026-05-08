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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bloqueos from backend
  useEffect(() => {
    const fetchBloqueos = async () => {
      try {
        const response = await apiClient.get<BackendBloqueo[]>('/catalogos/bloqueos-agenda', false);
        
        // Convertir bloqueos a formato de дней bloqueados
        const days: BlockedDay[] = [];
        response.forEach((bloqueo) => {
          if (bloqueo.activo) {
            const inicio = new Date(bloqueo.fecha_inicio);
            const fin = new Date(bloqueo.fecha_fin);
            
            // Agregar cada día del rango
            for (let d = inicio; d <= fin; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              days.push({
                date: dateStr,
                reason: bloqueo.tipo_bloqueo || 'Bloqueado',
                blockedBy: 'Sistema',
              });
            }
          }
        });
        
        setBlockedDays(days);
      } catch (error) {
        console.error('Error fetching bloqueos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBloqueos();
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
    const baseSlots = BASE_TIME_SLOTS[branch] || [];
    
    // Filtrar horarios bloqueados
    return baseSlots.filter((time) => !isTimeSlotBlocked(date, time, branch));
  };

  const isDaySaturated = (date: string, branch: string): boolean => {
    // Obtener horarios disponibles
    const availableSlots = getAvailableTimeSlots(date, branch);
    
    // Si no hay horarios disponibles, el día está saturado
    return availableSlots.length === 0;
  };

  const value = {
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
