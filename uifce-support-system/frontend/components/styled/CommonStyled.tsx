import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, Card } from '@mui/material';

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
