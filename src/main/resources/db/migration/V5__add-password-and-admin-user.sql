-- Agregar campo de contraseña a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'Admin123!';

-- Insertar usuario admin por defecto
INSERT INTO usuarios (nombre, email, password, rol, activo) 
VALUES ('Administrador', 'uniic_bog@unal.edu.co', 'Admin123!', 'Administrador', TRUE)
ON DUPLICATE KEY UPDATE nombre = 'Administrador';
