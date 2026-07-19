-- 1. TRIGGERS PARA TICKETS (Creación, Cambio de Estado, Cambio Asignación)


CREATE TRIGGER tg_tickets_alta AFTER INSERT ON tickets
    FOR EACH ROW
BEGIN
    DECLARE v_edificio_id BIGINT;
    DECLARE v_oficina_nombre VARCHAR(100);

    SELECT edificio_id, nombre INTO v_edificio_id, v_oficina_nombre
    FROM oficinas WHERE id = NEW.oficina_id;

    INSERT INTO auditoria (ticket_id, subcategoria_id, usuario_id, usuario_rol, accion, detalles)
    VALUES (
               NEW.id,
               NEW.subcategoria_id,
               COALESCE(@usuario_id_auditoria, NEW.usuario_id),
               COALESCE(@usuario_rol_auditoria, 'Usuario'),
               'CREACION_TICKET',
               JSON_OBJECT(
                       'descripcion', NEW.descripcion,
                       'prioridad', NEW.prioridad,
                       'oficina_id', NEW.oficina_id,
                       'oficina_nombre', v_oficina_nombre,
                       'edificio_id', v_edificio_id
               )
           );
END;

CREATE TRIGGER tg_tickets_cambio AFTER UPDATE ON tickets
    FOR EACH ROW
BEGIN
    DECLARE v_detalles JSON;
    SET v_detalles = JSON_OBJECT();

    IF OLD.estado <> NEW.estado THEN
        SET v_detalles = JSON_SET(v_detalles,
            '$.estado_anterior', OLD.estado,
            '$.estado_posterior', NEW.estado
        );

        IF NEW.estado = 'Cerrado' THEN
            SET v_detalles = JSON_SET(v_detalles, '$.comentario_cierre', COALESCE(NEW.comentario, 'Sin comentario registrado'));
END IF;

INSERT INTO auditoria (ticket_id, subcategoria_id, usuario_id, usuario_rol, accion, detalles)
VALUES (
           NEW.id, NEW.subcategoria_id,
           COALESCE(@usuario_id_auditoria, NEW.usuario_id),
           COALESCE(@usuario_rol_auditoria, 'Tecnico'),
           'CAMBIO_ESTADO_TICKET',
           v_detalles
       );
END IF;
END;

CREATE TRIGGER tg_asignaciones_cambio AFTER INSERT ON asignaciones
    FOR EACH ROW
BEGIN
    DECLARE v_conteo INT;
    DECLARE v_accion VARCHAR(50);

    SELECT COUNT(*) INTO v_conteo FROM asignaciones WHERE ticket_id = NEW.ticket_id;

    IF v_conteo > 1 THEN
        SET v_accion = 'REASIGNACION_TICKET';
    ELSE
        SET v_accion = 'ASIGNACION_TICKET';
END IF;

INSERT INTO auditoria (ticket_id, usuario_id, usuario_rol, accion, detalles)
VALUES (
           NEW.ticket_id,
           COALESCE(@usuario_id_auditoria, NEW.tecnico_id),
           COALESCE(@usuario_rol_auditoria, 'Administrador'),
           v_accion,
           JSON_OBJECT('tecnico_asignado_id', NEW.tecnico_id)
       );
END;

-- 2. TRIGGERS PARA CATEGORÍAS (Creación, Modificación, Baja Lógica)

CREATE TRIGGER tg_categorias_cambio AFTER UPDATE ON categorias
    FOR EACH ROW
BEGIN
    IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
        INSERT INTO auditoria (categoria_id, usuario_id, usuario_rol, accion, detalles)
        VALUES (
            NEW.id, COALESCE(@usuario_id_auditoria, 1), COALESCE(@usuario_rol_auditoria, 'Administrador'),
            'ELIMINACION_LOGICA_CATEGORIA', JSON_OBJECT('nombre', NEW.nombre, 'motivo', 'Desactivación del sistema')
        );
    ELSEIF OLD.nombre <> NEW.nombre OR OLD.descripcion <> NEW.descripcion THEN
        INSERT INTO auditoria (categoria_id, usuario_id, usuario_rol, accion, detalles)
        VALUES (
            NEW.id, COALESCE(@usuario_id_auditoria, 1), COALESCE(@usuario_rol_auditoria, 'Administrador'),
            'MODIFICACION_CATEGORIA',
            JSON_OBJECT(
                'nombre_anterior', OLD.nombre, 'nombre_nuevo', NEW.nombre,
                'descripcion_anterior', OLD.descripcion, 'descripcion_nuevo', NEW.descripcion
            )
        );
