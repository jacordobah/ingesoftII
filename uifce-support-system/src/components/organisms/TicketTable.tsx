import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { StatusChip, PriorityChip } from '../atoms';
import type { Ticket } from '../../types';

interface TicketTableProps {
  tickets: Ticket[];
  onRowClick?: (ticket: Ticket) => void;
}

/**
 * Organismo: TicketTable
 * 
 * Tabla completa de tickets con información detallada.
 * 
 * @example
 * ```tsx
 * <TicketTable tickets={tickets} onRowClick={handleRowClick} />
 * ```
 */
export function TicketTable({ tickets, onRowClick }: TicketTableProps) {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => onRowClick?.(ticket)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': onRowClick ? { bgcolor: 'rgba(148, 180, 60, 0.1)' } : {},
              }}
            >
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>#{ticket.id}</Typography>
              </TableCell>
              <TableCell>{ticket.descripcion}</TableCell>
              <TableCell>{ticket.categoria}</TableCell>
              <TableCell>{ticket.ubicacion}</TableCell>
              <TableCell>
                <StatusChip status={ticket.estado} />
              </TableCell>
              <TableCell>
                <PriorityChip priority={ticket.prioridad} />
              </TableCell>
              <TableCell>
                {new Date(ticket.fechaCreacion).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
