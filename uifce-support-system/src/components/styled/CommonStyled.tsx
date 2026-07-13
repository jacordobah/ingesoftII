import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, Button, Card } from '@mui/material';

/**
 * Styled Components Reutilizables
 * 
 * Componentes estilizados para reducir la duplicación de estilos
 * y mejorar la consistencia visual en toda la aplicación.
 */

// Paper estándar con padding responsive
export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// Paper para páginas principales
export const MainPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

// Box de encabezado de página
export const PageHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

// Título de página
export const PageTitle = styled(Typography)(({ theme }) => ({
  color: '#002f6c',
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  fontSize: '1.25rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}));

// Subtítulo de página
export const PageSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}));

// Botón primario institucional
export const PrimaryButton = styled(Button)(() => ({
  backgroundColor: '#94b43c',
  color: '#002f6c',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#7a9a30',
  },
}));

// Botón secundario
export const SecondaryButton = styled(Button)({
  color: '#94b43c',
  borderColor: '#94b43c',
  '&:hover': {
    borderColor: '#7a9a30',
    backgroundColor: 'rgba(148, 180, 60, 0.1)',
  },
});

// Botón de error
export const ErrorButton = styled(Button)({
  borderColor: '#f44336',
  color: '#f44336',
  '&:hover': {
    borderColor: '#d32f2f',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
});

// Card estándar
export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

// Card con hover effect
export const HoverCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

// Box de contenido con padding responsive
export const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// Box de filtros
export const FilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

// Chip de estado
export const StatusChip = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'abierto' | 'en_proceso' | 'cerrado' }>(({ status }) => ({
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  ...(status === 'abierto' && {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
  }),
  ...(status === 'en_proceso' && {
    backgroundColor: '#fffbeb',
    color: '#92400e',
  }),
  ...(status === 'cerrado' && {
    backgroundColor: '#f0fdf4',
    color: '#166534',
  }),
}));

// Chip de prioridad
export const PriorityChip = styled('div', {
  shouldForwardProp: (prop) => prop !== 'priority',
})<{ priority: 'critica' | 'media' | 'baja' }>(({ priority }) => ({
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  ...(priority === 'critica' && {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  }),
  ...(priority === 'media' && {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  }),
  ...(priority === 'baja' && {
    backgroundColor: '#f3f4f6',
    color: '#374151',
  }),
}));
