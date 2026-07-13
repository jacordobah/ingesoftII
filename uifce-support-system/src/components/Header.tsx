import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#002f6c',
        borderBottom: '4px solid #94b43c',
        height: { xs: 56, sm: 64 },
      }}
    >
      <Toolbar sx={{ height: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
        {/* Botón de menú hamburguesa */}
        {showMenuButton && (
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo y Título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexGrow: 1 }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' }, color: '#ffffff' }}>
              UIFCE - Soporte Técnico
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: { xs: 'none', sm: 'block' }, color: '#ffffff' }}>
              Facultad de Ciencias Económicas
            </Typography>
          </Box>
        </Box>

        {/* Info del Usuario */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#ffffff' }}>
                {user.nombre}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem', color: '#ffffff' }}>
                {user.rol === 'admin' ? 'Admin' : user.rol === 'tecnico' ? 'Técnico' : 'Usuario'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                ml: { xs: 0, sm: 1 },
                color: '#ffffff',
                borderColor: '#ffffff',
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 0.75 },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: '#ffffff',
                  color: '#ffffff',
                },
              }}
            >
              Salir
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
