-- La V2 agrego la columna tecnico_id para reemplazar a usuario_id en la
-- tabla asignaciones (los triggers de auditoria en V3 ya usan NEW.tecnico_id),
-- pero nunca elimino ni volvio nullable la columna original usuario_id.
-- Al quedar NOT NULL sin valor por defecto, todo INSERT hecho por la
-- aplicacion (que solo conoce tecnico_id) fallaba con:
-- "Field 'usuario_id' doesn't have a default".
ALTER TABLE asignaciones
    DROP COLUMN usuario_id;
