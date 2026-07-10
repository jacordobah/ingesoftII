// Roles de usuario (RF-32)
export type UserRole = 'usuario' | 'tecnico' | 'admin';

// Estados del ticket (RF-13)
export type TicketStatus = 'abierto' | 'en_proceso' | 'cerrado';

// Prioridades del ticket (RF-05)
export type TicketPriority = 'baja' | 'media' | 'critica';

// Usuario
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar?: string;
}

// Categoría de servicio (RF-17)
export interface Categoria {
  id: string;
  nombre: string;
  oculto?: boolean;
}

// Subcategoría de servicio (RF-17)
export interface Subcategoria {
  id: string;
  categoriaId: string;
  nombre: string;
  puntaje: number;
  oculto?: boolean;
}

// Ubicación con puntaje (RF-05, Tabla 14)
export interface Ubicacion {
  id: string;
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
export interface Ticket {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  categoria: string;
  subcategoria: string;
  ubicacion: string;
  cantidadEquipos: string;
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
