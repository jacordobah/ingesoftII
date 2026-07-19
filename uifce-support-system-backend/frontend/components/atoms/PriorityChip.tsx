import { Box, type BoxProps } from '@mui/material';
import type { TicketPriority } from '../../types';

interface PriorityChipProps extends Omit<BoxProps, 'children'> {
  priority: TicketPriority;
}

/**
 * Átomo: PriorityChip
 * 
 * Chip que muestra la prioridad de un ticket con color apropiado.
 * 
 * @example
 * ```tsx
 * <PriorityChip priority="critica" />
 * <PriorityChip priority="media" />
 * <PriorityChip priority="baja" />
 * ```
 */
export function PriorityChip({ priority, ...props }: PriorityChipProps) {
  const getStyles = () => {
    switch (priority) {
      case 'critica':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'media':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'baja':
        return { backgroundColor: '#f3f4f6', color: '#374151' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getLabel = () => {
    switch (priority) {
      case 'critica':
        return 'Crítica';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return priority;
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
