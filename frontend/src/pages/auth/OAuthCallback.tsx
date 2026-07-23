import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { ENDPOINTS, apiRequest } from '../../config/api';
import type { User } from '../../types';

// Destino de defaultSuccessUrl en SecurityConfig tras el login con Google.
// En ese punto ya existe la cookie de sesion de Spring Security pero el
// AppContext del front todavia no sabe quien inicio sesion, asi que se
// consulta /usuarios/me (autenticado via esa misma cookie) para completarlo.
export default function OAuthCallback() {
  const { setSessionUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest<User>(ENDPOINTS.usuarios.me)
      .then((user) => {
        setSessionUser(user);
        navigate('/', { replace: true });
      })
      .catch(() => {
        navigate('/login?error=true', { replace: true });
      });
  }, [setSessionUser, navigate]);

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
      <CircularProgress sx={{ color: '#002f6c' }} />
    </Box>
  );
}
