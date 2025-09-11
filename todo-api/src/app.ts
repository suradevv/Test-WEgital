import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requireAuth } from "./auth/auth.middleware";
import * as Auth from "./auth/auth.controller";
import todoRoutes from "./todos/todo.routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // auth routes
  app.post("/api/auth/register", Auth.register);
  app.post("/api/auth/login", Auth.login);
  app.post("/api/auth/refresh", Auth.refresh);
  app.post("/api/auth/logout", Auth.logout);

  // protected
  app.get("/api/me", requireAuth, Auth.me);

  app.use("/api/todos", requireAuth, todoRoutes);

  return app;
}
