import type { Categoria, Subcategoria, Ubicacion, CantidadEquipos, TiempoRespuesta, User, Ticket, Auditoria } from '../types';

// Matriz de puntajes (RF-18, Tablas 12-15)
export const mockCategorias: Categoria[] = [
  { id: 'CONCEPTOS', nombre: 'CONCEPTOS TÉCNICOS' },
  { id: 'IMPRESORAS', nombre: 'IMPRESORAS' },
  { id: 'PC-INSTALACION', nombre: 'PC Y PORTATILES - INSTALACIÓN Y ALISTAMIENTO' },
  { id: 'PC-UBICACION', nombre: 'PC Y PORTATILES - CAMBIO DE UBICACIÓN' },
  { id: 'PC-MANTENIMIENTO', nombre: 'PC Y PORTATILES - MANTENIMIENTO PREVENTIVO' },
  { id: 'PC-REPARACION', nombre: 'PC Y PORTATILES - REVISIÓN Y REPARACIÓN' },
  { id: 'SOFTWARE', nombre: 'SOFTWARE - INSTALACIÓN O ACTUALIZACIÓN' },
  { id: 'TELEFONIA', nombre: 'TELEFONÍA' },
  { id: 'VIDEO', nombre: 'VIDEO - PROYECTORES O PANTALLAS' },
  { id: 'SERVIDORES', nombre: 'SERVIDORES' },
];

export const mockSubcategorias: Subcategoria[] = [
  // CONCEPTOS TÉCNICOS
  { id: 'CON-01', categoriaId: 'CONCEPTOS', nombre: 'BAJAS', puntaje: 50 },
  { id: 'CON-02', categoriaId: 'CONCEPTOS', nombre: 'COMPRAS', puntaje: 70 },
  { id: 'CON-03', categoriaId: 'CONCEPTOS', nombre: 'DIRECTRICES TÉCNICAS', puntaje: 70 },
  // IMPRESORAS
  { id: 'IMP-01', categoriaId: 'IMPRESORAS', nombre: 'MANTENIMIENTO PREVENTIVO', puntaje: 30 },
  { id: 'IMP-02', categoriaId: 'IMPRESORAS', nombre: 'INSTALACIÓN O CONEXIÓN', puntaje: 10 },
  { id: 'IMP-03', categoriaId: 'IMPRESORAS', nombre: 'INSTALACIÓN DE TONER', puntaje: 10 },
  { id: 'IMP-04', categoriaId: 'IMPRESORAS', nombre: 'FALLA DE RED', puntaje: 10 },
  { id: 'IMP-05', categoriaId: 'IMPRESORAS', nombre: 'OTRO', puntaje: 20 },
  // PC Y PORTATILES - INSTALACIÓN Y ALISTAMIENTO
  { id: 'PCINST-01', categoriaId: 'PC-INSTALACION', nombre: 'INSTALACIÓN Y ALISTAMIENTO', puntaje: 25 },
  // PC Y PORTATILES - CAMBIO DE UBICACIÓN
  { id: 'PCUBI-01', categoriaId: 'PC-UBICACION', nombre: 'MOVIMIENTO DE EQUIPOS ENTRE OFICINAS', puntaje: 20 },
  // PC Y PORTATILES - MANTENIMIENTO PREVENTIVO
  { id: 'PCMAN-01', categoriaId: 'PC-MANTENIMIENTO', nombre: 'LIMPIEZA INTERNA Y EXTERNA', puntaje: 25 },
  // PC Y PORTATILES - REVISIÓN Y REPARACIÓN - Subcategorías directas (sin subcategoría2)
  { id: 'PCREP-01', categoriaId: 'PC-REPARACION', nombre: 'HARDWARE - EQUIPO NO ENCIENDE', puntaje: 5 },
  { id: 'PCREP-02', categoriaId: 'PC-REPARACION', nombre: 'HARDWARE - DAÑO EN PERIFERICOS (TECLADO, MOUSE, ETC.)', puntaje: 5 },
  { id: 'PCREP-03', categoriaId: 'PC-REPARACION', nombre: 'SOFTWARE - EQUIPO NO INICIA, PANTALLA NEGRA', puntaje: 5 },
  { id: 'PCREP-04', categoriaId: 'PC-REPARACION', nombre: 'SOFTWARE - EQUIPO LENTO', puntaje: 10 },
  { id: 'PCREP-05', categoriaId: 'PC-REPARACION', nombre: 'SOFTWARE CON FALLAS', puntaje: 5 },
  { id: 'PCREP-06', categoriaId: 'PC-REPARACION', nombre: 'EQUIPO SIN INTERNET, NO NAVEGA', puntaje: 5 },
  { id: 'PCREP-07', categoriaId: 'PC-REPARACION', nombre: 'ACCESO A SERVIDOR DE ARCHIVOS', puntaje: 10 },
  // SOFTWARE - INSTALACIÓN O ACTUALIZACIÓN
  { id: 'SW-01', categoriaId: 'SOFTWARE', nombre: 'OFFICE', puntaje: 10 },
  { id: 'SW-02', categoriaId: 'SOFTWARE', nombre: 'VPN', puntaje: 10 },
  { id: 'SW-03', categoriaId: 'SOFTWARE', nombre: 'OTRO', puntaje: 10 },
  // TELEFONÍA
  { id: 'TEL-01', categoriaId: 'TELEFONIA', nombre: 'TELEFONO SIN SERVICIO', puntaje: 10 },
  { id: 'TEL-02', categoriaId: 'TELEFONIA', nombre: 'CAMBIO O REPARACIÓN DE CABLES', puntaje: 10 },
  // VIDEO - PROYECTORES O PANTALLAS
  { id: 'VID-01', categoriaId: 'VIDEO', nombre: 'MANTENIMIENTO PREVENTIVO', puntaje: 10 },
  { id: 'VID-02', categoriaId: 'VIDEO', nombre: 'NO PROYECTA, IMAGEN CON PROBLEMAS', puntaje: 5 },
  { id: 'VID-03', categoriaId: 'VIDEO', nombre: 'OTRO', puntaje: 10 },
  // SERVIDORES (sin subcategoría2)
  { id: 'SRV-01', categoriaId: 'SERVIDORES', nombre: 'SERVIDOR WEB Y BASES DE DATOS', puntaje: 10 },
];

