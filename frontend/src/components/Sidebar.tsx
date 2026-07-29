import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Box from '@mui/material/Box';

export default function Sidebar() {
    const { user } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // 📝 LOG DE AUDITORÍA: Verifica esto en la consola del navegador (F12)
    //System.out.println() // Para mentalidad Spring Boot: esto saldrá en la consola web
    console.log("[Sidebar Audit] Datos del usuario en React:", user);
    console.log("[Sidebar Audit] Rol detectado:", user?.rol);

    // Forzamos minúsculas para blindar contra diferencias de formato del Backend
    const userRole = user?.rol?.toLowerCase();

    const menuItems = userRole === 'usuario'
        ? [
            { text: 'Nueva Solicitud', path: '/usuario/nuevo', icon: <AddIcon /> },
            { text: 'Ver Anteriores', path: '/usuario/historial', icon: <HistoryIcon /> },
        ]
        : userRole === 'tecnico'
            ? [
                { text: 'Tickets', path: '/tecnico/cola', icon: <ListAltIcon /> },
                { text: 'Mis Asignaciones', path: '/tecnico/asignaciones', icon: <AssignmentIcon /> },
                { divider: true },
                { text: 'Nueva Solicitud', path: '/usuario/nuevo', icon: <AddIcon /> },
                { text: 'Ver Anteriores', path: '/usuario/historial', icon: <HistoryIcon /> },
            ]
            : userRole === 'admin'
                ? [
                    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
                    { text: 'Tickets', path: '/admin/cola', icon: <ListAltIcon /> },
                    { text: 'Mis Asignaciones', path: '/tecnico/asignaciones', icon: <AssignmentIcon /> },
                    { divider: true },
                    { text: 'Categorías', path: '/admin/categorias', icon: <CategoryIcon /> },
                    { text: 'Ubicaciones', path: '/admin/ubicaciones', icon: <LocationOnIcon /> },
                    { text: 'Usuarios', path: '/admin/usuarios', icon: <PeopleIcon /> },
                    { text: 'Auditoría', path: '/admin/auditoria', icon: <DescriptionIcon /> },
                    { divider: true },
                    { text: 'Nueva Solicitud', path: '/usuario/nuevo', icon: <AddIcon /> },
                    { text: 'Ver Anteriores', path: '/usuario/historial', icon: <HistoryIcon /> },
                ]
                : [];

    // Si no hay ítems, dejamos un mensaje visual temporal en lugar de retornar null
    if (menuItems.length === 0) {
        return (
            <Box sx={{ p: 2, color: 'red', bgcolor: '#002f6c', minWidth: 240 }}>
                ⚠️ Error Sidebar: Rol "{user?.rol || 'indefinido'}" no reconocido.
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: isMobile ? '100%' : 240,
                bgcolor: '#002f6c',
                color: '#ffffff',
                minHeight: '100vh', // Forzamos que ocupe todo el alto de la pantalla
                display: 'flex',
                flexDirection: 'column',
                borderRight: '4px solid #94b43c',
            }}
        >
            <List sx={{ flexGrow: 1, py: 2 }} role="navigation" aria-label="Menú principal">
                {menuItems.map((item, index) =>
                    item.divider ? (
                        <Divider key={`divider-${index}`} sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                    ) : (
                        <ListItem key={item.path || `item-${index}`} disablePadding>
                            <ListItemButton
                                onClick={() => item.path && navigate(item.path)}
                                selected={location.pathname === item.path}
                                aria-label={item.text}
                                aria-current={location.pathname === item.path ? 'page' : undefined}
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
                                <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }} aria-hidden="true">
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '0.95rem',
                                            fontWeight: location.pathname === item.path ? 700 : 500,
                                            color: 'white',
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                )}
            </List>
        </Box>
    );
}
