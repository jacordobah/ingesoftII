import { Card, CardContent, Box, Typography } from '@mui/material';
import { StatusChip, PriorityChip } from '../atoms';
import type { Ticket } from '../../types';

interface TicketInfoCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

/**
 * Molécula: TicketInfoCard
 * 
 * Tarjeta que muestra información resumida de un ticket.
 * 
 * @example
 * ```tsx
 * <TicketInfoCard ticket={ticket} onClick={handleClick} />
 * ```
 */
export function TicketInfoCard({ ticket, onClick }: TicketInfoCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        borderRadius: 1,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          boxShadow: 4,
        } : {},
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
            #{ticket.id}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <StatusChip status={ticket.estado} />
            <PriorityChip priority={ticket.prioridad} />
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          {ticket.descripcion}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {ticket.categoria}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(ticket.fechaCreacion).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
