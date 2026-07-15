DROP TABLE IF EXISTS auditoria;
DROP TABLE IF EXISTS asignaciones;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS subcategorias;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS oficinas;
DROP TABLE IF EXISTS edificios;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    -- password VARCHAR(255) NOT NULL,
    rol ENUM('Usuario', 'Tecnico', 'Administrador') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_rol (rol),
    INDEX idx_email (email)
);


CREATE TABLE categorias (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

CREATE TABLE subcategorias (
    id BIGINT NOT NULL AUTO_INCREMENT,
    categoria_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL,
    activo  BOOLEAN DEFAULT TRUE,
    fecha_creacion  TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,

    INDEX idx_categoria (categoria_id)
);

CREATE TABLE edificios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    numero INT UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

CREATE TABLE oficinas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    edificio_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (edificio_id) REFERENCES edificios(id) ON DELETE CASCADE,

    INDEX idx_edificio (edificio_id)
);

CREATE TABLE tickets (
    id VARCHAR(50) NOT NULL,
    usuario_id BIGINT NOT NULL,
    subcategoria_id BIGINT NOT NULL,
    oficina_id BIGINT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad_equipos INT NOT NULL,
    tiempo_de_respuesta VARCHAR(20) NOT NULL,
    prioridad ENUM('Baja', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
    estado ENUM('Abierto', 'En_proceso', 'Cerrado') NOT NULL DEFAULT 'Abierto',
    puntaje INT NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    comentario TEXT,

    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE,
    FOREIGN KEY (oficina_id) REFERENCES oficinas(id) ON DELETE CASCADE,


    INDEX idx_usuario (usuario_id),
    INDEX idx_subcategoria (subcategoria_id),
    INDEX idx_oficina (oficina_id),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha_creacion (fecha_creacion)
);

CREATE TABLE asignaciones(
    id BIGINT NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    ticket_id VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_ticket (ticket_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha)
);

CREATE TABLE auditoria (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ticket_id VARCHAR(50),
    categoria_id BIGINT,
    subcategoria_id BIGINT,
    usuario_id BIGINT NOT NULL,
    usuario_rol VARCHAR(20) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    detalles JSON,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE,

    INDEX idx_ticket (ticket_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_subcategoria (subcategoria_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (fecha)
);

