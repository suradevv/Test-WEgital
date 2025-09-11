import type { Server as IOServer } from 'socket.io';

declare global {
  namespace Express {
    interface Application {
      get(name: 'io'): IOServer;
      set(name: 'io', value: IOServer): this;
    }
    interface Request {
      user?: { id: string; email?: string };
    }
  }
}
export {};
