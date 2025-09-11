import { triggerUnauthorized } from "./authBus";

const API_BASE = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

type Options = RequestInit & { _retried?: boolean };

export async function apiFetch(path: string, opts: Options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });

  if (
    (res.status === 401 || res.status === 403) &&
    !opts._retried &&
    !path.startsWith("/api/auth/")
  ) {
    try {
      const r = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (r.ok) {
        return apiFetch(path, { ...opts, _retried: true });
      }
    } catch {}
    triggerUnauthorized();
  }

  return res;
}
