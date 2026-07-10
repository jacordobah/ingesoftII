import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Ticket, Auditoria, TicketStatus } from '../types';
import { mockTickets, mockAuditoria, mockUsers } from '../data/mockData';
import { generateTicketId, calcularPrioridad, calcularTiempoRespuesta, calcularPuntajeTotal } from '../utils/ticketUtils';

interface AppContextType {
  // Estado
  user: User | null;
  tickets: Ticket[];
  auditoria: Auditoria[];
  users: User[];
  isAuthenticated: boolean;

  // Acciones de autenticación (RF-01)
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Acciones de tickets (RF-02, RF-03, RF-04, RF-05, RF-06)
  crearTicket: (data: {
    categoria: string;
    subcategoria: string;
    ubicacion: string;
    cantidadEquipos: string;
    telefonoContacto: string;
    descripcion: string;
    puntajeSubcategoria: number;
    puntajeUbicacion: number;
    puntajeCantidad: number;
  }) => Ticket;

  // Acciones de gestión de tickets (RF-11, RF-12, RF-13, RF-14)
  asignarTicket: (ticketId: string, tecnicoId: string) => void;
  reasignarTicket: (ticketId: string, nuevoTecnicoId: string) => void;
  actualizarEstadoTicket: (ticketId: string, nuevoEstado: TicketStatus) => void;
  agregarComentario: (ticketId: string, contenido: string) => void;
  actualizarTicketCompleto: (ticketId: string, nuevoEstado: TicketStatus, nuevoTecnico: string, comentario: string) => void;
  actualizarCategoriaTicket: (ticketId: string, nuevaCategoria: string, nuevaSubcategoria: string, nuevaUbicacion: string, puntajeSubcategoria: number, puntajeUbicacion: number) => void;

