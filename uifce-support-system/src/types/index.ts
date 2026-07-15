// Roles de usuario (RF-32)
export type UserRole = 'usuario' | 'tecnico' | 'admin';

// Estados del ticket (RF-13)
export type TicketStatus = 'abierto' | 'en_proceso' | 'cerrado';

// Prioridades del ticket (RF-05)
export type TicketPriority = 'baja' | 'media' | 'critica';

// Usuario
// Todos los IDs del backend son Long autogenerado, excepto el de Ticket
// (String, generado como TK-YYYYMMDD-XXXX por TicketIdGenerator).
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar?: string;
}

// Categoría de servicio (RF-17)
export interface Categoria {
  id: number;
  nombre: string;
  oculto?: boolean;
}

// Subcategoría de servicio (RF-17)
export interface Subcategoria {
  id: number;
  categoriaId: number;
  nombre: string;
  puntaje: number;
  oculto?: boolean;
}

// Edificio (backend: LocationController /edificios)
export interface Edificio {
  id: number;
  numero: number;
  nombre: string;
  oculto?: boolean;
}

// Oficina dentro de un edificio, con puntaje (RF-05, Tabla 14)
// (antes "Ubicacion" en el mock; en el backend es Office, hija de Building)
export interface Ubicacion {
  id: number;
  edificioId: number;
  edificio: string;
  nombre: string;
  puntaje: number;
  oculto?: boolean;
}

// Cantidad de equipos con puntaje (RF-05, Tabla 15)
export interface CantidadEquipos {
  rango: string;
  puntaje: number;
}

// Ticket (RF-02, RF-03, RF-04)
// puntaje/prioridad/tiempoEstimado los calcula el backend (clase Ticket), no el front.
export interface Ticket {
  id: string;
  // El backend no expone el id del solicitante en la respuesta del ticket
  // (solo nombre/correo); usar usuarioEmail para identificarlo.
  usuarioId?: number;
  usuarioNombre: string;
  usuarioEmail: string;
  categoria: string;
  subcategoria: string;
  ubicacion: string;
  cantidadEquipos: number;
  telefonoContacto: string;
  descripcion: string;
  puntajeTotal: number;
  prioridad: TicketPriority;
  tiempoEstimado: string;
  estado: TicketStatus;
  tecnicoAsignado?: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaResolucion?: Date;
  comentarios: Comentario[];
}

// Comentario de seguimiento (RF-14)
export interface Comentario {
  id: string;
  ticketId: string;
  autor: string;
  autorRol: UserRole;
  contenido: string;
  fecha: Date;
}

// Auditoría (RF-25 a RF-31)
export type AuditoriaAccion = 
  | 'creacion_ticket'
  | 'asignacion_ticket'
  | 'reasignacion_ticket'
  | 'cambio_estado'
  | 'modificacion_categoria'
  | 'inclusion_comentario'
  | 'cierre_ticket';

export interface Auditoria {
  id: string;
  ticketId: string;
  accion: AuditoriaAccion;
  usuario: string;
  usuarioRol: UserRole;
  fecha: Date;
  detalles: {
    estadoAnterior?: string;
    estadoNuevo?: string;
    tecnicoAnterior?: string;
    tecnicoNuevo?: string;
    categoriaAnterior?: string;
    categoriaNueva?: string;
    comentario?: string;
    motivo?: string;
  };
}

// Matriz de puntajes (RF-18)
export interface MatrizPuntajes {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  ubicaciones: Ubicacion[];
  cantidadesEquipos: CantidadEquipos[];
  tiemposRespuesta: TiempoRespuesta[];
}

// Tiempo de respuesta según puntaje (RF-06)
export interface TiempoRespuesta {
  puntajeMinimo: number;
  puntajeMaximo: number;
  tiempo: string;
  prioridad: TicketPriority;
}

// Métricas (RF-19 a RF-23)
export interface Metricas {
  ticketsAtendidos: number;
  tiempoPromedioRespuesta: number;
  ticketsPorEstado: Record<TicketStatus, number>;
  ticketsPorTecnico: Record<string, number>;
  ticketsPorCategoria: Record<string, number>;
}

// Filtros para reportes (RF-19, RF-24)
export interface ReporteFiltros {
  fechaInicio?: Date;
  fechaFin?: Date;
  tecnicoId?: string;
  categoria?: string;
  estado?: TicketStatus;
}