END IF;
END;

CREATE TRIGGER tg_categorias_alta AFTER INSERT ON categorias
    FOR EACH ROW
BEGIN
    INSERT INTO auditoria (categoria_id, usuario_id, usuario_rol, accion, detalles)
    VALUES (
               NEW.id, COALESCE(@usuario_id_auditoria, 1), COALESCE(@usuario_rol_auditoria, 'Administrador'),
               'CREACION_CATEGORIA', JSON_OBJECT('nombre', NEW.nombre)
           );
END;

-- 3. TRIGGERS PARA SUBCATEGORÍAS (Creación, Modificación, Baja Lógica)

CREATE TRIGGER tg_subcategorias_cambio AFTER UPDATE ON subcategorias
    FOR EACH ROW
BEGIN
    IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
        INSERT INTO auditoria (subcategoria_id, categoria_id, usuario_id, usuario_rol, accion, detalles)
        VALUES (
            NEW.id, NEW.categoria_id, COALESCE(@usuario_id_auditoria, 1), COALESCE(@usuario_rol_auditoria, 'Administrador'),
            'ELIMINACION_LOGICA_SUBCATEGORIA', JSON_OBJECT('nombre', NEW.nombre)
        );
    ELSEIF OLD.nombre <> NEW.nombre OR OLD.puntaje <> NEW.puntaje THEN
        INSERT INTO auditoria (subcategoria_id, categoria_id, usuario_id, usuario_rol, accion, detalles)
        VALUES (
            NEW.id, NEW.categoria_id, COALESCE(@usuario_id_auditoria, 1), COALESCE(@usuario_rol_auditoria, 'Administrador'),
            'MODIFICACION_SUBCATEGORIA',
            JSON_OBJECT(
                'nombre_anterior', OLD.nombre, 'nombre_nuevo', NEW.nombre,
                'puntaje_anterior', OLD.puntaje, 'puntaje_nuevo', NEW.puntaje
            )
        );
END IF;
END;

CREATE TRIGGER tg_subcategorias_alta AFTER INSERT ON subcategorias
    FOR EACH ROW
BEGIN
    INSERT INTO auditoria (subcategoria_id, categoria_id, usuario_id, usuario_rol, accion, detalles)
    VALUES (
               NEW.id, NEW.categoria_id, COALESCE(@usuario_id_auditoria, 1), COALESCE(@usuario_rol_auditoria, 'Administrador'),
               'CREACION_SUBCATEGORIA', JSON_OBJECT('nombre', NEW.nombre, 'puntaje', NEW.puntaje)
           );
END;

-- 4. TRIGGERS PARA USUARIOS (Cambio de Rol y delete Lógico de Técnicos)

CREATE TRIGGER tg_usuarios_cambio AFTER UPDATE ON usuarios
    FOR EACH ROW
BEGIN
    IF OLD.rol <> NEW.rol THEN
        INSERT INTO auditoria (usuario_id, usuario_rol, accion, detalles)
        VALUES (
            NEW.id,
            COALESCE(@usuario_rol_auditoria, 'Administrador'),
            'CAMBIO_ROL_USUARIO',
            JSON_OBJECT('usuario_afectado_id', NEW.id, 'rol_anterior', OLD.rol, 'rol_nuevo', NEW.rol)
        );
END IF;

IF OLD.activo = TRUE AND NEW.activo = FALSE AND NEW.rol = 'Tecnico' THEN
        INSERT INTO auditoria (usuario_id, usuario_rol, accion, detalles)
        VALUES (
            NEW.id,
            COALESCE(@usuario_rol_auditoria, 'Administrador'),
            'ELIMINACION_LOGICA_TECNICO',
            JSON_OBJECT('tecnico_id', NEW.id, 'nombre_tecnico', NEW.nombre)
        );
END IF;
END;
