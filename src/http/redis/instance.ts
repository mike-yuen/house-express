import Redis from 'ioredis';
import config from '@/config';

/**
 * Global redis connection, will use it through the app.
 */
export const RedisInstance = new Redis(config.redis.uri);
