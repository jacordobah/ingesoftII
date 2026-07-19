-- Agregar campo de contraseña a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'temp_password';

-- Insertar usuario admin por defecto (contraseña temporal)
INSERT INTO usuarios (nombre, email, password, rol, activo) 
VALUES ('Administrador', 'uniic_bog@unal.edu.co', 'temp_password', 'Administrador', TRUE)
ON DUPLICATE KEY UPDATE nombre = 'Administrador';
