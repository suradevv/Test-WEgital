// src/index.ts
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server as IOServer } from "socket.io";
import cookie from "cookie";

import { createApp } from "./app";
import { AppDataSource } from "./db/data-source";
import { verifyAccess } from "./auth/jwt";

(async () => {
  await AppDataSource.initialize();

  const app = createApp();
  const server = http.createServer(app);

  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim());

  const io = new IOServer(server, {
    cors: { origin: origins, credentials: true },
    path: "/socket.io",
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie ?? "");
      const token = cookies["accessToken"];
      if (!token) return next(new Error("unauthorized"));
      const payload = verifyAccess(token) as { sub: string };
      socket.join(`user:${payload.sub}`); // ห้องของ user
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  app.set("io", io); // << ให้ controller เอาไปใช้

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const PORT = Number(process.env.PORT ?? 4000);
  server.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
})();
