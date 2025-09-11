import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from './jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyAccess(token);
    (req as any).user = { id: payload.sub as string };
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid/expired' });
  }
}
