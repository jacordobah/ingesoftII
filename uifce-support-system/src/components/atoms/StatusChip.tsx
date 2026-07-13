import { Box, type BoxProps } from '@mui/material';
import type { TicketStatus } from '../../types';

interface StatusChipProps extends Omit<BoxProps, 'children'> {
  status: TicketStatus;
}

/**
 * Átomo: StatusChip
 * 
 * Chip que muestra el estado de un ticket con color apropiado.
 * 
 * @example
 * ```tsx
 * <StatusChip status="abierto" />
 * <StatusChip status="en_proceso" />
 * <StatusChip status="cerrado" />
 * ```
 */
export function StatusChip({ status, ...props }: StatusChipProps) {
  const getStyles = () => {
    switch (status) {
      case 'abierto':
        return { backgroundColor: '#eff6ff', color: '#1e40af' };
      case 'en_proceso':
        return { backgroundColor: '#fffbeb', color: '#92400e' };
      case 'cerrado':
        return { backgroundColor: '#f0fdf4', color: '#166534' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'abierto':
        return 'Abierto';
      case 'en_proceso':
        return 'En Proceso';
      case 'cerrado':
        return 'Cerrado';
      default:
        return status;
    }
  };

  return (
    <Box
      {...props}
      sx={{
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        display: 'inline-block',
        ...getStyles(),
        ...props.sx,
      }}
    >
      {getLabel()}
    </Box>
  );
}
