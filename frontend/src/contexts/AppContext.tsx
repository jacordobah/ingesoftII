import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Auditoria,
  Categoria,
  Edificio,
  Subcategoria,
  Ticket,
  TicketPriority,
  TicketStatus,
  Ubicacion,
  User,
} from '../types';
import { ENDPOINTS, apiRequest } from '../config/api';

interface CrearTicketData {
  subcategoriaId: number;
  oficinaId: number;
  cantidadEquipos: number;
  telefonoContacto: string;
  descripcion: string;
}

interface AppContextType {
  user: User | null;
  tickets: Ticket[];
  auditoria: Auditoria[];
  users: User[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  edificios: Edificio[];
  oficinas: Ubicacion[];
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  crearTicket: (data: CrearTicketData) => Promise<Ticket>;
  asignarTicket: (ticketId: string, tecnicoId: string) => Promise<void>;
  reasignarTicket: (ticketId: string, nuevoTecnicoId: string) => Promise<void>;
  actualizarEstadoTicket: (ticketId: string, nuevoEstado: TicketStatus) => Promise<void>;
  actualizarTicketCompleto: (
    ticketId: string,
    nuevoEstado: TicketStatus,
    nuevoTecnico: string,
    comentario: string
  ) => Promise<void>;

  getTicketsByUsuario: (email: string) => Ticket[];

  recargarDatos: () => Promise<void>;
  recargarMatrizPuntajes: () => Promise<void>;
}

const USER_STORAGE_KEY = 'user';
const AppContext = createContext<AppContextType | undefined>(undefined);

// El backend usa Spring Data Page<T> para /tickets y /usuarios: los datos
// reales vienen en `content`, no en un arreglo plano.
interface PageResponse<T> {
  content: T[];
}

// El enum Status de Java es Abierto/En_proceso/Cerrado; el front usa
// abierto/en_proceso/cerrado. El enum Priority es Alta/Media/Baja; el front
// usa baja/media/critica (Alta del backend = critica en el front).
const ESTADO_DESDE_BACKEND: Record<string, TicketStatus> = {
  Abierto: 'abierto',
  En_proceso: 'en_proceso',
  Cerrado: 'cerrado',
};
const ESTADO_HACIA_BACKEND: Record<TicketStatus, string> = {
  abierto: 'Abierto',
  en_proceso: 'En_proceso',
  cerrado: 'Cerrado',
};
const PRIORIDAD_DESDE_BACKEND: Record<string, TicketPriority> = {
  Alta: 'critica',
  Media: 'media',
  Baja: 'baja',
};

function getStoredUser(): User | null {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  } catch {
    return null;
  }
}

// Forma real del JSON que devuelve TicketResponseAssignmentDTO (verificado
// contra el backend con curl); sus nombres de campo NO coinciden 1:1 con el
// tipo Ticket del front (usuarioCorreo/subcategoriaNombre/oficinaNombre+
// edificioNombre/tiempoRespuesta en vez de usuarioEmail/subcategoria/
// ubicacion/tiempoEstimado). El backend tampoco expone el id del solicitante
// ni un campo de telefono de contacto (no existe esa columna en la BD).
interface TicketBackendDTO {
  id: string;
  usuarioNombre: string;
  usuarioCorreo: string;
  categoria: string;
  subcategoriaNombre: string;
  oficinaNombre: string;
  edificioNombre: string;
  cantidadEquipos: number;
  descripcion: string;
  estado: string;
  tiempoRespuesta: string;
  prioridad: string;
  puntajeTotal: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaResolucion: string | null;
  tecnicoAsignado: string | null;
  comentario: string | null;
}

