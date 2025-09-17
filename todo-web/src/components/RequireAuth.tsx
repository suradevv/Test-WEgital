import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Spin, App as AntdApp } from 'antd';
import { apiFetch } from '../lib/api';
import { onUnauthorized } from '../lib/authBus';

const API_BASE = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE || '';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);
  const nav = useNavigate();
  const loc = useLocation();
  const { message } = AntdApp.useApp();

  const doLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { }
    message.warning('Session expired. Please sign in again.');
    nav('/login', { replace: true, state: { from: loc.pathname + loc.search } });
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await apiFetch('/api/me');
      if (!alive) return;
      setOk(r.ok);
      setChecking(false);
      if (!r.ok) {
        doLogout();
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const off = onUnauthorized(doLogout);
    return off;
  }, []);

  if (checking) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <Spin />
      </div>
    );
  }

  return ok ? <>{children}</> : <Navigate to="/login" replace />;
}
