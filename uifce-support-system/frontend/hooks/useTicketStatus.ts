import type { TicketStatus, TicketPriority } from '../types';

/**
 * Hook para obtener colores y labels de estados de tickets
 * 
 * @returns Objeto con funciones para obtener colores y labels
 * 
 * @example
 * ```tsx
 * const { getStatusColor, getStatusLabel } = useTicketStatus();
 * const color = getStatusColor('abierto');
 * const label = getStatusLabel('abierto');
 * ```
 */
export function useTicketStatus() {
  const getStatusColor = (estado: TicketStatus) => {
    switch (estado) {
      case 'abierto':
        return { bgcolor: '#eff6ff', color: '#1e40af' };
      case 'en_proceso':
        return { bgcolor: '#fffbeb', color: '#92400e' };
      case 'cerrado':
        return { bgcolor: '#f0fdf4', color: '#166534' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusLabel = (estado: TicketStatus) => {
    switch (estado) {
      case 'abierto':
        return 'Abierto';
      case 'en_proceso':
        return 'En Proceso';
      case 'cerrado':
        return 'Cerrado';
      default:
        return estado;
    }
  };

  const getPriorityColor = (prioridad: TicketPriority) => {
    switch (prioridad) {
      case 'critica':
        return { bgcolor: '#fee2e2.', color: '#991b1b' };
      case 'media':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'baja':
        return { bgcolor: '#f3f4f6', color: '#374151' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getPriorityLabel = (prioridad: TicketPriority) => {
    switch (prioridad) {
      case 'critica':
        return 'Crítica';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return prioridad;
    }
  };

  return {
    getStatusColor,
    getStatusLabel,
    getPriorityColor,
    getPriorityLabel,
  };
}
