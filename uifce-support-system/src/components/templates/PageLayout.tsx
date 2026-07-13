import { Box, Paper } from '@mui/material';
import { PageHeader } from '../molecules';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Plantilla: PageLayout
 * 
 * Layout base para páginas con encabezado y contenido.
 * 
 * @example
 * ```tsx
 * <PageLayout title="Cola de Tickets" subtitle="Gestión de tickets">
 *   <TicketTable tickets={tickets} />
 * </PageLayout>
 * ```
 */
export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
        <PageHeader title={title} subtitle={subtitle} />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
