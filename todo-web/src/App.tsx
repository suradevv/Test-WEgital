import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import RequireAuth from './components/RequireAuth';
import TodosPage from './pages/Todos';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      <Route path="/todos" element={<RequireAuth><TodosPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
