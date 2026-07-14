export const seedUsers = [
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
    nombre: 'Maria Gonzalez',
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

export const seedCategorias = [
  { id: 'CONCEPTOS', nombre: 'CONCEPTOS TECNICOS' },
  { id: 'IMPRESORAS', nombre: 'IMPRESORAS' },
  { id: 'PC-INSTALACION', nombre: 'PC Y PORTATILES - INSTALACION Y ALISTAMIENTO' },
  { id: 'PC-UBICACION', nombre: 'PC Y PORTATILES - CAMBIO DE UBICACION' },
  { id: 'PC-MANTENIMIENTO', nombre: 'PC Y PORTATILES - MANTENIMIENTO PREVENTIVO' },
  { id: 'PC-REPARACION', nombre: 'PC Y PORTATILES - REVISION Y REPARACION' },
  { id: 'SOFTWARE', nombre: 'SOFTWARE - INSTALACION O ACTUALIZACION' },
  { id: 'TELEFONIA', nombre: 'TELEFONIA' },
  { id: 'VIDEO', nombre: 'VIDEO - PROYECTORES O PANTALLAS' },
  { id: 'SERVIDORES', nombre: 'SERVIDORES' },
];

export const seedSubcategorias = [
  { id: 'CON-01', categoriaId: 'CONCEPTOS', nombre: 'BAJAS', puntaje: 50 },
  { id: 'CON-02', categoriaId: 'CONCEPTOS', nombre: 'COMPRAS', puntaje: 70 },
  { id: 'IMP-01', categoriaId: 'IMPRESORAS', nombre: 'MANTENIMIENTO PREVENTIVO', puntaje: 30 },
  { id: 'IMP-02', categoriaId: 'IMPRESORAS', nombre: 'INSTALACION O CONEXION', puntaje: 10 },
  { id: 'PCREP-01', categoriaId: 'PC-REPARACION', nombre: 'HARDWARE - EQUIPO NO ENCIENDE', puntaje: 5 },
  { id: 'PCREP-04', categoriaId: 'PC-REPARACION', nombre: 'SOFTWARE - EQUIPO LENTO', puntaje: 10 },
  { id: 'SW-01', categoriaId: 'SOFTWARE', nombre: 'OFFICE', puntaje: 10 },
  { id: 'SW-02', categoriaId: 'SOFTWARE', nombre: 'VPN', puntaje: 10 },
  { id: 'TEL-01', categoriaId: 'TELEFONIA', nombre: 'TELEFONO SIN SERVICIO', puntaje: 10 },
  { id: 'VID-02', categoriaId: 'VIDEO', nombre: 'NO PROYECTA, IMAGEN CON PROBLEMAS', puntaje: 5 },
  { id: 'SRV-01', categoriaId: 'SERVIDORES', nombre: 'SERVIDOR WEB Y BASES DE DATOS', puntaje: 10 },
];

export const seedEdificios = ['Edificio 311', 'Edificio 310', 'Edificio 238'];

export const seedUbicaciones = [
  { id: 'UB-311-01', edificio: 'Edificio 311', nombre: 'ARCHIVO 311', puntaje: 10 },
  { id: 'UB-311-02', edificio: 'Edificio 311', nombre: 'DECANATURA', puntaje: 1 },
  { id: 'UB-311-06', edificio: 'Edificio 311', nombre: 'SALONES 311', puntaje: 10 },
  { id: 'UB-310-01', edificio: 'Edificio 310', nombre: 'AUDITORIO PRINCIPAL', puntaje: 10 },
  { id: 'UB-310-03', edificio: 'Edificio 310', nombre: 'BIBLIOTECA', puntaje: 20 },
  { id: 'UB-310-10', edificio: 'Edificio 310', nombre: 'OFICINA DE SOPORTE TECNICO', puntaje: 20 },
  { id: 'UB-238-01', edificio: 'Edificio 238', nombre: 'ARCHIVO 238', puntaje: 20 },
  { id: 'UB-238-06', edificio: 'Edificio 238', nombre: 'SALA 6', puntaje: 30 },
  { id: 'UB-238-07', edificio: 'Edificio 238', nombre: 'SALONES 238', puntaje: 30 },
];

export const seedTickets = [
  {
    id: 'TK-2026-0041',
    usuarioId: 'USR-001',
    usuarioNombre: 'Nicole Celemin',
    usuarioEmail: 'nacelemint@unal.edu.co',
    categoria: 'PC',
    subcategoria: 'Equipo no inicia / Pantalla negra',
    ubicacion: 'Edificio 238 - Sala de Computo 6',
    cantidadEquipos: '1',
    telefonoContacto: 'Ext. 123',
    descripcion: 'El computador numero 3 presenta pantalla negra completa tras un bajon de luz.',
    puntajeTotal: 65,
    prioridad: 'critica',
    tiempoEstimado: '15 dias',
    estado: 'abierto',
    fechaCreacion: new Date('2026-05-24T14:22:00'),
    comentarios: [],
  },
  {
    id: 'TK-2026-0039',
    usuarioId: 'USR-001',
    usuarioNombre: 'Nicole Celemin',
    usuarioEmail: 'nacelemint@unal.edu.co',
    categoria: 'Software',
    subcategoria: 'Falla VPN / Autenticacion',
    ubicacion: 'Edificio 311 - Cubiculo 204',
    cantidadEquipos: '1',
    telefonoContacto: 'Ext. 456',
    descripcion: 'Falla de autenticacion en cliente VPN institucional.',
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
        contenido: 'Iniciando diagnostico del cliente VPN.',
        fecha: new Date('2026-05-23T10:30:00'),
      },
    ],
  },
];

export const seedAuditoria = [
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
    usuario: 'Nicole Celemin',
    usuarioRol: 'usuario',
    fecha: new Date('2026-05-22T09:15:00'),
    detalles: {},
  },
];