// Opciones específicas para subcategoría2 (actualmente no utilizado)
export const mockSubcategoria2Options: Record<string, { nombre: string; puntaje: number }[]> = {};

export const mockUbicaciones: Ubicacion[] = [
  // Edificio 311
  { id: 'UB-311-01', edificio: 'Edificio 311', nombre: 'ARCHIVO 311', puntaje: 10 },
  { id: 'UB-311-02', edificio: 'Edificio 311', nombre: 'DECANATURA', puntaje: 1 },
  { id: 'UB-311-03', edificio: 'Edificio 311', nombre: 'OFICINA DE APOYO DOCENTE 311', puntaje: 20 },
  { id: 'UB-311-04', edificio: 'Edificio 311', nombre: 'OFICINA DE CALIFICACIONES', puntaje: 10 },
  { id: 'UB-311-05', edificio: 'Edificio 311', nombre: 'OFICINAS DOCENTES', puntaje: 20 },
  { id: 'UB-311-06', edificio: 'Edificio 311', nombre: 'SALONES 311', puntaje: 10 },
  { id: 'UB-311-07', edificio: 'Edificio 311', nombre: 'SECRETARÍA ACADÉMICA', puntaje: 5 },
  { id: 'UB-311-08', edificio: 'Edificio 311', nombre: 'UNIDAD ADMINISTRATIVA', puntaje: 5 },
  { id: 'UB-311-09', edificio: 'Edificio 311', nombre: 'VICEDECANATURA', puntaje: 1 },
  // Edificio 310
  { id: 'UB-310-01', edificio: 'Edificio 310', nombre: 'AUDITORIO PRINCIPAL', puntaje: 10 },
  { id: 'UB-310-02', edificio: 'Edificio 310', nombre: 'AUDITORIOS AUXILIARES', puntaje: 10 },
  { id: 'UB-310-03', edificio: 'Edificio 310', nombre: 'BIBLIOTECA', puntaje: 20 },
  { id: 'UB-310-04', edificio: 'Edificio 310', nombre: 'CADE - OFICINAS PROGRAMAS CURRICULARES', puntaje: 10 },
  { id: 'UB-310-05', edificio: 'Edificio 310', nombre: 'OFICINA APOYO A LA GESTIÓN', puntaje: 20 },
  { id: 'UB-310-06', edificio: 'Edificio 310', nombre: 'OFICINA AREA C. DE CONTABILILIDAD Y F.', puntaje: 10 },
  { id: 'UB-310-07', edificio: 'Edificio 310', nombre: 'OFICINA AREA C. DE ECONOMÍA Y DES.', puntaje: 10 },
  { id: 'UB-310-08', edificio: 'Edificio 310', nombre: 'OFICINA AREA C. DE GESTIÓN Y ORG.', puntaje: 10 },
  { id: 'UB-310-09', edificio: 'Edificio 310', nombre: 'OFICINA BIENESTAR', puntaje: 10 },
  { id: 'UB-310-10', edificio: 'Edificio 310', nombre: 'OFICINA DE SOPORTE TÉCNICO', puntaje: 20 },
  { id: 'UB-310-11', edificio: 'Edificio 310', nombre: 'OFICINA ORI', puntaje: 10 },
  { id: 'UB-310-12', edificio: 'Edificio 310', nombre: 'SALA 1', puntaje: 20 },
  { id: 'UB-310-13', edificio: 'Edificio 310', nombre: 'SALA 2', puntaje: 20 },
  { id: 'UB-310-14', edificio: 'Edificio 310', nombre: 'SALA 3', puntaje: 20 },
  { id: 'UB-310-15', edificio: 'Edificio 310', nombre: 'SALA DE JUNTAS', puntaje: 5 },
  { id: 'UB-310-16', edificio: 'Edificio 310', nombre: 'SALA DE VIDEOCONFERENCIAS', puntaje: 5 },
  { id: 'UB-310-17', edificio: 'Edificio 310', nombre: 'SALONES 310', puntaje: 10 },
  { id: 'UB-310-18', edificio: 'Edificio 310', nombre: 'UACE - SALÓN 205', puntaje: 20 },
  { id: 'UB-310-19', edificio: 'Edificio 310', nombre: 'UNIDAD DE INFORMÁTICA', puntaje: 10 },
  // Edificio 238
  { id: 'UB-238-01', edificio: 'Edificio 238', nombre: 'ARCHIVO 238', puntaje: 20 },
  { id: 'UB-238-02', edificio: 'Edificio 238', nombre: 'CENTRO EDITORIAL', puntaje: 20 },
  { id: 'UB-238-03', edificio: 'Edificio 238', nombre: 'COMUNICACIONES', puntaje: 20 },
  { id: 'UB-238-04', edificio: 'Edificio 238', nombre: 'OFICINA DE APOYO DOCENTE 238', puntaje: 20 },
  { id: 'UB-238-05', edificio: 'Edificio 238', nombre: 'OFICINAS DOCENTES', puntaje: 10 },
  { id: 'UB-238-06', edificio: 'Edificio 238', nombre: 'SALA 6', puntaje: 30 },
  { id: 'UB-238-07', edificio: 'Edificio 238', nombre: 'SALONES 238', puntaje: 30 },
  { id: 'UB-238-08', edificio: 'Edificio 238', nombre: 'UACE - OFICINA', puntaje: 20 },
  { id: 'UB-238-09', edificio: 'Edificio 238', nombre: 'UNIDAD DE EMPRENDIMIENTO', puntaje: 20 },
  { id: 'UB-238-10', edificio: 'Edificio 238', nombre: 'VICEDECANATURA DE INVESTIGACIÓN Y EXT.', puntaje: 10 },
];

