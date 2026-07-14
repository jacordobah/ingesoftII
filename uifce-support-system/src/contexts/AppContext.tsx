import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Auditoria, Comentario, Ticket, TicketStatus, User } from '../types';
import { mockAuditoria, mockTickets, mockUsers } from '../data/mockData';
import { ENDPOINTS, apiRequest } from '../config/api';
import {
  calcularPrioridad,
  calcularTiempoRespuesta,
  calcularPuntajeTotal,
  generateTicketId,
} from '../utils/ticketUtils';

interface CrearTicketData {
  categoria: string;
  subcategoria: string;
  ubicacion: string;
  cantidadEquipos: string;
  telefonoContacto: string;
  descripcion: string;
  puntajeSubcategoria: number;
  puntajeUbicacion: number;
  puntajeCantidad: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AppContextType {
  user: User | null;
  tickets: Ticket[];
  auditoria: Auditoria[];
  users: User[];
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  crearTicket: (data: CrearTicketData) => Promise<Ticket>;
  asignarTicket: (ticketId: string, tecnicoId: string) => Promise<void>;
  reasignarTicket: (ticketId: string, nuevoTecnicoId: string) => Promise<void>;
  actualizarEstadoTicket: (ticketId: string, nuevoEstado: TicketStatus) => Promise<void>;
  agregarComentario: (ticketId: string, contenido: string) => Promise<void>;
  actualizarTicketCompleto: (
    ticketId: string,
    nuevoEstado: TicketStatus,
    nuevoTecnico: string,
    comentario: string
  ) => Promise<void>;
  actualizarCategoriaTicket: (
    ticketId: string,
    nuevaCategoria: string,
    nuevaSubcategoria: string,
    nuevaUbicacion: string,
    puntajeSubcategoria: number,
    puntajeUbicacion: number
  ) => Promise<void>;

  getTicketsByUsuario: (usuarioId: string) => Ticket[];
  getTicketsByTecnico: (tecnicoId: string) => Ticket[];
}

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';
const AppContext = createContext<AppContextType | undefined>(undefined);

function getStoredUser(): User | null {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  } catch {
    return null;
  }
}

function normalizeTicket(ticket: Ticket): Ticket {
  return {
    ...ticket,
    fechaCreacion: new Date(ticket.fechaCreacion),
    fechaActualizacion: ticket.fechaActualizacion ? new Date(ticket.fechaActualizacion) : undefined,
    fechaResolucion: ticket.fechaResolucion ? new Date(ticket.fechaResolucion) : undefined,
    comentarios: ticket.comentarios.map((comentario) => ({
      ...comentario,
      fecha: new Date(comentario.fecha),
    })),
  };
}

function normalizeAuditoria(record: Auditoria): Auditoria {
  return {
    ...record,
    fecha: new Date(record.fecha),
  };
}

function warnApiFallback(action: string, error: unknown) {
  console.warn(`API no disponible para ${action}; usando datos locales.`, error);
}

