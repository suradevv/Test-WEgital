import type { Secret } from 'jsonwebtoken';

export const config = {
  PORT: Number(process.env.PORT || 4000),
  DB_URL: process.env.DATABASE_URL || '',
  JWT_ACCESS_SECRET: (process.env.JWT_ACCESS_SECRET || 'dev_access') as Secret,
  JWT_REFRESH_SECRET: (process.env.JWT_REFRESH_SECRET || 'dev_refresh') as Secret,

  ACCESS_EXPIRES: Number(process.env.ACCESS_EXPIRES ?? 120),
  REFRESH_EXPIRES: Number(process.env.REFRESH_EXPIRES ?? 300),

  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const;
