-- Esquema de Base de Datos para Sistema de Soporte UIFCE
-- MySQL 8.0+

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS uifce_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uifce_support;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'tecnico', 'admin') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rol (rol),
    INDEX idx_email (email)
);

-- Tabla de categorías
CREATE TABLE categorias (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de subcategorías
CREATE TABLE subcategorias (
    id VARCHAR(50) PRIMARY KEY,
    categoria_id VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria_id)
);

-- Tabla de edificios
CREATE TABLE edificios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ubicaciones
CREATE TABLE ubicaciones (
    id VARCHAR(50) PRIMARY KEY,
    edificio_id VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (edificio_id) REFERENCES edificios(id) ON DELETE CASCADE,
    INDEX idx_edificio (edificio_id)
);

-- Tabla de tickets
CREATE TABLE tickets (
    id VARCHAR(50) PRIMARY KEY,
    usuario_id VARCHAR(50) NOT NULL,
    tecnico_asignado VARCHAR(50),
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad ENUM('baja', 'media', 'critica') NOT NULL DEFAULT 'media',
    estado ENUM('abierto', 'en_proceso', 'cerrado') NOT NULL DEFAULT 'abierto',
    puntaje INT NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_asignacion TIMESTAMP NULL,
    fecha_resolucion TIMESTAMP NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnico_asignado) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tecnico (tecnico_asignado),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Tabla de comentarios de tickets
CREATE TABLE comentarios (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL,
    usuario_id VARCHAR(50) NOT NULL,
    comentario TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_ticket (ticket_id),
    INDEX idx_fecha (fecha_creacion)
);

-- Tabla de auditoría
CREATE TABLE auditoria (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50),
    usuario_id VARCHAR(50) NOT NULL,
    usuario_rol VARCHAR(20) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    detalles JSON,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_ticket (ticket_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (fecha)
);

-- Datos iniciales de ejemplo
INSERT INTO usuarios (id, nombre, email, password, rol) VALUES
('USR-001', 'Juan Pérez', 'juan.perez@uifce.edu', '$2b$10$placeholder_hash', 'usuario'),
('USR-002', 'María García', 'maria.garcia@uifce.edu', '$2b$10$placeholder_hash', 'usuario'),
('TEC-001', 'Carlos Rodríguez', 'carlos.rodriguez@uifce.edu', '$2b$10$placeholder_hash', 'tecnico'),
('TEC-002', 'Ana Martínez', 'ana.martinez@uifce.edu', '$2b$10$placeholder_hash', 'tecnico'),
('ADM-001', 'Admin Sistema', 'admin@uifce.edu', '$2b$10$placeholder_hash', 'admin');

INSERT INTO categorias (id, nombre, descripcion) VALUES
('CAT-001', 'Hardware', 'Problemas con equipos físicos'),
('CAT-002', 'Software', 'Problemas con aplicaciones y sistemas'),
('CAT-003', 'Red', 'Problemas de conectividad y red'),
('CAT-004', 'Impresoras', 'Problemas con impresoras y escáneres');

INSERT INTO subcategorias (id, categoria_id, nombre, puntaje) VALUES
('SUB-001', 'CAT-001', 'Computadora no enciende', 10),
('SUB-002', 'CAT-001', 'Pantalla dañada', 8),
('SUB-003', 'CAT-001', 'Teclado/mouse no funciona', 5),
('SUB-004', 'CAT-002', 'Windows no inicia', 9),
('SUB-005', 'CAT-002', 'Aplicación no responde', 7),
('SUB-006', 'CAT-003', 'Sin conexión a internet', 8),
('SUB-007', 'CAT-003', 'Wi-Fi lento', 5),
('SUB-008', 'CAT-004', 'Impresora no imprime', 6),
('SUB-009', 'CAT-004', 'Atascos de papel', 4);

INSERT INTO edificios (id, nombre) VALUES
('ED-001', 'Edificio A'),
('ED-002', 'Edificio B'),
('ED-003', 'Edificio C');

INSERT INTO ubicaciones (id, edificio_id, nombre, puntaje) VALUES
('UBI-001', 'ED-001', 'Edificio A - Piso 1', 3),
('UBI-002', 'ED-001', 'Edificio A - Piso 2', 3),
('UBI-003', 'ED-002', 'Edificio B - Piso 1', 3),
('UBI-004', 'ED-002', 'Edificio B - Piso 2', 3),
('UBI-005', 'ED-003', 'Edificio C - Piso 1', 3),
('UBI-006', 'ED-003', 'Edificio C - Piso 2', 3);
