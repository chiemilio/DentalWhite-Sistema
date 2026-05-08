/**
 * JWT UTILITIES - DENTAL WHITE
 * Utilidades para generar, verificar y decodificar JSON Web Tokens
 */

import { SignJWT, jwtVerify } from 'jose';
import { Base64 } from 'js-base64';

// Secret key para firmar tokens (en producción debe estar en variables de entorno)
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'dental-white-super-secret-key-2026';
const JWT_ISSUER = 'dental-white-system';
const JWT_AUDIENCE = 'dental-white-users';

// Convertir el secret a Uint8Array
const getSecretKey = (): Uint8Array => {
  return new TextEncoder().encode(JWT_SECRET);
};

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
  iat?: number; // Issued at
  exp?: number; // Expiration time
  iss?: string; // Issuer
  aud?: string; // Audience
}

/**
 * Interfaz del Token Decodificado
 */
export interface DecodedToken {
  payload: JWTPayload;
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
}

/**
 * Genera un nuevo JWT
 * @param payload - Datos del usuario
 * @param expiresIn - Tiempo de expiración (default: 24 horas)
 * @returns Token JWT
 */
export async function generateToken(
  payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>,
  expiresIn: string = '24h'
): Promise<string> {
  try {
    const secret = getSecretKey();

    const token = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(expiresIn)
      .sign(secret);

    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verifica y decodifica un JWT
 * @param token - Token JWT a verificar
 * @returns Payload decodificado si es válido
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const secret = getSecretKey();

    const { payload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return payload as JWTPayload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decodifica un JWT sin verificar (solo para inspección)
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
  } catch (error) {
    console.error('Error decoding JWT:', error);
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
  } catch (error) {
    return true;
  }
}

/**
 * Obtiene información completa del token
 * @param token - Token JWT
 * @returns Información decodificada con estado de validez
 */
export async function getTokenInfo(token: string): Promise<DecodedToken> {
  try {
    const payload = await verifyToken(token);
    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : undefined;

    return {
      payload,
      isValid: true,
      isExpired: false,
      expiresAt,
    };
  } catch (error) {
    const payload = decodeTokenUnsafe(token);
    const isExpired = isTokenExpired(token);

    return {
      payload: payload || ({} as JWTPayload),
      isValid: false,
      isExpired,
      expiresAt: payload?.exp ? new Date(payload.exp * 1000) : undefined,
    };
  }
}

/**
 * Refresca un token (genera uno nuevo con los mismos datos)
 * @param oldToken - Token actual
 * @returns Nuevo token
 */
export async function refreshToken(oldToken: string): Promise<string> {
  try {
    const payload = await verifyToken(oldToken);

    // Remover campos automáticos para generar nuevo token
    const { iat, exp, iss, aud, ...userPayload } = payload;

    return await generateToken(userPayload);
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Cannot refresh invalid token');
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
  } catch (error) {
    return 0;
  }
}

/**
 * Verifica si un token es válido (firma y expiración)
 * @param token - Token JWT
 * @returns true si es válido
 */
export async function isValidToken(token: string): Promise<boolean> {
  try {
    await verifyToken(token);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Storage Keys
 */
export const TOKEN_STORAGE_KEY = 'dental_white_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'dental_white_refresh_token';

/**
 * Guarda el token en localStorage
 * @param token - Token JWT
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

/**
 * Obtiene el token desde localStorage
 * @returns Token JWT o null
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
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
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

/**
 * Verifica si hay un token válido en storage
 * @returns true si existe y es válido
 */
export async function hasValidStoredToken(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) {
    return false;
  }

  return await isValidToken(token);
}

/**
 * Obtiene el payload del token almacenado
 * @returns Payload o null
 */
export async function getStoredTokenPayload(): Promise<JWTPayload | null> {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}
