const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Obtener todos los tickets
router.get('/', async (req, res) => {
  try {
    const { estado, tecnico, usuario } = req.query;
    let query = `
      SELECT t.*, 
             u.nombre as usuario_nombre,
             tec.nombre as tecnico_nombre
      FROM tickets t
      LEFT JOIN usuarios u ON t.usuario_id = u.id
      LEFT JOIN usuarios tec ON t.tecnico_asignado = tec.id
      WHERE 1=1
    `;
    const params = [];

    if (estado) {
      query += ' AND t.estado = ?';
      params.push(estado);
    }
    if (tecnico) {
      query += ' AND t.tecnico_asignado = ?';
      params.push(tecnico);
    }
    if (usuario) {
      query += ' AND t.usuario_id = ?';
      params.push(usuario);
    }

    query += ' ORDER BY t.fecha_creacion DESC';

    const [tickets] = await pool.query(query, params);
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
});

// Obtener ticket por ID
router.get('/:id', async (req, res) => {
  try {
    const [tickets] = await pool.query(
      `SELECT t.*, 
              u.nombre as usuario_nombre,
              tec.nombre as tecnico_nombre
       FROM tickets t
       LEFT JOIN usuarios u ON t.usuario_id = u.id
       LEFT JOIN usuarios tec ON t.tecnico_asignado = tec.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Obtener comentarios del ticket
    const [comentarios] = await pool.query(
      `SELECT c.*, u.nombre as usuario_nombre
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.ticket_id = ?
       ORDER BY c.fecha_creacion ASC`,
      [req.params.id]
    );

    res.json({ ...tickets[0], comentarios });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
});

// Crear ticket
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { usuario_id, categoria, subcategoria, ubicacion, descripcion, prioridad, puntaje } = req.body;
    const ticketId = `TKT-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Insertar ticket
    await connection.query(
      `INSERT INTO tickets (id, usuario_id, categoria, subcategoria, ubicacion, descripcion, prioridad, puntaje, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'abierto')`,
      [ticketId, usuario_id, categoria, subcategoria, ubicacion, descripcion, prioridad || 'media', puntaje || 0]
    );

    // Registrar en auditoría
    await connection.query(
      `INSERT INTO auditoria (id, ticket_id, usuario_id, usuario_rol, accion, detalles)
       VALUES (?, ?, ?, ?, 'creacion_ticket', ?)`,
      [uuidv4(), ticketId, usuario_id, 'usuario', JSON.stringify({ categoria, subcategoria, ubicacion })]
    );

    await connection.commit();
    res.status(201).json({ message: 'Ticket creado exitosamente', id: ticketId });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error al crear ticket' });
  } finally {
    connection.release();
  }
});

// Actualizar ticket completo
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { estado, tecnico_asignado, categoria, subcategoria, ubicacion } = req.body;
    const ticketId = req.params.id;

    // Obtener ticket actual
    const [tickets] = await connection.query('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    if (tickets.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const ticketActual = tickets[0];
    const usuario_id = req.body.usuario_id || ticketActual.usuario_id;

    // Actualizar ticket
    await connection.query(
      `UPDATE tickets 
       SET estado = ?, tecnico_asignado = ?, categoria = ?, subcategoria = ?, ubicacion = ?,
           fecha_asignacion = IF(? IS NOT NULL AND ? IS NULL, NOW(), fecha_asignacion),
           fecha_resolucion = IF(? = 'cerrado' AND ? != 'cerrado', NOW(), fecha_resolucion)
       WHERE id = ?`,
      [estado, tecnico_asignado, categoria, subcategoria, ubicacion,
       tecnico_asignado, ticketActual.tecnico_asignado,
       estado, ticketActual.estado,
       ticketId]
    );

    // Registrar auditoría si hubo cambios
    if (estado !== ticketActual.estado) {
      await connection.query(
        `INSERT INTO auditoria (id, ticket_id, usuario_id, usuario_rol, accion, detalles)
         VALUES (?, ?, ?, ?, 'cambio_estado', ?)`,
        [uuidv4(), ticketId, usuario_id, req.body.usuario_rol || 'admin',
         JSON.stringify({ estadoAnterior: ticketActual.estado, estadoNuevo: estado })]
      );
    }

    if (tecnico_asignado !== ticketActual.tecnico_asignado) {
      await connection.query(
        `INSERT INTO auditoria (id, ticket_id, usuario_id, usuario_rol, accion, detalles)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), ticketId, usuario_id, req.body.usuario_rol || 'admin',
         ticketActual.tecnico_asignado ? 'reasignacion_ticket' : 'asignacion_ticket',
         JSON.stringify({ tecnicoAnterior: ticketActual.tecnico_asignado, tecnicoNuevo: tecnico_asignado })]
      );
    }

    if (categoria !== ticketActual.categoria || subcategoria !== ticketActual.subcategoria) {
      await connection.query(
        `INSERT INTO auditoria (id, ticket_id, usuario_id, usuario_rol, accion, detalles)
         VALUES (?, ?, ?, ?, 'modificacion_categoria', ?)`,
        [uuidv4(), ticketId, usuario_id, req.body.usuario_rol || 'admin',
         JSON.stringify({ categoriaAnterior: ticketActual.categoria, categoriaNueva: categoria,
                        subcategoriaAnterior: ticketActual.subcategoria, subcategoriaNueva: subcategoria })]
      );
    }

    await connection.commit();
    res.json({ message: 'Ticket actualizado exitosamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar ticket:', error);
    res.status(500).json({ error: 'Error al actualizar ticket' });
  } finally {
    connection.release();
  }
});

// Agregar comentario a ticket
router.post('/:id/comentarios', async (req, res) => {
  try {
    const { usuario_id, comentario } = req.body;
    const comentarioId = uuidv4();

    await pool.query(
      'INSERT INTO comentarios (id, ticket_id, usuario_id, comentario) VALUES (?, ?, ?, ?)',
      [comentarioId, req.params.id, usuario_id, comentario]
    );

    // Registrar en auditoría
    const [usuarios] = await pool.query('SELECT rol FROM usuarios WHERE id = ?', [usuario_id]);
    const rol = usuarios[0]?.rol || 'usuario';

    await pool.query(
      `INSERT INTO auditoria (id, ticket_id, usuario_id, usuario_rol, accion, detalles)
       VALUES (?, ?, ?, ?, 'inclusion_comentario', ?)`,
      [uuidv4(), req.params.id, usuario_id, rol, JSON.stringify({ comentario })]
    );

    res.status(201).json({ message: 'Comentario agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
});

// Eliminar ticket
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tickets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ticket eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ error: 'Error al eliminar ticket' });
  }
});

module.exports = router;
