import Redis from 'ioredis';
import config from '@/crossCutting/config';

/**
 * Global redis connection, will use it through the app.
 */
export const RedisConnection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});
