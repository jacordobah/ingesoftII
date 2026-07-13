import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showSidebar = user?.rol === 'usuario' || user?.rol === 'tecnico' || user?.rol === 'admin';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    </Box>
  );
}