function createAuditRecord(
  ticketId: string,
  accion: Auditoria['accion'],
  actor: User,
  detalles: Auditoria['detalles']
): Auditoria {
  return {
    id: `AUD-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ticketId,
    accion,
    usuario: actor.nombre,
    usuarioRol: actor.rol,
    fecha: new Date(),
    detalles,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets.map(normalizeTicket));
  const [auditoria, setAuditoria] = useState<Auditoria[]>(mockAuditoria.map(normalizeAuditoria));
  const [users, setUsers] = useState<User[]>(mockUsers);

  const isAuthenticated = user !== null;

  const refreshData = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return;

    try {
      const [apiTickets, apiUsers, apiAuditoria] = await Promise.all([
        apiRequest<Ticket[]>(ENDPOINTS.tickets.getAll),
        apiRequest<User[]>(ENDPOINTS.usuarios.getAll),
        apiRequest<Auditoria[]>(ENDPOINTS.auditoria.getAll),
      ]);

      setTickets(apiTickets.map(normalizeTicket));
      setUsers(apiUsers);
      setAuditoria(apiAuditoria.map(normalizeAuditoria));
    } catch (error) {
      warnApiFallback('sincronizacion inicial', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return;

    void apiRequest<User>(ENDPOINTS.auth.me)
      .then((apiUser) => {
        setUser(apiUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(apiUser));
      })
      .catch((error) => warnApiFallback('sesion', error));

    void refreshData();
  }, [refreshData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.endsWith('@unal.edu.co')) return false;

    try {
      const session = await apiRequest<AuthResponse>(ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
      setUser(session.user);
      await refreshData();
      return true;
    } catch (error) {
      warnApiFallback('login', error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    const foundUser = mockUsers.find((mockUser) => mockUser.email === email);
    const localUser: User =
      foundUser ?? {
        id: `USR-${Date.now()}`,
        nombre: email.split('@')[0],
        email,
        rol: 'usuario',
      };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
    setUser(localUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const crearTicket = async (data: CrearTicketData): Promise<Ticket> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
      try {
        const ticket = await apiRequest<Ticket>(ENDPOINTS.tickets.create, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        const normalizedTicket = normalizeTicket(ticket);
        setTickets((currentTickets) => [...currentTickets, normalizedTicket]);
        void refreshData();
        return normalizedTicket;
      } catch (error) {
        warnApiFallback('crear ticket', error);
      }
    }

    const puntajeTotal = calcularPuntajeTotal(
      data.puntajeSubcategoria,
      data.puntajeUbicacion,
      data.puntajeCantidad
    );

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
      prioridad: calcularPrioridad(puntajeTotal),
      tiempoEstimado: calcularTiempoRespuesta(puntajeTotal),
      estado: 'abierto',
      fechaCreacion: new Date(),
      comentarios: [],
    };

    setTickets((currentTickets) => [...currentTickets, nuevoTicket]);
    setAuditoria((currentAuditoria) => [
      ...currentAuditoria,
      createAuditRecord(nuevoTicket.id, 'creacion_ticket', user, {}),
    ]);

    return nuevoTicket;
  };

  async function actualizarTicketCompleto(
    ticketId: string,
    nuevoEstado: TicketStatus,
    nuevoTecnico: string,
    comentario: string
  ) {
    if (!user) return;

    if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
      try {
        const updatedTicket = await apiRequest<Ticket>(ENDPOINTS.tickets.update(ticketId), {
          method: 'PUT',
          body: JSON.stringify({
            estado: nuevoEstado,
            tecnicoAsignado: nuevoTecnico,
            comentario,
          }),
        });
        const normalizedTicket = normalizeTicket(updatedTicket);
        setTickets((currentTickets) =>
          currentTickets.map((ticket) => (ticket.id === ticketId ? normalizedTicket : ticket))
        );
        void refreshData();
        return;
      } catch (error) {
        warnApiFallback('actualizar ticket', error);
      }
    }

    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) return;

    const nuevosComentarios = [...ticket.comentarios];
    if (comentario && comentario.trim()) {
      nuevosComentarios.push({
        id: `COM-${Date.now()}`,
        ticketId,
        autor: user.nombre,
        autorRol: user.rol,
        contenido: comentario,
        fecha: new Date(),
      });
    }

    setTickets((currentTickets) =>
      currentTickets.map((item) =>
        item.id === ticketId
          ? {
              ...item,
              estado: nuevoEstado,
              tecnicoAsignado: nuevoTecnico || item.tecnicoAsignado,
              comentarios: nuevosComentarios,
              fechaActualizacion: new Date(),
              fechaResolucion: nuevoEstado === 'cerrado' ? new Date() : item.fechaResolucion,
            }
          : item
      )
    );

    const auditRecords: Auditoria[] = [];
    if (ticket.estado !== nuevoEstado) {
      auditRecords.push(
        createAuditRecord(
          ticketId,
          nuevoEstado === 'cerrado' ? 'cierre_ticket' : 'cambio_estado',
          user,
          { estadoAnterior: ticket.estado, estadoNuevo: nuevoEstado }
        )
      );
    }

    if (ticket.tecnicoAsignado !== nuevoTecnico && nuevoTecnico) {
      auditRecords.push(
        createAuditRecord(ticketId, ticket.tecnicoAsignado ? 'reasignacion_ticket' : 'asignacion_ticket', user, {
          tecnicoAnterior: ticket.tecnicoAsignado,
          tecnicoNuevo: nuevoTecnico,
        })
      );
    }

    if (comentario && comentario.trim()) {
      auditRecords.push(createAuditRecord(ticketId, 'inclusion_comentario', user, { comentario }));
    }

    if (auditRecords.length > 0) {
      setAuditoria((currentAuditoria) => [...currentAuditoria, ...auditRecords]);
    }
  }

  const asignarTicket = async (ticketId: string, tecnicoId: string) => {
    await actualizarTicketCompleto(ticketId, 'en_proceso', tecnicoId, '');
  };

  const reasignarTicket = async (ticketId: string, nuevoTecnicoId: string) => {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) return;
    await actualizarTicketCompleto(ticketId, ticket.estado, nuevoTecnicoId, '');
  };

  const actualizarEstadoTicket = async (ticketId: string, nuevoEstado: TicketStatus) => {
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) return;
    await actualizarTicketCompleto(ticketId, nuevoEstado, ticket.tecnicoAsignado || '', '');
  };

  const agregarComentario = async (ticketId: string, contenido: string) => {
    if (!user) return;

    if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
      try {
        await apiRequest<Comentario>(ENDPOINTS.tickets.addComment(ticketId), {
          method: 'POST',
          body: JSON.stringify({ contenido }),
        });
        void refreshData();
        return;
      } catch (error) {
        warnApiFallback('agregar comentario', error);
      }
    }

    const nuevoComentario: Comentario = {
      id: `COM-${Date.now()}`,
      ticketId,
      autor: user.nombre,
      autorRol: user.rol,
      contenido,
      fecha: new Date(),
    };

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, comentarios: [...ticket.comentarios, nuevoComentario], fechaActualizacion: new Date() }
          : ticket
      )
    );
    setAuditoria((currentAuditoria) => [
      ...currentAuditoria,
      createAuditRecord(ticketId, 'inclusion_comentario', user, { comentario: contenido }),
    ]);
  };

  const actualizarCategoriaTicket = async (
    ticketId: string,
    nuevaCategoria: string,
    nuevaSubcategoria: string,
    nuevaUbicacion: string,
    puntajeSubcategoria: number,
    puntajeUbicacion: number
  ) => {
    if (!user) return;

    if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
      try {
        const updatedTicket = await apiRequest<Ticket>(ENDPOINTS.tickets.update(ticketId), {
          method: 'PUT',
          body: JSON.stringify({
            categoria: nuevaCategoria,
            subcategoria: nuevaSubcategoria,
            ubicacion: nuevaUbicacion,
            puntajeSubcategoria,
            puntajeUbicacion,
          }),
        });
        const normalizedTicket = normalizeTicket(updatedTicket);
        setTickets((currentTickets) =>
          currentTickets.map((ticket) => (ticket.id === ticketId ? normalizedTicket : ticket))
        );
        void refreshData();
        return;
      } catch (error) {
        warnApiFallback('actualizar categoria', error);
      }
    }

    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) return;

    let puntajeCantidad = 0;
    const cantidadEquipos = Number(ticket.cantidadEquipos);
    if (cantidadEquipos >= 1 && cantidadEquipos <= 3) puntajeCantidad = 5;
    else if (cantidadEquipos >= 4 && cantidadEquipos <= 14) puntajeCantidad = 12;
    else if (cantidadEquipos >= 15 && cantidadEquipos <= 30) puntajeCantidad = 20;
    else if (cantidadEquipos > 30) puntajeCantidad = 30;

    const puntajeTotal = calcularPuntajeTotal(puntajeSubcategoria, puntajeUbicacion, puntajeCantidad);

    setTickets((currentTickets) =>
      currentTickets.map((item) =>
        item.id === ticketId
          ? {
              ...item,
              categoria: nuevaCategoria,
              subcategoria: nuevaSubcategoria,
              ubicacion: nuevaUbicacion,
              puntajeTotal,
              prioridad: calcularPrioridad(puntajeTotal),
              tiempoEstimado: calcularTiempoRespuesta(puntajeTotal),
              fechaActualizacion: new Date(),
            }
          : item
      )
    );

    setAuditoria((currentAuditoria) => [
      ...currentAuditoria,
      createAuditRecord(ticketId, 'modificacion_categoria', user, {
        categoriaAnterior: ticket.categoria,
        categoriaNueva: nuevaCategoria,
      }),
    ]);
  };

  const getTicketsByUsuario = useCallback(
    (usuarioId: string) => tickets.filter((ticket) => ticket.usuarioId === usuarioId),
    [tickets]
  );

  const getTicketsByTecnico = useCallback(
    (tecnicoId: string) => tickets.filter((ticket) => ticket.tecnicoAsignado === tecnicoId),
    [tickets]
  );

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
