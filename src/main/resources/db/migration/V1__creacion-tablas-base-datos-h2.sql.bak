DROP TABLE IF EXISTS auditoria;
DROP TABLE IF EXISTS asignaciones;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS subcategorias;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS oficinas;
DROP TABLE IF EXISTS edificios;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Usuario', 'Tecnico', 'Administrador')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rol ON usuarios(rol);
CREATE INDEX idx_email ON usuarios(email);

CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

CREATE INDEX idx_categoria ON subcategorias(categoria_id);

CREATE TABLE edificios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero INT UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oficinas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    edificio_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puntaje INT NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (edificio_id) REFERENCES edificios(id) ON DELETE CASCADE
);

CREATE INDEX idx_edificio ON oficinas(edificio_id);

CREATE TABLE tickets (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    subcategoria_id BIGINT NOT NULL,
    oficina_id BIGINT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad_equipos INT NOT NULL,
    tiempo_de_respuesta VARCHAR(20) NOT NULL,
    prioridad VARCHAR(20) NOT NULL DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
    estado VARCHAR(20) NOT NULL DEFAULT 'Abierto' CHECK (estado IN ('Abierto', 'En_proceso', 'Cerrado')),
    puntaje INT NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE,
    FOREIGN KEY (oficina_id) REFERENCES oficinas(id) ON DELETE CASCADE
);

CREATE INDEX idx_usuario ON tickets(usuario_id);
CREATE INDEX idx_subcategoria ON tickets(subcategoria_id);
CREATE INDEX idx_oficina ON tickets(oficina_id);
CREATE INDEX idx_estado ON tickets(estado);
CREATE INDEX idx_prioridad ON tickets(prioridad);
CREATE INDEX idx_fecha_creacion ON tickets(fecha_creacion);

CREATE TABLE asignaciones(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    ticket_id VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_ticket ON asignaciones(ticket_id);
CREATE INDEX idx_usuario_asignaciones ON asignaciones(usuario_id);
CREATE INDEX idx_fecha ON asignaciones(fecha);

CREATE TABLE auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50),
    categoria_id BIGINT,
    subcategoria_id BIGINT,
    usuario_id BIGINT NOT NULL,
    usuario_rol VARCHAR(20) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    detalles CLOB,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE
);

CREATE INDEX idx_ticket_auditoria ON auditoria(ticket_id);
CREATE INDEX idx_usuario_auditoria ON auditoria(usuario_id);
CREATE INDEX idx_subcategoria_auditoria ON auditoria(subcategoria_id);
CREATE INDEX idx_categoria_auditoria ON auditoria(categoria_id);
CREATE INDEX idx_accion ON auditoria(accion);
CREATE INDEX idx_fecha_auditoria ON auditoria(fecha);

-- Insertar usuario admin por defecto
INSERT INTO usuarios (nombre, email, password, rol, activo) 
VALUES ('Administrador', 'uniic_bog@unal.edu.co', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', TRUE);