export const mockEdificios = ['Edificio 311', 'Edificio 310', 'Edificio 238'];

export const mockCantidadEquipos: CantidadEquipos[] = [
  { rango: '1 a 3 equipos', puntaje: 5 },
  { rango: '4 a 14 equipos', puntaje: 12 },
  { rango: '15 a 30 equipos', puntaje: 20 },
  { rango: 'Más de 30 equipos', puntaje: 30 },
];

export const mockTiemposRespuesta: TiempoRespuesta[] = [
  { puntajeMinimo: 0, puntajeMaximo: 30, tiempo: '48 horas', prioridad: 'baja' },
  { puntajeMinimo: 31, puntajeMaximo: 50, tiempo: '72 horas', prioridad: 'media' },
  { puntajeMinimo: 51, puntajeMaximo: 100, tiempo: '15 días', prioridad: 'critica' },
];

// Usuarios mock
export const mockUsers: User[] = [
  {
    id: 'USR-001',
    nombre: 'Nicole Ariadna Celemin',
    email: 'nacelemint@unal.edu.co',
    rol: 'usuario',
  },
  {
    id: 'TEC-001',
    nombre: 'Diego Fernando Quintero',
    email: 'dfquintero@unal.edu.co',
    rol: 'tecnico',
  },
  {
    id: 'TEC-002',
    nombre: 'María González',
    email: 'mgonzalez@unal.edu.co',
    rol: 'tecnico',
  },
  {
    id: 'ADM-001',
    nombre: 'Sistema',
    email: 'admin@unal.edu.co',
    rol: 'admin',
  },
  {
    id: 'ADM-PROTEGIDO',
    nombre: 'Administrador Principal',
    email: 'uniic_bog@unal.edu.co',
    rol: 'admin',
  },
];

