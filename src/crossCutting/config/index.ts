import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  const envFound = dotenv.config();
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

export default {
  httpPort: parseInt(process.env.HTTP_PORT, 10),
  grpcPort: parseInt(process.env.GRPC_PORT, 10),

  databaseURL: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  agendash: {
    user: 'agendash',
    password: '123456',
  },

  api: {
    prefix: '/api',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    username: process.env.REDIS_USERNAME || null,
    password: process.env.REDIS_PASSWORD || null,
  },

  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};
