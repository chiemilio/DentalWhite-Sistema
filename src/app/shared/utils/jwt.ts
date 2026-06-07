/**
 * JWT UTILITIES - DENTAL WHITE
 * Solo lectura/decodificación de JWTs del lado del cliente.
 * La generación y verificación de tokens es exclusiva del backend.
 */

import { Base64 } from 'js-base64';

/**
 * Interfaz del Payload del Token
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'patient' | 'receptionist' | 'doctor' | 'admin';
  name: string;
  workCenter?: string;
  specialty?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

/**
 * Interfaz del Token Decodificado
 */
export interface DecodedToken {
  payload: JWTPayload;
  isExpired: boolean;
  expiresAt?: Date;
}

/**
 * Decodifica un JWT sin verificar (solo para leer claims)
 * ADVERTENCIA: No usar para autenticación, solo para leer datos
 * @param token - Token JWT
 * @returns Payload decodificado
 */
export function decodeTokenUnsafe(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = JSON.parse(Base64.decode(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Verifica si un token está expirado (sin verificar firma)
 * @param token - Token JWT
 * @returns true si está expirado
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeTokenUnsafe(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

/**
 * Obtiene el tiempo restante de un token en segundos
 * @param token - Token JWT
 * @returns Segundos restantes o 0 si está expirado
 */
export function getTokenTimeRemaining(token: string): number {
  try {
    const payload = decodeTokenUnsafe(token);
    if (!payload || !payload.exp) {
      return 0;
    }
    const now = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - now;
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

/**
 * Storage Keys
 */
export const TOKEN_STORAGE_KEY = 'dental_white_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'dental_white_refresh_token';

/**
 * Guarda el token en localStorage
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Silently fail in private browsing mode
  }
}

/**
 * Obtiene el token desde localStorage
 * @returns Token JWT o null
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Elimina el token de localStorage
 */
export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Refresca el token JWT usando el endpoint de refresh
 * @param currentToken - Token actual
 * @returns Nuevo token
 */
export async function refreshToken(currentToken: string): Promise<string> {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: currentToken }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Error al refrescar token' }));
    throw new Error(err.detail || 'Error al refrescar token');
  }

  const data = await response.json();
  return data.access_token;
}
