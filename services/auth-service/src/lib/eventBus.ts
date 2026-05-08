import amqp, { Connection, Channel } from 'amqplib';
import { config } from '../config/index.js';

let connection: Connection | null = null;
let channel: Channel | null = null;

export async function connectEventBus(): Promise<void> {
  try {
    connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();

    await channel.assertExchange('dental-white-events', 'topic', { durable: true });

    console.log('✅ Conectado a RabbitMQ');
  } catch (error) {
    console.error('❌ Error conectando a RabbitMQ:', error);
    throw error;
  }
}

export async function publishEvent(
  eventType: string,
  data: any
): Promise<void> {
  if (!channel) {
    throw new Error('Event bus no está conectado');
  }

  const event = {
    type: eventType,
    data,
    timestamp: new Date().toISOString(),
    service: 'auth-service',
  };

  channel.publish(
    'dental-white-events',
    eventType,
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
}

export async function disconnectEventBus(): Promise<void> {
  if (channel) await channel.close();
  if (connection) await connection.close();
  console.log('🔌 Desconectado de RabbitMQ');
}

// Tipos de eventos
export const AuthEvents = {
  USER_LOGGED_IN: 'auth.user.logged_in',
  USER_LOGGED_OUT: 'auth.user.logged_out',
  USER_REGISTERED: 'auth.user.registered',
  PASSWORD_CHANGED: 'auth.password.changed',
  TOKEN_REFRESHED: 'auth.token.refreshed',
  LOGIN_FAILED: 'auth.login.failed',
} as const;