  // Utilidades
  getTicketsByUsuario: (usuarioId: string) => Ticket[];
  getTicketsByTecnico: (tecnicoId: string) => Ticket[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [auditoria, setAuditoria] = useState<Auditoria[]>(mockAuditoria);
  const [users] = useState<User[]>(mockUsers);

  const isAuthenticated = user !== null;

  // RF-01: Simular autenticación OAuth con correo institucional
  const login = (email: string, _password: string): boolean => {
    // Validar que sea correo institucional UNAL
    if (!email.endsWith('@unal.edu.co')) {
      return false;
    }

    // Buscar usuario en mock data
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }

    // Si no existe, crear usuario temporal
    const newUser: User = {
      id: `USR-${Date.now()}`,
      nombre: email.split('@')[0],
      email,
      rol: 'usuario',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  // RF-02, RF-03, RF-04, RF-05, RF-06: Crear ticket
  const crearTicket = (data: {
    categoria: string;
    subcategoria: string;
    ubicacion: string;
    cantidadEquipos: string;
    telefonoContacto: string;
    descripcion: string;
    puntajeCategoria: number;
    puntajeSubcategoria: number;
    puntajeUbicacion: number;
    puntajeCantidad: number;
  }): Ticket => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const puntajeTotal = calcularPuntajeTotal(
      data.puntajeSubcategoria,
      data.puntajeUbicacion,
      data.puntajeCantidad
    );

    const prioridad = calcularPrioridad(puntajeTotal);
    const tiempoEstimado = calcularTiempoRespuesta(puntajeTotal);

    const nuevoTicket: Ticket = {
      id: generateTicketId(),
      usuarioId: user.id,
      usuarioNombre: user.nombre,
      usuarioEmail: user.email,
      categoria: data.categoria,
      subcategoria: data.subcategoria,
      ubicacion: data.ubicacion,
      cantidadEquipos: data.cantidadEquipos,
      telefonoContacto: data.telefonoContacto,
      descripcion: data.descripcion,
      puntajeTotal,
      prioridad,
      tiempoEstimado,
      estado: 'abierto',
      fechaCreacion: new Date(),
      comentarios: [],
    };

    setTickets([...tickets, nuevoTicket]);

    // RF-25: Registro de auditoría - Creación de ticket
    const nuevoAuditoria: Auditoria = {
      id: `AUD-${Date.now()}`,
      ticketId: nuevoTicket.id,
      accion: 'creacion_ticket',
      usuario: user.nombre,
      usuarioRol: user.rol,
      fecha: new Date(),
      detalles: {},
    };
    setAuditoria([...auditoria, nuevoAuditoria]);

    return nuevoTicket;
  };

  // RF-11: Auto-asignación de ticket por técnico
  const asignarTicket = (ticketId: string, tecnicoId: string) => {
    if (!user) return;

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, tecnicoAsignado: tecnicoId, estado: 'en_proceso' as TicketStatus, fechaActualizacion: new Date() }
          : t
      )
    );

    // RF-26: Registro de auditoría - Asignación de ticket
    const nuevoAuditoria: Auditoria = {
      id: `AUD-${Date.now()}`,
      ticketId,
      accion: 'asignacion_ticket',
      usuario: user.nombre,
      usuarioRol: user.rol,
      fecha: new Date(),
      detalles: { tecnicoNuevo: tecnicoId },
    };
    setAuditoria([...auditoria, nuevoAuditoria]);
  };

  // RF-12: Reasignación de ticket por admin
  const reasignarTicket = (ticketId: string, nuevoTecnicoId: string) => {
    if (!user) return;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, tecnicoAsignado: nuevoTecnicoId, fechaActualizacion: new Date() }
          : t
      )
    );

    // RF-27: Registro de auditoría - Reasignación de ticket
    const nuevoAuditoria: Auditoria = {
      id: `AUD-${Date.now()}`,
      ticketId,
      accion: 'reasignacion_ticket',
      usuario: user.nombre,
      usuarioRol: user.rol,
      fecha: new Date(),
      detalles: {
        tecnicoAnterior: ticket.tecnicoAsignado,
        tecnicoNuevo: nuevoTecnicoId,
      },
    };
    setAuditoria([...auditoria, nuevoAuditoria]);
  };

  // RF-13: Actualización de estado del ticket
  const actualizarEstadoTicket = (ticketId: string, nuevoEstado: TicketStatus) => {
    if (!user) return;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              estado: nuevoEstado,
              fechaActualizacion: new Date(),
              fechaResolucion: nuevoEstado === 'cerrado' ? new Date() : t.fechaResolucion,
            }
          : t
      )
    );

    // RF-28: Registro de auditoría - Cambio de estado
    const nuevoAuditoria: Auditoria = {
      id: `AUD-${Date.now()}`,
      ticketId,
      accion: 'cambio_estado',
      usuario: user.nombre,
      usuarioRol: user.rol,
      fecha: new Date(),
      detalles: {
        estadoAnterior: ticket.estado,
        estadoNuevo: nuevoEstado,
      },
    };
    setAuditoria([...auditoria, nuevoAuditoria]);
  };

  // RF-14: Registro de comentarios de seguimiento
  const agregarComentario = (ticketId: string, contenido: string) => {
    if (!user) return;

    const nuevoComentario = {
      id: `COM-${Date.now()}`,
      ticketId,
      autor: user.nombre,
      autorRol: user.rol,
      contenido,
      fecha: new Date(),
    };

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, comentarios: [...t.comentarios, nuevoComentario], fechaActualizacion: new Date() }
          : t
      )
    );

    // RF-30: Registro de auditoría - Inclusión de comentarios
    const nuevoAuditoria: Auditoria = {
      id: `AUD-${Date.now()}`,
      ticketId,
      accion: 'inclusion_comentario',
      usuario: user.nombre,
      usuarioRol: user.rol,
      fecha: new Date(),
      detalles: { comentario: contenido },
    };
    setAuditoria([...auditoria, nuevoAuditoria]);
  };

  // Actualizar ticket completo (estado, técnico y comentario)
  const actualizarTicketCompleto = (ticketId: string, nuevoEstado: TicketStatus, nuevoTecnico: string, comentario: string) => {
    if (!user) return;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // Agregar comentario si se proporciona
    let nuevosComentarios = ticket.comentarios;
    if (comentario && comentario.trim()) {
      const nuevoComentario = {
        id: `COM-${Date.now()}`,
        ticketId,
        autor: user.nombre,
        autorRol: user.rol,
        contenido: comentario,
        fecha: new Date(),
      };
      nuevosComentarios = [...ticket.comentarios, nuevoComentario];
    }

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              estado: nuevoEstado,
              tecnicoAsignado: nuevoTecnico || t.tecnicoAsignado,
              comentarios: nuevosComentarios,
              fechaActualizacion: new Date(),
              fechaResolucion: nuevoEstado === 'cerrado' ? new Date() : t.fechaResolucion,
            }
          : t
      )
    );

    // Registro de auditoría - Cambio de estado
    if (ticket.estado !== nuevoEstado) {
      const nuevoAuditoria: Auditoria = {
        id: `AUD-${Date.now()}`,
        ticketId,
        accion: 'cambio_estado',
        usuario: user.nombre,
        usuarioRol: user.rol,
        fecha: new Date(),
        detalles: {
          estadoAnterior: ticket.estado,
          estadoNuevo: nuevoEstado,
        },
      };
      setAuditoria([...auditoria, nuevoAuditoria]);
    }

    // Registro de auditoría - Reasignación si cambió el técnico
    if (ticket.tecnicoAsignado !== nuevoTecnico && nuevoTecnico) {
      const nuevoAuditoria: Auditoria = {
        id: `AUD-${Date.now()}`,
        ticketId,
        accion: 'reasignacion_ticket',
        usuario: user.nombre,
        usuarioRol: user.rol,
        fecha: new Date(),
        detalles: {
          tecnicoAnterior: ticket.tecnicoAsignado,
          tecnicoNuevo: nuevoTecnico,
        },
      };
      setAuditoria([...auditoria, nuevoAuditoria]);
    }

    // Registro de auditoría - Comentario si se agregó
    if (comentario && comentario.trim()) {
      const nuevoAuditoria: Auditoria = {
        id: `AUD-${Date.now()}`,
        ticketId,
        accion: 'inclusion_comentario',
        usuario: user.nombre,
        usuarioRol: user.rol,
        fecha: new Date(),
        detalles: { comentario },
      };
      setAuditoria([...auditoria, nuevoAuditoria]);
    }

    // Registro de auditoría - Cierre de ticket
    if (nuevoEstado === 'cerrado' && ticket.estado !== 'cerrado') {
      const nuevoAuditoria: Auditoria = {
        id: `AUD-${Date.now()}`,
        ticketId,
        accion: 'cierre_ticket',
        usuario: user.nombre,
        usuarioRol: user.rol,
        fecha: new Date(),
        detalles: { comentario },
      };
      setAuditoria([...auditoria, nuevoAuditoria]);
    }
  };

  // Actualizar categoría, subcategoría y ubicación de un ticket (recalculando puntajes y tiempos)
  const actualizarCategoriaTicket = (
    ticketId: string,
    nuevaCategoria: string,
    nuevaSubcategoria: string,
    nuevaUbicacion: string,
    puntajeSubcategoria: number,
    puntajeUbicacion: number
  ) => {
    if (!user) return;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // Obtener el puntaje de cantidad original
    const cantidadEquipos = ticket.cantidadEquipos;
    let puntajeCantidad = 0;
    if (cantidadEquipos === '1 a 3 equipos') puntajeCantidad = 5;
    else if (cantidadEquipos === '4 a 10 equipos') puntajeCantidad = 10;
    else if (cantidadEquipos === '11 a 30 equipos') puntajeCantidad = 20;
    else if (cantidadEquipos === 'Más de 30 equipos') puntajeCantidad = 30;

    const puntajeTotalFinal = calcularPuntajeTotal(
      puntajeSubcategoria,
      puntajeUbicacion,
      puntajeCantidad
    );

    const nuevaPrioridad = calcularPrioridad(puntajeTotalFinal);
    const nuevoTiempoEstimado = calcularTiempoRespuesta(puntajeTotalFinal);

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              categoria: nuevaCategoria,
              subcategoria: nuevaSubcategoria,
              ubicacion: nuevaUbicacion,
              puntajeTotal: puntajeTotalFinal,
              prioridad: nuevaPrioridad,
              tiempoEstimado: nuevoTiempoEstimado,
              fechaActualizacion: new Date(),
            }
          : t
      )
    );

    // Registro de auditoría - Modificación de categoría
    const nuevoAuditoria: Auditoria = {
      id: `AUD-${Date.now()}`,
      ticketId,
      accion: 'modificacion_categoria',
      usuario: user.nombre,
      usuarioRol: user.rol,
      fecha: new Date(),
      detalles: {
        categoriaAnterior: ticket.categoria,
        categoriaNueva: nuevaCategoria,
      },
    };
    setAuditoria([...auditoria, nuevoAuditoria]);
  };

  // Utilidades
  const getTicketsByUsuario = (usuarioId: string) => {
    return tickets.filter((t) => t.usuarioId === usuarioId);
  };

  const getTicketsByTecnico = (tecnicoId: string) => {
    return tickets.filter((t) => t.tecnicoAsignado === tecnicoId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tickets,
        auditoria,
        users,
        isAuthenticated,
        login,
        logout,
        crearTicket,
        asignarTicket,
        reasignarTicket,
        actualizarEstadoTicket,
        agregarComentario,
        actualizarTicketCompleto,
        actualizarCategoriaTicket,
        getTicketsByUsuario,
        getTicketsByTecnico,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
