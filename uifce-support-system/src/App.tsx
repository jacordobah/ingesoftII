import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { AppProvider, useApp } from './contexts/AppContext';
import { theme } from './theme';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading de componentes para code splitting
const Login = lazy(() => import('./pages/auth/Login'));
const CrearTicket = lazy(() => import('./pages/usuario/CrearTicket'));
const HistorialTickets = lazy(() => import('./pages/usuario/HistorialTickets'));
const ConfirmacionTicket = lazy(() => import('./pages/usuario/ConfirmacionTicket'));
const ColaTickets = lazy(() => import('./pages/admin/ColaTickets'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Auditoria = lazy(() => import('./pages/admin/Auditoria'));
const MisAsignaciones = lazy(() => import('./pages/tecnico/MisAsignaciones'));
const GestionCategorias = lazy(() => import('./pages/admin/GestionCategorias'));
const GestionUbicaciones = lazy(() => import('./pages/admin/GestionUbicaciones'));
const GestionUsuarios = lazy(() => import('./pages/admin/GestionUsuarios'));

// Componente de loading
function LoadingFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <CircularProgress sx={{ color: '#94b43c' }} />
    </Box>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
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
