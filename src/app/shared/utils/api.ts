/**
 * API Client - Dental White
 * Cliente HTTP para comunicación con el backend FastAPI
 */

import { getStoredToken } from './jwt';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Headers base para las peticiones
 */
function getHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('dental_white_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Maneja la respuesta de la API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(errorData.detail || `Error ${response.status}`);
  }
  return response.json();
}

/**
 * Cliente API con métodos HTTP básicos
 */
function getEndpointUrl(endpoint: string): string {
  // Don't add trailing slash to endpoints that already have a digit at the end (like /employees/11 or /employees/11/)
  const shouldAddSlash = !endpoint.endsWith('/') && !endpoint.includes('?') && !/\d$/.test(endpoint);
  const url = `${API_BASE_URL}${endpoint}`;
  return shouldAddSlash ? url + '/' : url;
}

/**
 * Headless category loader for catalogos
 */
async function loadCatalogos<T>(endpoint: string, addSlash: boolean = true): Promise<T[]> {
  const url = addSlash && !endpoint.endsWith('/') && !endpoint.includes('?') && !/\d$/.test(endpoint)
    ? `${API_BASE_URL}${endpoint}/`
    : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse<T[]>(response);
}

export const catalogoClient = {
  async getRoles(): Promise<BackendRole[]> {
    return loadCatalogos<BackendRole>('/catalogos/roles', false);
  },
  async getSucursales(): Promise<BackendSucursal[]> {
    return loadCatalogos<BackendSucursal>('/catalogos/sucursales', false);
  },
};

export const apiClient = {
  /**
 * GET request
 */
  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(getEndpointUrl(endpoint), {
      method: 'GET',
      headers: getHeaders(includeAuth),
    });
    return handleResponse<T>(response);
  },

  /**
   * GET request that returns null on 404 (resource may not exist)
   */
  async getOptional<T>(endpoint: string, includeAuth: boolean = true): Promise<T | null> {
    const response = await fetch(getEndpointUrl(endpoint), {
      method: 'GET',
      headers: getHeaders(includeAuth),
    });
    if (response.status === 404) return null;
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(getEndpointUrl(endpoint), {
      method: 'POST',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(getEndpointUrl(endpoint), {
      method: 'PUT',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: unknown, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(getEndpointUrl(endpoint), {
      method: 'PATCH',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

/**
   * DELETE request
   */
  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(getEndpointUrl(endpoint), {
      method: 'DELETE',
      headers: getHeaders(includeAuth),
    });
    return handleResponse<T>(response);
  },
};

/**
 * Interfaces for catalogos
 */
export interface BackendRole {
  id: number;
  nombre: string;
  activo: boolean;
  permisos?: Record<string, boolean>;
}

export interface BackendSucursal {
  id: number;
  nombre: string;
  activo: boolean;
  direccion?: string;
  telefono?: string;
  email?: string;
}

/**
 * Tipos de datos para las APIs
 */
export interface BackendAppointment {
  id: number;
  paciente_id: number;
  empleado_id: number;
  servicio_id: number;
  sucursal_id: number;
  estado_cita_id: number;
  fecha_hora: string;
  duracion_minutos: number;
  motivo?: string;
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  paciente_nombre?: string;
  empleado_nombre?: string;
  servicio_nombre?: string;
  sucursal_nombre?: string;
  estado_nombre?: string;
}

export interface CreateAppointmentDTO {
  paciente_id: number;
  empleado_id: number;
  servicio_id: number;
  sucursal_id: number;
  estado_cita_id: number;
  fecha_hora: string;
  duracion_minutos?: number;
  motivo?: string;
  notas?: string;
}

export interface BackendEmployee {
  id: number;
  usuario_id: number;
  numero_empleado: string;
  fecha_ingreso?: string;
  cedula_profesional?: string;
  salario?: number;
  notas?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_nombre?: string;
  usuario_email?: string;
  usuario_telefono?: string;
  usuario_rol_id?: number;
  usuario_rol_nombre?: string;
  sucursal_id?: number;
  sucursal_nombre?: string;
  puesto?: string;
  especialidades?: string[];
}

export interface CreateEmployeeDTO {
  usuario_id: number;
  numero_empleado: string;
  fecha_ingreso?: string;
  cedula_profesional?: string;
  salario?: number;
  notas?: string;
  especialidad_ids?: number[];
}

export interface BackendPatient {
  id: number;
  usuario_id: number;
  tipo_paciente_id?: number;
  sucursal_id?: number;
  numero_expediente: string;
  fecha_nacimiento: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  codigo_postal?: string;
  telefono_emergencia?: string;
  contacto_emergencia?: string;
  tutor_nombre?: string;
  tutor_telefono?: string;
  tutor_relacion?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_nombre?: string;
  usuario_email?: string;
  usuario_telefono?: string;
}

export interface BackendCatalogItem {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
    workCenter?: string;
    specialty?: string;
  };
}
