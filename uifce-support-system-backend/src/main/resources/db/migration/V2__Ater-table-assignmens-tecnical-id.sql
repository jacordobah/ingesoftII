ALTER TABLE asignaciones
DROP FOREIGN KEY asignaciones_ibfk_2;

ALTER TABLE asignaciones
    ADD COLUMN tecnico_id BIGINT;

ALTER TABLE asignaciones
    ADD CONSTRAINT fk_asignaciones_tecnico FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id) ON DELETE CASCADE;