import { io } from 'socket.io-client';

// ใช้ VITE_API_ORIGIN ถ้าตั้งไว้, ไม่งั้น fallback ไป http://localhost:4000
export const socket = io(import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:4000', {
  withCredentials: true,
  transports: ['websocket'],
  path: '/socket.io',
});

// optional logs ช่วยดีบั๊ก
socket.on('connect',      () => console.log('[ws] connected', socket.id));
socket.on('connect_error',(e) => console.log('[ws] connect_error', e.message));
socket.on('disconnect',   () => console.log('[ws] disconnected'));
