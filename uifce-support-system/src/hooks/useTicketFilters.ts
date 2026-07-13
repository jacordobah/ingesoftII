import { useMemo } from 'react';
import type { Ticket, TicketStatus, TicketPriority } from '../types';

interface TicketFilters {
  estado?: TicketStatus;
  prioridad?: TicketPriority;
  tecnicoId?: string;
  usuarioId?: string;
  categoria?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}

/**
 * Hook para filtrar y ordenar tickets
 * 
 * @param tickets - Lista de tickets a filtrar
 * @param filters - Filtros a aplicar
 * @returns Tickets filtrados y ordenados
 * 
 * @example
 * ```tsx
 * const filteredTickets = useTicketFilters(tickets, {
 *   estado: 'abierto',
 *   prioridad: 'critica'
 * });
 * ```
 */
export function useTicketFilters(tickets: Ticket[], filters: TicketFilters = {}) {
  return useMemo(() => {
    let filtrados = [...tickets];

    // Filtrar por estado
    if (filters.estado) {
      filtrados = filtrados.filter((t) => t.estado === filters.estado);
    }

    // Filtrar por prioridad
    if (filters.prioridad) {
      filtrados = filtrados.filter((t) => t.prioridad === filters.prioridad);
    }

    // Filtrar por técnico
    if (filters.tecnicoId) {
      filtrados = filtrados.filter((t) => t.tecnicoAsignado === filters.tecnicoId);
    }

    // Filtrar por usuario
    if (filters.usuarioId) {
      filtrados = filtrados.filter((t) => t.usuarioId === filters.usuarioId);
    }

    // Filtrar por categoría
    if (filters.categoria) {
      filtrados = filtrados.filter((t) => t.categoria === filters.categoria);
    }

    // Filtrar por rango de fechas
    if (filters.fechaInicio) {
      filtrados = filtrados.filter((t) => new Date(t.fechaCreacion) >= filters.fechaInicio!);
    }
    if (filters.fechaFin) {
      filtrados = filtrados.filter((t) => new Date(t.fechaCreacion) <= filters.fechaFin!);
    }

    // Ordenar por prioridad (crítica > media > baja) y luego por fecha
    const prioridadOrder = { critica: 0, media: 1, baja: 2 };
    return filtrados.sort((a, b) => {
      if (prioridadOrder[a.prioridad] !== prioridadOrder[b.prioridad]) {
        return prioridadOrder[a.prioridad] - prioridadOrder[b.prioridad];
      }
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
  }, [tickets, filters]);
}
