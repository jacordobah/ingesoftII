export interface User {
  id: string;
  email: string;
  password: string;
  nombre: string;
  rol: 'usuario' | 'tecnico' | 'admin';
  activo: boolean;
  fechaCreacion: Date;
}

export interface Ticket {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  categoria: string;
  subcategoria: string;
  ubicacion: string;
  edificio: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'critica';
  estado: 'abierto' | 'en_proceso' | 'cerrado';
  tecnicoAsignado?: string;
  fechaCreacion: Date;
  fechaAsignacion?: Date;
  fechaResolucion?: Date;
  tiempoEstimado: number;
  comentarios?: Comentario[];
}

export interface Comentario {
  id: string;
  ticketId: string;
  usuarioId: string;
  usuarioNombre: string;
  texto: string;
  fechaCreacion: Date;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Subcategoria {
  id: string;
  categoriaId: string;
  nombre: string;
  puntaje: number;
  descripcion?: string;
}

export interface Ubicacion {
  id: string;
  nombre: string;
  edificio: string;
  puntaje: number;
}

export interface Edificio {
  nombre: string;
}

// Extendemos el tipo Request de Express
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      rol: string;
    };
  }
}
