import { createTheme, type ThemeOptions } from '@mui/material/styles';

/**
 * Tema personalizado para UIFCE Support System
 * 
 * Colores institucionales:
 * - Primario: #94b43c (Verde institucional)
 * - Secundario: #002f6c (Azul institucional)
 * - Error: #f44336 (Rojo)
 * - Advertencia: #ff9800 (Naranja)
 * - Éxito: #4caf50 (Verde claro)
 */
export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#94b43c',
      light: '#b3c56e',
      dark: '#7a9a30',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#002f6c',
      light: '#004a9e',
      dark: '#00204d',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#002f6c',
      secondary: '#1a1a1a',
      disabled: '#757575',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#002f6c',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#002f6c',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#002f6c',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#002f6c',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#002f6c',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#002f6c',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 47, 108, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 47, 108, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          // No establecer color predeterminado para permitir que cada componente defina su color según el fondo
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease-in-out',
          color: '#002f6c',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease-in-out',
            '&.Mui-focused fieldset': {
              borderColor: '#94b43c',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#94b43c',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.2s ease-in-out',
            color: '#002f6c',
            '&.Mui-focused': {
              color: '#94b43c',
            },
          },
          '& .MuiInputBase-input': {
            color: '#002f6c',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            transition: 'all 0.2s ease-in-out',
            borderColor: 'rgba(0, 47, 108, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94b43c',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94b43c',
            borderWidth: 2,
          },
          '& .MuiSelect-select': {
            color: '#002f6c',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
      defaultProps: {
        sx: {
          color: '#002f6c',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(148, 180, 60, 0.1)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            borderRadius: 12,
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#002f6c',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(148, 180, 60, 0.1)',
            transform: 'rotate(5deg)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
};

export const theme = createTheme(themeOptions);
