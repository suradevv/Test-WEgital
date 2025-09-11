import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../db/data-source';
import { User } from '../entities/user.entity';
import { signAccess, signRefresh, verifyRefresh } from './jwt';

const userRepo = () => AppDataSource.getRepository(User);

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production', // dev = false
  // บน localhost ไม่ต้องตั้ง domain
};

export async function register(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: 'Missing email/password' });
  if (password.length < 6) return res.status(400).json({ message: 'Password too short' });

  const exists = await userRepo().findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Email already taken' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepo().create({ email, passwordHash });
  await userRepo().save(user);

  return res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = await userRepo().findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password || '', user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccess({ sub: user.id });
  const refreshToken = signRefresh({ sub: user.id });

  res
    .cookie('accessToken', accessToken, { ...cookieBase, maxAge: Number(process.env.ACCESS_EXPIRES ?? 120) * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieBase, maxAge: Number(process.env.REFRESH_EXPIRES ?? 300) * 1000 })
    .json({ ok: true });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = verifyRefresh(token);
    const accessToken = signAccess({ sub: payload.sub });
    const newRefresh = signRefresh({ sub: payload.sub });
    res
      .cookie('accessToken', accessToken, { ...cookieBase, maxAge: Number(process.env.ACCESS_EXPIRES ?? 120) * 1000 })
      .cookie('refreshToken', newRefresh, { ...cookieBase, maxAge: Number(process.env.REFRESH_EXPIRES ?? 300) * 1000 })
      .json({ ok: true });
  } catch {
    res.status(401).json({ message: 'Refresh invalid/expired' });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('accessToken', { ...cookieBase, maxAge: 0 });
  res.clearCookie('refreshToken', { ...cookieBase, maxAge: 0 });
  res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const user = await userRepo().findOne({ where: { id: userId } });
  res.json({ id: user?.id, email: user?.email });
}
