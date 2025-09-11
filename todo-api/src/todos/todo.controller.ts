// src/todos/todo.controller.ts
import { Request, Response } from 'express';
import type { Server as IOServer } from 'socket.io';
import { AppDataSource } from '../db/data-source';
import { Todo } from '../entities/todo.entity';

const todoRepo = () => AppDataSource.getRepository(Todo);

// ---- helpers for realtime ----
const ioFrom = (req: Request) => req.app.get('io') as IOServer;
const roomOf = (userId: string) => `user:${userId}`;
const pick = (t: Todo) => {
  const { id, title, detail, done, createdAt, updatedAt } = t;
  return { id, title, detail, done, createdAt, updatedAt };
};
function emitTo(req: Request, userId: string, event: 'todo:created' | 'todo:updated' | 'todo:deleted', payload: any) {
  const io = ioFrom(req);
  const room = roomOf(userId);
  io.to(room).emit(event, payload);
  console.log(`[ws] emit ${event} -> ${room}`, payload?.id ?? payload);
}

export async function listTodos(req: Request, res: Response) {
  const userId = (req as any).user?.id as string;
  const items = await todoRepo().find({
    where: { userId },
    order: { createdAt: 'DESC' },
  });
  res.json(items.map(pick));
}

export async function createTodo(req: Request, res: Response) {
  const userId = (req as any).user?.id as string;
  const { title, detail } = req.body as { title?: string; detail?: string };
  if (!title?.trim()) return res.status(400).json({ message: 'title required' });

  const item = todoRepo().create({
    userId,
    title: title.trim(),
    detail: detail?.trim() || null,
    done: false,
  });
  await todoRepo().save(item);

  emitTo(req, userId, 'todo:created', pick(item));
  res.status(201).json(pick(item));
}

export async function updateTodo(req: Request, res: Response) {
  const userId = (req as any).user?.id as string;
  const { id } = req.params;
  const { title, detail } = req.body as { title?: string; detail?: string };

  const item = await todoRepo().findOne({ where: { id, userId } });
  if (!item) return res.status(404).json({ message: 'Not found' });

  if (typeof title === 'string') item.title = title.trim();
  if (typeof detail === 'string') item.detail = detail.trim() || null;

  await todoRepo().save(item);

  emitTo(req, userId, 'todo:updated', pick(item));
  res.json(pick(item));
}

export async function setDone(req: Request, res: Response) {
  const userId = (req as any).user?.id as string;
  const { id } = req.params;
  const { done } = req.body as { done?: boolean };
  if (typeof done !== 'boolean') return res.status(400).json({ message: 'done must be boolean' });

  const item = await todoRepo().findOne({ where: { id, userId } });
  if (!item) return res.status(404).json({ message: 'Not found' });

  item.done = done;
  await todoRepo().save(item);

  emitTo(req, userId, 'todo:updated', pick(item));
  res.json(pick(item));
}

export async function removeTodo(req: Request, res: Response) {
  const userId = (req as any).user?.id as string;
  const { id } = req.params;

  const item = await todoRepo().findOne({ where: { id, userId } });
  if (!item) return res.status(404).json({ message: 'Not found' });

  await todoRepo().remove(item);

  emitTo(req, userId, 'todo:deleted', id);
  res.status(204).end();
}
