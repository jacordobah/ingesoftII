-- Crear base de datos (ejecutar como postgres)
-- CREATE DATABASE uifce_support;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('usuario', 'tecnico', 'admin')),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Tabla de subcategorías
CREATE TABLE IF NOT EXISTS subcategorias (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    puntaje INTEGER NOT NULL CHECK (puntaje >= 1 AND puntaje <= 10),
    descripcion TEXT,
    UNIQUE (categoria_id, nombre)
);

-- Tabla de edificios
CREATE TABLE IF NOT EXISTS edificios (
    nombre VARCHAR(255) PRIMARY KEY
);

-- Tabla de ubicaciones
CREATE TABLE IF NOT EXISTS ubicaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    edificio VARCHAR(255) REFERENCES edificios(nombre) ON DELETE CASCADE,
    puntaje INTEGER NOT NULL CHECK (puntaje >= 1 AND puntaje <= 10),
    UNIQUE (edificio, nombre)
);

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(20) PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    subcategoria VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    edificio VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'critica')),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('abierto', 'en_proceso', 'cerrado')) DEFAULT 'abierto',
    tecnico_asignado INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_asignacion TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    tiempo_estimado INTEGER NOT NULL
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(20) REFERENCES tickets(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_nombre VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_usuario_id ON tickets(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_prioridad ON tickets(prioridad);
CREATE INDEX IF NOT EXISTS idx_tickets_fecha_creacion ON tickets(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_comentarios_ticket_id ON comentarios(ticket_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
