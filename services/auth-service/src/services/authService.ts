import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma } from '../lib/database.js';
import { setCache, getCache, deleteCache } from '../lib/redis.js';
import { publishEvent, AuthEvents } from '../lib/eventBus.js';
import { config } from '../config/index.js';

interface LoginCredentials {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RegisterData {
  email: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  async login(credentials: LoginCredentials, generateToken: (payload: any) => string): Promise<TokenPair> {
    const { email, password, ipAddress, userAgent } = credentials;

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!usuario || !usuario.activo) {
      await this.registrarIntentoFallido(email, ipAddress, userAgent, 'Usuario no encontrado o inactivo');
      await publishEvent(AuthEvents.LOGIN_FAILED, { email, razon: 'credenciales_invalidas' });
      throw new Error('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      await this.registrarIntentoFallido(email, ipAddress, userAgent, 'Contraseña incorrecta', usuario.id);
      await publishEvent(AuthEvents.LOGIN_FAILED, { email, usuario_id: usuario.id });
      throw new Error('Credenciales inválidas');
    }

    const jti = randomUUID();
    const accessToken = generateToken({
      sub: usuario.id,
      email: usuario.email,
      jti,
    });

    const refreshToken = await this.crearRefreshToken(usuario.id, ipAddress, userAgent);

    await this.registrarSesionActiva(usuario.id, jti, ipAddress, userAgent);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimo_acceso: new Date() },
    });

    await publishEvent(AuthEvents.USER_LOGGED_IN, {
      usuario_id: usuario.id,
      email: usuario.email,
      ip_address: ipAddress,
    });

    await this.registrarAuditoria('LOGIN', usuario.id, { ip_address: ipAddress });

    return {
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: this.parseDuration(config.jwt.expiresIn),
    };
  }

  async register(data: RegisterData): Promise<{ id: string; email: string }> {
    const { email, password } = data;

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        email: email.toLowerCase(),
        password_hash: passwordHash,
      },
    });

    await publishEvent(AuthEvents.USER_REGISTERED, {
      usuario_id: usuario.id,
      email: usuario.email,
    });

    await this.registrarAuditoria('REGISTER', usuario.id, {});

    return {
      id: usuario.id,
      email: usuario.email,
    };
  }

  async refreshAccessToken(refreshToken: string, generateToken: (payload: any) => string): Promise<{ accessToken: string }> {
    const tokenData = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { usuario: true },
    });

    if (!tokenData || tokenData.revocado || new Date() > tokenData.expires_at) {
      throw new Error('Refresh token inválido o expirado');
    }

    if (!tokenData.usuario.activo) {
      throw new Error('Usuario inactivo');
    }

    const jti = randomUUID();
    const accessToken = generateToken({
      sub: tokenData.usuario.id,
      email: tokenData.usuario.email,
      jti,
    });

    await publishEvent(AuthEvents.TOKEN_REFRESHED, {
      usuario_id: tokenData.usuario.id,
    });

    return { accessToken };
  }

  async logout(usuarioId: string, jti: string): Promise<void> {
    await prisma.sesionActiva.deleteMany({
      where: { usuario_id: usuarioId, token_jti: jti },
    });

    await publishEvent(AuthEvents.USER_LOGGED_OUT, { usuario_id: usuarioId });

    await this.registrarAuditoria('LOGOUT', usuarioId, {});
  }

  async revocarRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token },
      data: {
        revocado: true,
        revocado_at: new Date(),
      },
    });
  }

  async verificarUsuario(usuarioId: string): Promise<boolean> {
    const cacheKey = `usuario:activo:${usuarioId}`;
    const cached = await getCache(cacheKey);

    if (cached !== null) {
      return cached === 'true';
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { activo: true },
    });

    const activo = usuario?.activo ?? false;
    await setCache(cacheKey, activo.toString(), 300);

    return activo;
  }

  private async crearRefreshToken(
    usuarioId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.parseDuration(config.jwt.refreshExpiresIn) / (1000 * 60 * 60 * 24));

    return await prisma.refreshToken.create({
      data: {
        usuario_id: usuarioId,
        token,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    });
  }

  private async registrarSesionActiva(
    usuarioId: string,
    jti: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.sesionActiva.create({
      data: {
        usuario_id: usuarioId,
        token_jti: jti,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: expiresAt,
      },
    });
  }

  private async registrarIntentoFallido(
    email: string,
    ipAddress?: string,
    userAgent?: string,
    razon?: string,
    usuarioId?: string
  ) {
    await prisma.intentoFallido.create({
      data: {
        email: email.toLowerCase(),
        ip_address: ipAddress,
        user_agent: userAgent,
        razon,
        usuario_id: usuarioId,
      },
    });
  }

  private async registrarAuditoria(
    accion: string,
    usuarioId: string,
    detalle: any
  ) {
    await prisma.auditoriaAuth.create({
      data: {
        usuario_id: usuarioId,
        accion,
        detalle,
        ip_address: detalle.ip_address,
        user_agent: detalle.user_agent,
      },
    });
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      case 's': return value * 1000;
      default: return 0;
    }
  }
}

export const authService = new AuthService();
