import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/authService.js';
import { loginSchema, registerSchema, refreshTokenSchema } from '../schemas/authSchemas.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = loginSchema.parse(request.body);
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'];

      const result = await authService.login(
        { ...data, ipAddress, userAgent },
        (payload) => fastify.jwt.sign(payload)
      );

      return reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(401).send({
        success: false,
        error: error.message || 'Error en el login',
      });
    }
  });

  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = registerSchema.parse(request.body);

      const result = await authService.register(data);

      return reply.code(201).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(400).send({
        success: false,
        error: error.message || 'Error en el registro',
      });
    }
  });

  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = refreshTokenSchema.parse(request.body);

      const result = await authService.refreshAccessToken(
        data.refreshToken,
        (payload) => fastify.jwt.sign(payload)
      );

      return reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(401).send({
        success: false,
        error: error.message || 'Refresh token inválido',
      });
    }
  });

  fastify.post('/logout', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any;

      await authService.logout(user.sub, user.jti);

      return reply.code(200).send({
        success: true,
        message: 'Sesión cerrada exitosamente',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Error al cerrar sesión',
      });
    }
  });

  fastify.post('/revoke-refresh-token', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = refreshTokenSchema.parse(request.body);

      await authService.revocarRefreshToken(data.refreshToken);

      return reply.code(200).send({
        success: true,
        message: 'Refresh token revocado',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Error al revocar token',
      });
    }
  });

  fastify.get('/verify', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any;

      const activo = await authService.verificarUsuario(user.sub);

      if (!activo) {
        return reply.code(401).send({
          success: false,
          error: 'Usuario inactivo',
        });
      }

      return reply.code(200).send({
        success: true,
        data: {
          usuario_id: user.sub,
          email: user.email,
        },
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Error al verificar token',
      });
    }
  });

  fastify.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
      success: true,
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    });
  });
}
