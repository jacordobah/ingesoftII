import { Navigate,Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated,loading } = useApp();

  // evitar qeu react me expulse allogin antes de tiempos
  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress sx={{ color: '#94b43c' }} />
        </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

 /*
    funcion que se encontraba y forzava el navigate al login
    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }*/
  // soncronizar con roles a minuscula, como se esta pasando en el back, y como lo administra el front
  if (allowedRoles && user) {
    const userRoleLower = user.rol?.toLowerCase();
    const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

    if (!allowedRolesLower.includes(userRoleLower)) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
