export function generateTicketId(existingIds = []) {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const sequence = Math.floor(Math.random() * 9000) + 1000;
    const id = `TK-${year}-${sequence}`;
    if (!existingIds.includes(id)) return id;
  }

  return `TK-${year}-${Date.now()}`;
}

export function calcularPrioridad(puntajeTotal) {
  if (puntajeTotal >= 51) return 'critica';
  if (puntajeTotal >= 31) return 'media';
  return 'baja';
}

export function calcularTiempoRespuesta(puntajeTotal) {
  if (puntajeTotal >= 51) return '15 dias';
  if (puntajeTotal >= 31) return '72 horas';
  return '48 horas';
}

export function calculateEquipmentScore(cantidadEquipos) {
  const quantity = Number(cantidadEquipos);
  if (quantity >= 1 && quantity <= 3) return 5;
  if (quantity >= 4 && quantity <= 14) return 12;
  if (quantity >= 15 && quantity <= 30) return 20;
  if (quantity > 30) return 30;
  return 0;
}
