import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Card, List, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import SettingsBar from '../components/SettingsBar';
import { apiFetch } from '../lib/api';
import TodoEditor from '../components/todos/TodoEditor';
import TodoItem from '../components/todos/TodoItem';
import TodoToolbar from '../components/todos/TodoToolbar';
import type { Todo, Filter } from '../types/todo';

// realtime helpers
import { tabBus, sendCreated, sendUpdated, sendDeleted } from '../lib/tabbus';
import { socket } from '../lib/realtime';

export default function TodosPage() {
  const { t } = useTranslation(['todos']);
  const { message } = AntdApp.useApp();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editor, setEditor] = useState<{ open: boolean; edit?: Todo }>({ open: false });

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((x) => x.done).length;
    return { total, done, active: total - done };
  }, [todos]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = todos;
    if (filter === 'active') list = list.filter((x) => !x.done);
    if (filter === 'done') list = list.filter((x) => x.done);
    if (s) list = list.filter((x) => x.title.toLowerCase().includes(s) || (x.detail || '').toLowerCase().includes(s));
    return list;
  }, [q, filter, todos]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/todos');
      if (!res.ok) throw new Error(await res.text());
      setTodos(await res.json());
    } catch {
      message.error(t('todos:loadFail'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ✅ Socket.IO: ฟังอีเวนต์แล้วอัปเดต state
  useEffect(() => {
    const onCreated = (item: Todo) =>
      setTodos(prev => [item, ...prev.filter(x => x.id !== item.id)]);
    const onUpdated = (item: Todo) =>
      setTodos(prev => prev.map(x => x.id === item.id ? item : x));
    const onDeleted = (id: string) =>
      setTodos(prev => prev.filter(x => x.id !== id));

    socket.on('todo:created', onCreated);
    socket.on('todo:updated', onUpdated);
    socket.on('todo:deleted', onDeleted);

    return () => {
      socket.off('todo:created', onCreated);
      socket.off('todo:updated', onUpdated);
      socket.off('todo:deleted', onDeleted);
    };
  }, []);

  // ✅ BroadcastChannel: ซิงก์หลายแท็บบนเครื่องเดียว
  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const { type, payload } = ev.data || {};
      if (type === 'created') setTodos(p => [payload, ...p.filter(x => x.id !== payload.id)]);
      if (type === 'updated') setTodos(p => p.map(x => x.id === payload.id ? payload : x));
      if (type === 'deleted') setTodos(p => p.filter(x => x.id !== payload));
    };
    tabBus.addEventListener('message', onMsg);
    return () => tabBus.removeEventListener('message', onMsg);
  }, []);

  const createTodo = async (payload: Pick<Todo, 'title' | 'detail'>) => {
    try {
      const res = await apiFetch('/api/todos', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const item: Todo = await res.json();
      setTodos(prev => [item, ...prev]);
      sendCreated(item); // แจ้งแท็บอื่น
      message.success(t('todos:createOk'));
    } catch { message.error(t('todos:createFail')); }
  };

  const updateTodo = async (id: string, payload: Pick<Todo, 'title' | 'detail'>) => {
    try {
      const res = await apiFetch(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const item: Todo = await res.json();
      setTodos(prev => prev.map(x => x.id === id ? item : x));
      sendUpdated(item); // แจ้งแท็บอื่น
      message.success(t('todos:updateOk'));
    } catch { message.error(t('todos:updateFail')); }
  };

  const toggleDone = async (id: string, done: boolean) => {
    setTodos(prev => prev.map(x => x.id === id ? { ...x, done } : x)); // optimistic
    try {
      const res = await apiFetch(`/api/todos/${id}/done`, { method: 'PATCH', body: JSON.stringify({ done }) });
      if (!res.ok) throw new Error(await res.text());

      // ถ้า API ไม่คืน item ล่าสุด ก็ broadcast จาก state ที่มีอยู่
      const current = todos.find(x => x.id === id);
      if (current) sendUpdated({ ...current, done } as Todo);
    } catch {
      setTodos(prev => prev.map(x => x.id === id ? { ...x, done: !done } : x)); // rollback
      message.error(t('todos:toggleFail'));
    }
  };

  const removeTodo = async (id: string) => {
    const prev = todos;
    setTodos(prev.filter(x => x.id !== id)); // optimistic
    try {
      const res = await apiFetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      sendDeleted(id); // แจ้งแท็บอื่น
      message.success(t('todos:deleteOk'));
    } catch {
      setTodos(prev); // rollback
      message.error(t('todos:deleteFail'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: token.colorBgLayout,
      padding: 16,
      paddingTop: 72,
    }}>
      <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 50 }}>
        <SettingsBar />
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <TodoToolbar
          stats={stats}
          q={q}
          setQ={setQ}
          filter={filter}
          setFilter={setFilter}
          onReload={load}
          onAdd={() => setEditor({ open: true })}
        />

        <Card style={{ marginTop: 16, boxShadow: token.boxShadowTertiary }}>
          <List
            loading={loading}
            dataSource={filtered}
            locale={{ emptyText: t('todos:empty') }}
            renderItem={(item) => (
              <TodoItem
                item={item}
                dividerColor={token.colorBorderSecondary}
                onEdit={(it) => setEditor({ open: true, edit: it })}
                onToggle={toggleDone}
                onDelete={removeTodo}
              />
            )}
          />
        </Card>
      </div>

      <TodoEditor
        open={editor.open}
        initial={editor.edit}
        onCancel={() => setEditor({ open: false })}
        onSubmit={async (payload) => {
          if (editor.edit) await updateTodo(editor.edit.id, payload);
          else await createTodo(payload);
          setEditor({ open: false });
        }}
      />
    </div>
  );
}