function normalizeTicket(dto: TicketBackendDTO): Ticket {
  return {
    id: dto.id,
    usuarioNombre: dto.usuarioNombre,
    usuarioEmail: dto.usuarioCorreo,
    categoria: dto.categoria,
    subcategoria: dto.subcategoriaNombre,
    ubicacion: dto.edificioNombre ? `${dto.edificioNombre} - ${dto.oficinaNombre}` : dto.oficinaNombre,
    cantidadEquipos: dto.cantidadEquipos,
    // No existe columna de telefono de contacto en el backend actual.
    telefonoContacto: '',
    descripcion: dto.descripcion,
    puntajeTotal: dto.puntajeTotal,
    prioridad: PRIORIDAD_DESDE_BACKEND[dto.prioridad] ?? 'baja',
    tiempoEstimado: dto.tiempoRespuesta,
    estado: ESTADO_DESDE_BACKEND[dto.estado] ?? 'abierto',
    tecnicoAsignado: dto.tecnicoAsignado && dto.tecnicoAsignado !== 'undefined' ? dto.tecnicoAsignado : undefined,
    fechaCreacion: new Date(dto.fechaCreacion),
    fechaActualizacion: dto.fechaActualizacion ? new Date(dto.fechaActualizacion) : undefined,
    fechaResolucion: dto.fechaResolucion ? new Date(dto.fechaResolucion) : undefined,
    comentarios: [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [auditoria] = useState<Auditoria[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [oficinas, setOficinas] = useState<Ubicacion[]>([]);

  const isAuthenticated = user !== null;

  const refreshData = useCallback(async () => {
    try {
      const [apiTickets, apiUsers] = await Promise.all([
        apiRequest<PageResponse<TicketBackendDTO>>(ENDPOINTS.tickets.getAll),
        apiRequest<PageResponse<User>>(ENDPOINTS.usuarios.getAll),
      ]);
      setTickets(apiTickets.content.map(normalizeTicket));
      setUsers(apiUsers.content);
    } catch (error) {
      console.error('No se pudo sincronizar con el backend:', error);
    }
    // auditoria.* no tiene implementacion en el backend (AuditController esta
    // vacio), asi que no se intenta la llamada: se deja en [] hasta que exista.
  }, []);

  // Carga la matriz de puntajes real: categorias -> subcategorias,
  // edificios -> oficinas. No hay endpoints "planos" para subcategorias u
  // oficinas, por eso se recorre cada categoria/edificio.
  const recargarMatrizPuntajes = useCallback(async () => {
    try {
      const apiCategorias = await apiRequest<Categoria[]>(ENDPOINTS.categorias.getAll);
      setCategorias(apiCategorias);

      const subcategoriasPorCategoria = await Promise.all(
        apiCategorias.map((categoria) =>
          apiRequest<Subcategoria[]>(ENDPOINTS.categorias.getSubcategorias(categoria.id))
        )
      );
      setSubcategorias(subcategoriasPorCategoria.flat());
    } catch (error) {
      console.error('No se pudo cargar categorias/subcategorias:', error);
    }

    try {
      const apiEdificios = await apiRequest<Edificio[]>(ENDPOINTS.ubicaciones.getAll);
      setEdificios(apiEdificios);

      const oficinasPorEdificio = await Promise.all(
        apiEdificios.map((edificio) =>
          apiRequest<Ubicacion[]>(ENDPOINTS.ubicaciones.getOficinas(edificio.id)).then((lista) =>
            lista.map((oficina) => ({ ...oficina, edificioId: edificio.id, edificio: edificio.nombre }))
          )
        )
      );
      setOficinas(oficinasPorEdificio.flat());
    } catch (error) {
      console.error('No se pudo cargar edificios/oficinas:', error);
    }
  }, []);

  useEffect(() => {
    void refreshData();
    void recargarMatrizPuntajes();
  }, [refreshData, recargarMatrizPuntajes]);

  // Usa el endpoint real de autenticación que valida contraseñas y devuelve el usuario con su rol
  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.endsWith('@unal.edu.co')) return false;

    try {
      const response = await apiRequest<{ user: User; token: string }>(ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser(response.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error('No se pudo iniciar sesion:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const crearTicket = async (data: CrearTicketData): Promise<Ticket> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const ticket = await apiRequest<TicketBackendDTO>(ENDPOINTS.tickets.create, {
      method: 'POST',
      body: JSON.stringify({
        usuarioId: user.id,
        subcategoriaId: data.subcategoriaId,
        oficinaId: data.oficinaId,
        cantidadEquipos: data.cantidadEquipos,
        descripcion: data.descripcion,
      }),
    });

    const normalizedTicket = normalizeTicket(ticket);
    setTickets((currentTickets) => [...currentTickets, normalizedTicket]);
    void refreshData();
    return normalizedTicket;
  };

  const actualizarTicketCompleto = async (
    ticketId: string,
    nuevoEstado: TicketStatus,
    nuevoTecnico: string,
    comentario: string
  ) => {
    if (!user) return;
    const ticket = tickets.find((item) => item.id === ticketId);
    if (!ticket) return;

    // Solo se reasigna si el tecnico seleccionado es distinto al ya asignado
    // (el backend expone la asignacion y el cambio de estado como dos
    // operaciones separadas: asignar-tecnico y cambiar-estado).
    if (nuevoTecnico) {
      const tecnicoActual = users.find((u) => u.nombre === ticket.tecnicoAsignado);
      if (String(tecnicoActual?.id ?? '') !== nuevoTecnico) {
        await apiRequest(ENDPOINTS.tickets.asignarTecnico, {
          method: 'PATCH',
          body: JSON.stringify({ ticketId, tecnicoID: Number(nuevoTecnico) }),
        });
      }
    }

    if (nuevoEstado !== ticket.estado) {
      // tecnicoId aqui es el usuario que ejecuta la accion (para las
      // validaciones de rol en TicketService), no el tecnico asignado.
      await apiRequest(ENDPOINTS.tickets.cambiarEstado, {
        method: 'PATCH',
        body: JSON.stringify({
          id: ticketId,
          tecnicoId: user.id,
          estado: ESTADO_HACIA_BACKEND[nuevoEstado],
          comentario: comentario || undefined,
        }),
      });
    }

    void refreshData();
  };

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
    const tecnicoActual = users.find((u) => u.nombre === ticket.tecnicoAsignado);
    await actualizarTicketCompleto(ticketId, nuevoEstado, tecnicoActual ? String(tecnicoActual.id) : '', '');
  };

  const getTicketsByUsuario = useCallback(
    (email: string) => tickets.filter((ticket) => ticket.usuarioEmail === email),
    [tickets]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        tickets,
        auditoria,
        users,
        categorias,
        subcategorias,
        edificios,
        oficinas,
        isAuthenticated,
        login,
        logout,
        crearTicket,
        asignarTicket,
        reasignarTicket,
        actualizarEstadoTicket,
        actualizarTicketCompleto,
        getTicketsByUsuario,
        recargarDatos: refreshData,
        recargarMatrizPuntajes,
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
