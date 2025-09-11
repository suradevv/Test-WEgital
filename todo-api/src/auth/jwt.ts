import { sign, verify, type Secret } from 'jsonwebtoken';

const ACCESS_SECRET = (process.env.JWT_ACCESS_SECRET || 'dev_access') as Secret;
const REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET || 'dev_refresh') as Secret;
const ACCESS_EXPIRES = Number(process.env.ACCESS_EXPIRES ?? 120);   // seconds
const REFRESH_EXPIRES = Number(process.env.REFRESH_EXPIRES ?? 300); // seconds

export function signAccess(payload: object) {
  return sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefresh(payload: object) {
  return sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccess(token: string) {
  return verify(token, ACCESS_SECRET) as any;
}

export function verifyRefresh(token: string) {
  return verify(token, REFRESH_SECRET) as any;
}
