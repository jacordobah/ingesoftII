-- Agregar campos OAuth a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN google_id VARCHAR(255) UNIQUE;

-- Actualizar usuarios existentes con valor NULL para google_id
UPDATE usuarios SET google_id = NULL WHERE google_id IS NULL;
