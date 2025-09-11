import { io } from "socket.io-client";

const ORIGIN = import.meta.env.PROD
  ? window.location.origin
  : import.meta.env.VITE_API_ORIGIN ?? "http://localhost:4000";

export const socket = io(ORIGIN, {
  withCredentials: true,
  transports: ["websocket"],
  path: "/socket.io",
  autoConnect: false,
});

export function reconnectSocket() {
  try {
    socket.disconnect();
  } catch {}
  socket.connect();
}

socket.on("connect", () => console.log("[ws] connected", socket.id));
socket.on("connect_error", (e) => console.log("[ws] connect_error", e.message));
socket.on("disconnect", () => console.log("[ws] disconnected"));
