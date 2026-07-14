import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Molécula: PageHeader
 * 
 * Encabezado de página con título opcional y subtítulo.
 * 
 * @example
 * ```tsx
 * <PageHeader title="Cola de Tickets" subtitle="Gestione los tickets asignados" />
 * ```
 */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Box
      sx={{
        p: { xs: 3, sm: 4 },
        borderBottom: 1,
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#002f6c',
          fontWeight: 'bold',
          mb: 1,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
