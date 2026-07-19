// Nota: prioridad, tiempo estimado y puntaje total ya no se calculan aquí.
// El backend (clase Ticket) los calcula al crear/actualizar el ticket.

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
