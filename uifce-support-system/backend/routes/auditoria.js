const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener todos los registros de auditoría
router.get('/', async (req, res) => {
  try {
    const { limit = 100, ticket_id } = req.query;
    let query = `
      SELECT a.*, 
             u.nombre as usuario_nombre
      FROM auditoria a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (ticket_id) {
      query += ' AND a.ticket_id = ?';
      params.push(ticket_id);
    }

    query += ' ORDER BY a.fecha DESC LIMIT ?';
    params.push(parseInt(limit));

    const [auditoria] = await pool.query(query, params);
    res.json(auditoria);
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    res.status(500).json({ error: 'Error al obtener auditoría' });
  }
});

// Obtener registro de auditoría por ID
router.get('/:id', async (req, res) => {
  try {
    const [auditoria] = await pool.query(
      `SELECT a.*, u.nombre as usuario_nombre
       FROM auditoria a
       JOIN usuarios u ON a.usuario_id = u.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (auditoria.length === 0) {
      return res.status(404).json({ error: 'Registro de auditoría no encontrado' });
    }

    res.json(auditoria[0]);
  } catch (error) {
    console.error('Error al obtener registro de auditoría:', error);
    res.status(500).json({ error: 'Error al obtener registro de auditoría' });
  }
});

// Obtener auditoría por ticket
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const [auditoria] = await pool.query(
      `SELECT a.*, u.nombre as usuario_nombre
       FROM auditoria a
       JOIN usuarios u ON a.usuario_id = u.id
       WHERE a.ticket_id = ?
       ORDER BY a.fecha DESC`,
      [req.params.ticketId]
    );

    res.json(auditoria);
  } catch (error) {
    console.error('Error al obtener auditoría del ticket:', error);
    res.status(500).json({ error: 'Error al obtener auditoría del ticket' });
  }
});

// Crear registro de auditoría
router.post('/', async (req, res) => {
  try {
    const { ticket_id, usuario_id, usuario_rol, accion, detalles } = req.body;
    const { v4: uuidv4 } = require('uuid');
    const auditoriaId = uuidv4();

    await pool.query(
      'INSERT INTO auditoria (id, ticket_id, usuario_id, usuario_rol, accion, detalles) VALUES (?, ?, ?, ?, ?, ?)',
      [auditoriaId, ticket_id, usuario_id, usuario_rol, accion, JSON.stringify(detalles)]
    );

    res.status(201).json({ message: 'Registro de auditoría creado exitosamente', id: auditoriaId });
  } catch (error) {
    console.error('Error al crear registro de auditoría:', error);
    res.status(500).json({ error: 'Error al crear registro de auditoría' });
  }
});

module.exports = router;
