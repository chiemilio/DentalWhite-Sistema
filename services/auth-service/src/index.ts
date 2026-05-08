import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { config } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './lib/database.js';
import { connectEventBus, disconnectEventBus } from './lib/eventBus.js';
import { authRoutes } from './routes/authRoutes.js';

const fastify = Fastify({
  logger: {
    level: config.logging.level,
    transport:
      config.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

async function buildServer() {
  await fastify.register(helmet, {
    contentSecurityPolicy: config.nodeEnv === 'production',
  });

  await fastify.register(cors, {
    origin: config.nodeEnv === 'development' ? true : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
    redis: {
      host: new URL(config.redis.url).hostname,
      port: parseInt(new URL(config.redis.url).port || '6379', 10),
      password: new URL(config.redis.url).password,
    },
  });

  await fastify.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      algorithm: config.jwt.algorithm as any,
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
      expiresIn: config.jwt.expiresIn,
    },
    verify: {
      algorithms: [config.jwt.algorithm as any],
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    },
  });

  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ success: false, error: 'Token inválido o expirado' });
    }
  });

  await fastify.register(authRoutes, { prefix: '/api/v1/auth' });

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    if (error.validation) {
      return reply.code(400).send({
        success: false,
        error: 'Error de validación',
        details: error.validation,
      });
    }

    return reply.code(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Error interno del servidor',
    });
  });

  return fastify;
}

async function start() {
  try {
    await connectDatabase();
    await connectEventBus();

    const server = await buildServer();

    await server.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    console.log(`🚀 Auth Service corriendo en http://localhost:${config.port}`);
  } catch (err) {
    console.error('❌ Error iniciando el servidor:', err);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`\n📥 Señal ${signal} recibida. Cerrando servidor...`);

  try {
    await fastify.close();
    await disconnectDatabase();
    await disconnectEventBus();
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error durante el cierre:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();
