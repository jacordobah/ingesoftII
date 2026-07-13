import { Box, Typography } from '@mui/material';
import { TicketInfoCard } from '../molecules';
import type { Ticket } from '../../types';

interface TicketCardListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
  emptyMessage?: string;
}

/**
 * Organismo: TicketCardList
 * 
 * Lista de tarjetas de tickets para vista móvil.
 * 
 * @example
 * ```tsx
 * <TicketCardList tickets={tickets} onTicketClick={handleClick} />
 * ```
 */
export function TicketCardList({ tickets, onTicketClick, emptyMessage = 'No hay tickets para mostrar' }: TicketCardListProps) {
  if (tickets.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tickets.map((ticket) => (
        <TicketInfoCard
          key={ticket.id}
          ticket={ticket}
          onClick={() => onTicketClick?.(ticket)}
        />
      ))}
    </Box>
  );
}
