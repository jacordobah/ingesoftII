import type { TicketPriority } from '../types';
import { mockTiemposRespuesta } from '../data/mockData';

// RF-04: Generador de ID único para tickets
export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TK-${year}-${random}`;
}

// RF-05: Cálculo automático de prioridad según matriz de puntajes
export function calcularPrioridad(puntajeTotal: number): TicketPriority {
  if (puntajeTotal >= 51) return 'critica';
  if (puntajeTotal >= 31) return 'media';
  return 'baja';
}

// RF-06: Asignación de tiempo estimado de respuesta
export function calcularTiempoRespuesta(puntajeTotal: number): string {
  const tiempo = mockTiemposRespuesta.find(
    (t) => puntajeTotal >= t.puntajeMinimo && puntajeTotal <= t.puntajeMaximo
  );
  return tiempo?.tiempo || '48 horas';
}

// Cálculo de puntaje total según matriz (RF-05)
export function calcularPuntajeTotal(
  puntajeSubcategoria: number,
  puntajeUbicacion: number,
  puntajeCantidad: number
): number {
  return puntajeSubcategoria + puntajeUbicacion + puntajeCantidad;
}

// Formatear fecha para mostrar
export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha);
}

// Formatear fecha y hora para mostrar
export function formatearFechaHora(fecha: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha);
}

// Calcular tiempo restante de respuesta
export function calcularTiempoRestante(fechaCreacion: Date, tiempoEstimado: string): string {
  const ahora = new Date();
  const creacion = new Date(fechaCreacion);
  const diffMs = ahora.getTime() - creacion.getTime();
  const diffHoras = diffMs / (1000 * 60 * 60);

  // Parsear tiempo estimado (ej: "48 horas", "24 horas")
  const match = tiempoEstimado.match(/(\d+)\s*horas?/i);
  const horasEstimadas = match ? parseInt(match[1]) : 48;

  const horasRestantes = horasEstimadas - diffHoras;

  if (horasRestantes <= 0) {
    return 'Tiempo excedido';
  }

  if (horasRestantes < 1) {
    const minutosRestantes = Math.round(horasRestantes * 60);
    return `${minutosRestantes} min`;
  }

  return `${Math.round(horasRestantes)} h`;
}