// Tickets mock
export const mockTickets: Ticket[] = [
  {
    id: 'TK-2026-0041',
    usuarioId: 'USR-001',
    usuarioNombre: 'Nicole Celemin',
    usuarioEmail: 'nacelemint@unal.edu.co',
    categoria: 'PC',
    subcategoria: 'Equipo no inicia / Pantalla negra',
    ubicacion: 'Edificio 238 - Sala de Computo 6',
    cantidadEquipos: '1 a 3 equipos',
    telefonoContacto: 'Ext. 123',
    descripcion: 'El computador número 3 presenta pantalla negra completa tras un fuerte bajón de luz ocurrido en el bloque el día de ayer.',
    puntajeTotal: 65,
    prioridad: 'critica',
    tiempoEstimado: '15 días',
    estado: 'abierto',
    tecnicoAsignado: undefined,
    fechaCreacion: new Date('2026-05-24T14:22:00'),
    comentarios: [],
  },
  {
    id: 'TK-2026-0039',
    usuarioId: 'USR-002',
    usuarioNombre: 'Prof. Pablo Bueno',
    usuarioEmail: 'pbueno@unal.edu.co',
    categoria: 'Software',
    subcategoria: 'Falla VPN / Autenticación',
    ubicacion: 'Edificio 311 - Cubículo 204',
    cantidadEquipos: '1 a 3 equipos',
    telefonoContacto: 'Ext. 456',
    descripcion: 'Falla de autenticación en cliente AnyConnect institucional. No permite validar el token de seguridad corporativo.',
    puntajeTotal: 35,
    prioridad: 'media',
    tiempoEstimado: '72 horas',
    estado: 'en_proceso',
    tecnicoAsignado: 'TEC-001',
    fechaCreacion: new Date('2026-05-22T09:15:00'),
    fechaActualizacion: new Date('2026-05-23T10:30:00'),
    comentarios: [
      {
        id: 'COM-001',
        ticketId: 'TK-2026-0039',
        autor: 'Diego Fernando Quintero',
        autorRol: 'tecnico',
        contenido: 'Iniciando diagnóstico del cliente VPN. Se requiere validación de credenciales.',
        fecha: new Date('2026-05-23T10:30:00'),
      },
    ],
  },
  {
    id: 'TK-2026-0035',
    usuarioId: 'USR-003',
    usuarioNombre: 'Decanatura FCE',
    usuarioEmail: 'decanatura@unal.edu.co',
    categoria: 'Impresoras',
    subcategoria: 'No imprime / Atascado',
    ubicacion: 'Edificio 311 - Oficina 102',
    cantidadEquipos: '1 a 3 equipos',
    telefonoContacto: 'Ext. 789',
    descripcion: 'Impresora HP LaserJet no responde. Indicador de error encendido.',
    puntajeTotal: 15,
    prioridad: 'baja',
    tiempoEstimado: '48 horas',
    estado: 'abierto',
    tecnicoAsignado: undefined,
    fechaCreacion: new Date('2026-05-20T16:45:00'),
    comentarios: [],
  },
];

// Auditoría mock
export const mockAuditoria: Auditoria[] = [
  {
    id: 'AUD-001',
    ticketId: 'TK-2026-0041',
    accion: 'creacion_ticket',
    usuario: 'Nicole Celemin',
    usuarioRol: 'usuario',
    fecha: new Date('2026-05-24T14:22:00'),
    detalles: {},
  },
  {
    id: 'AUD-002',
    ticketId: 'TK-2026-0039',
    accion: 'creacion_ticket',
    usuario: 'Prof. Pablo Bueno',
    usuarioRol: 'usuario',
    fecha: new Date('2026-05-22T09:15:00'),
    detalles: {},
  },
  {
    id: 'AUD-003',
    ticketId: 'TK-2026-0039',
    accion: 'asignacion_ticket',
    usuario: 'Diego Fernando Quintero',
    usuarioRol: 'tecnico',
    fecha: new Date('2026-05-22T10:00:00'),
    detalles: {
      tecnicoNuevo: 'TEC-001',
    },
  },
  {
    id: 'AUD-004',
    ticketId: 'TK-2026-0039',
    accion: 'cambio_estado',
    usuario: 'Diego Fernando Quintero',
    usuarioRol: 'tecnico',
    fecha: new Date('2026-05-23T10:30:00'),
    detalles: {
      estadoAnterior: 'abierto',
      estadoNuevo: 'en_atencion',
    },
  },
  {
    id: 'AUD-005',
    ticketId: 'TK-2026-0039',
    accion: 'inclusion_comentario',
    usuario: 'Diego Fernando Quintero',
    usuarioRol: 'tecnico',
    fecha: new Date('2026-05-23T10:30:00'),
    detalles: {
      comentario: 'Iniciando diagnóstico del cliente VPN. Se requiere validación de credenciales.',
    },
  },
];
