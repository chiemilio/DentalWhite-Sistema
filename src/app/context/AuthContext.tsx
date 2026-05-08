import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getStoredToken,
  saveToken,
  removeToken,
  decodeTokenUnsafe,
  type JWTPayload,
} from '../utils/jwt';
import { toast } from 'sonner';
import { apiClient, type LoginResponse } from '../utils/api';

export type UserRole = 'patient' | 'receptionist' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  age?: number;
  sex?: string;
  address?: string;
  colony?: string;
  delegation?: string;
  tutor?: string;
  occupation?: string;
  patientType?: string;
  workCenter?: string;
  specialty?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from stored token on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = getStoredToken();
        if (storedToken) {
          try {
            const response = await apiClient.get<{ user: LoginResponse['user'] }>('/auth/me', true);
            const backendUser = response.user;

            const user: User = {
              id: backendUser.id.toString(),
              email: backendUser.email,
              role: backendUser.role as UserRole,
              name: backendUser.name,
              workCenter: backendUser.workCenter,
              specialty: backendUser.specialty,
            };

            setUser(user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } catch (error) {
            // Token invalid, remove it
            console.error('Token invalid:', error);
            removeToken();
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      }, false);

      if (response.access_token && response.user) {
        saveToken(response.access_token);
        setToken(response.access_token);
        setIsAuthenticated(true);

        // Use user data from response
        const user: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          role: response.user.role as UserRole,
          name: response.user.name,
          workCenter: response.user.workCenter,
          specialty: response.user.specialty,
        };
        setUser(user);

        toast.success(`Bienvenido ${response.user.name || 'usuario'}`);
        return true;
      }

      toast.error('Credenciales incorrectas');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    removeToken();
    toast.info('Sesión cerrada');
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      await apiClient.post<LoginResponse>('/auth/register', {
        email: userData.email,
        password: userData.password,
        nombre: userData.name?.split(' ')[0] || '',
        apellido_paterno: userData.name?.split(' ').slice(1).join(' ') || '',
        role: 'patient',
      }, false);

      toast.success('Registro completado exitosamente');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al registrar usuario');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
