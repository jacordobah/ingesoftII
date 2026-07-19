import {
  seedAuditoria,
  seedCategorias,
  seedEdificios,
  seedSubcategorias,
  seedTickets,
  seedUbicaciones,
  seedUsers,
} from '../data/seed.js';
import {
  calcularPrioridad,
  calcularTiempoRespuesta,
  calculateEquipmentScore,
  generateTicketId,
} from '../domain/scoring.js';

function clone(value) {
  return structuredClone(value);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function rolePrefix(role) {
  if (role === 'admin') return 'ADM';
  if (role === 'tecnico') return 'TEC';
  return 'USR';
}

export class MemoryStore {
  constructor() {
    this.users = clone(seedUsers);
    this.tickets = clone(seedTickets);
    this.auditoria = clone(seedAuditoria);
    this.categorias = clone(seedCategorias);
    this.subcategorias = clone(seedSubcategorias);
    this.edificios = clone(seedEdificios);
    this.ubicaciones = clone(seedUbicaciones);
  }

  listUsers() {
    return clone(this.users);
  }

  findUserById(id) {
    return this.users.find((user) => user.id === id) || null;
  }

  findUserByEmail(email) {
    const normalized = normalizeEmail(email);
    return this.users.find((user) => normalizeEmail(user.email) === normalized) || null;
  }

  getOrCreateUser(email) {
    const normalized = normalizeEmail(email);
    const existing = this.findUserByEmail(normalized);
    if (existing) return clone(existing);

    const user = {
      id: `USR-${Date.now()}`,
      nombre: normalized.split('@')[0],
      email: normalized,
      rol: 'usuario',
    };
    this.users.push(user);
    return clone(user);
  }

  createUser(payload) {
    const email = normalizeEmail(payload.email);
    if (!email.endsWith('@unal.edu.co')) {
      throw Object.assign(new Error('El correo debe ser institucional @unal.edu.co'), { status: 400 });
    }
    if (this.findUserByEmail(email)) {
      throw Object.assign(new Error('Ya existe un usuario con ese correo'), { status: 409 });
    }

    const role = payload.rol || 'usuario';
    const user = {
      id: `${rolePrefix(role)}-${Date.now()}`,
      nombre: payload.nombre || email.split('@')[0],
      email,
      rol: role,
    };

    this.users.push(user);
    return clone(user);
  }

  updateUser(id, payload) {
    const user = this.findUserById(id);
    if (!user) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });

    Object.assign(user, {
      nombre: payload.nombre ?? user.nombre,
      email: payload.email ? normalizeEmail(payload.email) : user.email,
      rol: payload.rol ?? user.rol,
    });

    return clone(user);
  }

  deleteUser(id) {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return before !== this.users.length;
  }

  listTickets() {
    return clone(this.tickets);
  }

  findTicketById(id) {
    return clone(this.tickets.find((ticket) => ticket.id === id) || null);
  }

  createTicket(payload, actorId) {
    const actor = this.findUserById(actorId);
    if (!actor) throw Object.assign(new Error('Usuario no autenticado'), { status: 401 });

    const puntajeCantidad = payload.puntajeCantidad ?? calculateEquipmentScore(payload.cantidadEquipos);
    const puntajeTotal =
      payload.puntajeTotal ??
      Number(payload.puntajeSubcategoria || 0) +
        Number(payload.puntajeUbicacion || 0) +
        Number(puntajeCantidad || 0);

    const ticket = {
      id: generateTicketId(this.tickets.map((item) => item.id)),
      usuarioId: actor.id,
      usuarioNombre: actor.nombre,
      usuarioEmail: actor.email,
      categoria: payload.categoria,
      subcategoria: payload.subcategoria,
      ubicacion: payload.ubicacion,
      cantidadEquipos: String(payload.cantidadEquipos),
      telefonoContacto: payload.telefonoContacto || '',
      descripcion: payload.descripcion,
      puntajeTotal,
      prioridad: calcularPrioridad(puntajeTotal),
      tiempoEstimado: calcularTiempoRespuesta(puntajeTotal),
      estado: 'abierto',
      fechaCreacion: new Date(),
      comentarios: [],
    };

    this.tickets.push(ticket);
    this.addAudit({
      ticketId: ticket.id,
      accion: 'creacion_ticket',
      usuarioId: actor.id,
      detalles: {},
    });

    return clone(ticket);
  }

  updateTicket(id, payload, actorId) {
    const actor = this.findUserById(actorId);
    const ticket = this.tickets.find((item) => item.id === id);
    if (!ticket) throw Object.assign(new Error('Ticket no encontrado'), { status: 404 });

    const oldState = ticket.estado;
    const oldTechnician = ticket.tecnicoAsignado;
    const nextState = payload.estado ?? ticket.estado;
    const nextTechnician = payload.tecnicoAsignado ?? payload.tecnicoId ?? ticket.tecnicoAsignado;

    Object.assign(ticket, {
      estado: nextState,
      tecnicoAsignado: nextTechnician || undefined,
      fechaActualizacion: new Date(),
      fechaResolucion: nextState === 'cerrado' ? new Date() : ticket.fechaResolucion,
    });

    if (payload.categoria || payload.subcategoria || payload.ubicacion) {
      const puntajeTotal =
        Number(payload.puntajeSubcategoria || 0) +
        Number(payload.puntajeUbicacion || 0) +
        calculateEquipmentScore(ticket.cantidadEquipos);

      Object.assign(ticket, {
        categoria: payload.categoria ?? ticket.categoria,
        subcategoria: payload.subcategoria ?? ticket.subcategoria,
        ubicacion: payload.ubicacion ?? ticket.ubicacion,
        puntajeTotal: puntajeTotal || ticket.puntajeTotal,
        prioridad: puntajeTotal ? calcularPrioridad(puntajeTotal) : ticket.prioridad,
        tiempoEstimado: puntajeTotal ? calcularTiempoRespuesta(puntajeTotal) : ticket.tiempoEstimado,
      });
    }

    if (payload.comentario && String(payload.comentario).trim()) {
      ticket.comentarios.push(this.buildComment(ticket.id, actor, payload.comentario));
      this.addAudit({
        ticketId: ticket.id,
        accion: 'inclusion_comentario',
        usuarioId: actor?.id,
        detalles: { comentario: payload.comentario },
      });
    }

    if (oldState !== nextState) {
      this.addAudit({
        ticketId: ticket.id,
        accion: nextState === 'cerrado' ? 'cierre_ticket' : 'cambio_estado',
        usuarioId: actor?.id,
        detalles: { estadoAnterior: oldState, estadoNuevo: nextState },
      });
    }

    if (oldTechnician !== nextTechnician && nextTechnician) {
      this.addAudit({
        ticketId: ticket.id,
        accion: oldTechnician ? 'reasignacion_ticket' : 'asignacion_ticket',
        usuarioId: actor?.id,
        detalles: { tecnicoAnterior: oldTechnician, tecnicoNuevo: nextTechnician },
      });
    }

    return clone(ticket);
  }

  deleteTicket(id) {
    const before = this.tickets.length;
    this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
    return before !== this.tickets.length;
  }

  addComment(ticketId, contenido, actorId) {
    const actor = this.findUserById(actorId);
    const ticket = this.tickets.find((item) => item.id === ticketId);
    if (!ticket) throw Object.assign(new Error('Ticket no encontrado'), { status: 404 });

    const comment = this.buildComment(ticketId, actor, contenido);
    ticket.comentarios.push(comment);
    ticket.fechaActualizacion = new Date();

    this.addAudit({
      ticketId,
      accion: 'inclusion_comentario',
      usuarioId: actor?.id,
      detalles: { comentario: contenido },
    });

    return clone(comment);
  }

  listCategorias() {
    return clone(this.categorias);
  }

  listSubcategorias() {
    return clone(this.subcategorias);
  }

  listUbicaciones() {
    return {
      edificios: clone(this.edificios),
      ubicaciones: clone(this.ubicaciones),
    };
  }

  listAuditoria() {
    return clone(this.auditoria);
  }

  addAudit({ ticketId, accion, usuarioId, detalles }) {
    const actor = this.findUserById(usuarioId) || {
      nombre: 'Sistema',
      rol: 'admin',
    };

    const record = {
      id: `AUD-${Date.now()}-${this.auditoria.length + 1}`,
      ticketId,
      accion,
      usuario: actor.nombre,
      usuarioRol: actor.rol,
      fecha: new Date(),
      detalles: detalles || {},
    };

    this.auditoria.push(record);
    return record;
  }

  buildComment(ticketId, actor, contenido) {
    return {
      id: `COM-${Date.now()}`,
      ticketId,
      autor: actor?.nombre || 'Sistema',
      autorRol: actor?.rol || 'admin',
      contenido: String(contenido).trim(),
      fecha: new Date(),
    };
  }
}
