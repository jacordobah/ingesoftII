import { Box, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showSidebar = user?.rol === 'usuario' || user?.rol === 'tecnico' || user?.rol === 'admin';
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = user?.rol === 'usuario'
    ? [
        { text: 'Nueva Solicitud', path: '/usuario/nuevo', icon: <AddIcon /> },
        { text: 'Ver Anteriores', path: '/usuario/historial', icon: <HistoryIcon /> },
      ]
    : user?.rol === 'tecnico'
    ? [
        { text: 'Nueva Solicitud', path: '/usuario/nuevo', icon: <AddIcon /> },
        { text: 'Ver Anteriores', path: '/usuario/historial', icon: <HistoryIcon /> },
        { divider: true },
        { text: 'Cola de Tickets', path: '/tecnico/cola', icon: <ListAltIcon /> },
        { text: 'Mis Asignaciones', path: '/tecnico/asignaciones', icon: <AssignmentIcon /> },
      ]
    : user?.rol === 'admin'
    ? [
        { text: 'Nueva Solicitud', path: '/usuario/nuevo', icon: <AddIcon /> },
        { text: 'Ver Anteriores', path: '/usuario/historial', icon: <HistoryIcon /> },
        { divider: true },
        { text: 'Cola de Tickets', path: '/tecnico/cola', icon: <ListAltIcon /> },
        { text: 'Mis Asignaciones', path: '/tecnico/asignaciones', icon: <AssignmentIcon /> },
        { divider: true },
        { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { text: 'Categorías', path: '/admin/categorias', icon: <CategoryIcon /> },
        { text: 'Ubicaciones', path: '/admin/ubicaciones', icon: <LocationOnIcon /> },
        { text: 'Usuarios', path: '/admin/usuarios', icon: <PeopleIcon /> },
      ]
    : [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5', overflow: 'hidden' }}>
      <Header onMenuClick={handleDrawerToggle} showMenuButton={showSidebar && isMobile} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {showSidebar && !isMobile && <Sidebar />}
        <Box component="main" sx={{ flexGrow: 1, width: showSidebar && !isMobile ? 'calc(100% - 240px)' : '100%', overflow: 'auto' }}>
          {children}
        </Box>
      </Box>

      {/* Drawer móvil */}
      {showSidebar && isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              bgcolor: '#002f6c',
              color: 'white',
            },
          }}
        >
          <List sx={{ py: 2 }}>
            {menuItems.map((item, index) =>
              item.divider ? (
                <Divider key={`divider-${index}`} sx={{ my: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
              ) : (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      mx: 2,
                      my: 0.5,
                      borderRadius: 1,
                      bgcolor: location.pathname === item.path ? 'rgba(148, 180, 60, 0.2)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(148, 180, 60, 0.1)',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(148, 180, 60, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(148, 180, 60, 0.3)',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.95rem',
                          fontWeight: location.pathname === item.path ? 600 : 400,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Drawer>
      )}
    </Box>
  );
}
