/**
 * TOKEN REFRESH HOOK
 * Hook para manejar la renovación automática de tokens JWT
 */

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getStoredToken,
  getTokenTimeRemaining,
  refreshToken,
  saveToken,
  removeToken,
} from '../utils/jwt';
import { toast } from 'sonner';

interface UseTokenRefreshOptions {
  /**
   * Tiempo antes de expiración para refrescar (en segundos)
   * Default: 5 minutos (300 segundos)
   */
  refreshBeforeExpiry?: number;
  
  /**
   * Intervalo de verificación (en milisegundos)
   * Default: 1 minuto (60000 ms)
   */
  checkInterval?: number;
  
  /**
   * Mostrar notificaciones al usuario
   * Default: true
   */
  showNotifications?: boolean;
}

/**
 * Hook que verifica y refresca automáticamente el token JWT
 * antes de que expire
 */
export function useTokenRefresh(options: UseTokenRefreshOptions = {}) {
  const {
    refreshBeforeExpiry = 300, // 5 minutos
    checkInterval = 60000, // 1 minuto
    showNotifications = true,
  } = options;

  const { isAuthenticated, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval if user is not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Function to check and refresh token
    const checkAndRefreshToken = async () => {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshingRef.current) {
        return;
      }

      try {
        const token = getStoredToken();
        if (!token) {
          console.log('No token found, logging out');
          logout();
          return;
        }

        const timeRemaining = getTokenTimeRemaining(token);

        // Token expired
        if (timeRemaining <= 0) {
          console.log('Token expired, logging out');
          if (showNotifications) {
            toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          }
          logout();
          return;
        }

        // Token about to expire - refresh it
        if (timeRemaining <= refreshBeforeExpiry) {
          console.log(`Token expiring in ${timeRemaining}s, refreshing...`);
          isRefreshingRef.current = true;

          try {
            const newToken = await refreshToken(token);
            saveToken(newToken);
            
            if (showNotifications) {
              toast.success('Sesión renovada automáticamente', {
                duration: 2000,
              });
            }
            
            console.log('Token refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh token:', error);
            if (showNotifications) {
              toast.error('No se pudo renovar la sesión. Por favor inicia sesión nuevamente.');
            }
            logout();
          } finally {
            isRefreshingRef.current = false;
          }
        } else {
          // Token still valid
          const minutes = Math.floor(timeRemaining / 60);
          console.log(`Token valid for ${minutes} more minutes`);
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    // Initial check
    checkAndRefreshToken();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkAndRefreshToken, checkInterval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, logout, refreshBeforeExpiry, checkInterval, showNotifications]);

  return {
    // Could return utilities here if needed
  };
}

/**
 * Hook para obtener información del token actual
 */
export function useTokenInfo() {
  const token = getStoredToken();

  if (!token) {
    return {
      hasToken: false,
      timeRemaining: 0,
      expiresAt: null,
      isExpired: true,
    };
  }

  const timeRemaining = getTokenTimeRemaining(token);
  const isExpired = timeRemaining <= 0;
  const expiresAt = isExpired ? null : new Date(Date.now() + timeRemaining * 1000);

  return {
    hasToken: true,
    timeRemaining,
    expiresAt,
    isExpired,
  };
}
