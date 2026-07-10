import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import CrearTicket from './pages/usuario/CrearTicket';
import HistorialTickets from './pages/usuario/HistorialTickets';
import ConfirmacionTicket from './pages/usuario/ConfirmacionTicket';
import ColaTickets from './pages/admin/ColaTickets';
import Dashboard from './pages/admin/Dashboard';
import Auditoria from './pages/admin/Auditoria';
import MisAsignaciones from './pages/tecnico/MisAsignaciones';
import GestionCategorias from './pages/admin/GestionCategorias';
import GestionUbicaciones from './pages/admin/GestionUbicaciones';
import GestionUsuarios from './pages/admin/GestionUsuarios';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas con Layout */}
          <Route element={<ProtectedRoute><Layout><Outlet /></Layout></ProtectedRoute>}>
            {/* Redirección según rol */}
            <Route index element={<RoleBasedRedirect />} />

            {/* Rutas de usuario */}
            <Route path="usuario/nuevo" element={<CrearTicket />} />
            <Route path="usuario/confirmacion" element={<ConfirmacionTicket />} />
            <Route path="usuario/historial" element={<HistorialTickets />} />

            {/* Rutas de técnico */}
            <Route path="tecnico/cola" element={<ColaTickets />} />
            <Route path="tecnico/asignaciones" element={<MisAsignaciones />} />

            {/* Rutas de admin */}
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/cola" element={<ColaTickets />} />
            <Route path="admin/cola-tickets" element={<ColaTickets />} />
            <Route path="admin/auditoria" element={<Auditoria />} />
            <Route path="admin/categorias" element={<GestionCategorias />} />
            <Route path="admin/ubicaciones" element={<GestionUbicaciones />} />
            <Route path="admin/usuarios" element={<GestionUsuarios />} />
            <Route path="admin/matriz" element={<ColaTickets />} />
            <Route path="admin/metricas" element={<ColaTickets />} />
            <Route path="admin/tickets" element={<ColaTickets />} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

function RoleBasedRedirect() {
  const { user } = useApp();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.rol) {
    case 'usuario':
      return <Navigate to="/usuario/nuevo" replace />;
    case 'tecnico':
      return <Navigate to="/tecnico/cola" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/usuario/nuevo" replace />;
  }
}

export default App;
