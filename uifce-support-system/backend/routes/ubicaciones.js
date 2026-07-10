const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Obtener todos los edificios con sus ubicaciones
router.get('/', async (req, res) => {
  try {
    const [edificios] = await pool.query(
      'SELECT * FROM edificios WHERE activo = TRUE ORDER BY nombre'
    );

    for (const edificio of edificios) {
      const [ubicaciones] = await pool.query(
        'SELECT * FROM ubicaciones WHERE edificio_id = ? AND activa = TRUE ORDER BY nombre',
        [edificio.id]
      );
      edificio.ubicaciones = ubicaciones;
    }

    res.json(edificios);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({ error: 'Error al obtener ubicaciones' });
  }
});

// Obtener edificio por ID
router.get('/edificios/:id', async (req, res) => {
  try {
    const [edificios] = await pool.query(
      'SELECT * FROM edificios WHERE id = ?',
      [req.params.id]
    );

    if (edificios.length === 0) {
      return res.status(404).json({ error: 'Edificio no encontrado' });
    }

    const [ubicaciones] = await pool.query(
      'SELECT * FROM ubicaciones WHERE edificio_id = ? AND activa = TRUE',
      [req.params.id]
    );

    res.json({ ...edificios[0], ubicaciones });
  } catch (error) {
    console.error('Error al obtener edificio:', error);
    res.status(500).json({ error: 'Error al obtener edificio' });
  }
});

// Crear edificio
router.post('/edificios', async (req, res) => {
  try {
    const { nombre } = req.body;
    const edificioId = `ED-${uuidv4().slice(0, 8).toUpperCase()}`;

    await pool.query(
      'INSERT INTO edificios (id, nombre) VALUES (?, ?)',
      [edificioId, nombre]
    );

    res.status(201).json({ message: 'Edificio creado exitosamente', id: edificioId });
  } catch (error) {
    console.error('Error al crear edificio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El nombre de edificio ya existe' });
    }
    res.status(500).json({ error: 'Error al crear edificio' });
  }
});

// Actualizar edificio
router.put('/edificios/:id', async (req, res) => {
  try {
    const { nombre, activo } = req.body;
    await pool.query(
      'UPDATE edificios SET nombre = ?, activo = ? WHERE id = ?',
      [nombre, activo, req.params.id]
    );
    res.json({ message: 'Edificio actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar edificio:', error);
    res.status(500).json({ error: 'Error al actualizar edificio' });
  }
});

// Eliminar edificio
router.delete('/edificios/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM edificios WHERE id = ?', [req.params.id]);
    res.json({ message: 'Edificio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar edificio:', error);
    res.status(500).json({ error: 'Error al eliminar edificio' });
  }
});

// Crear ubicación
router.post('/edificios/:id/ubicaciones', async (req, res) => {
  try {
    const { nombre, puntaje } = req.body;
    const ubicacionId = `UBI-${uuidv4().slice(0, 8).toUpperCase()}`;

    await pool.query(
      'INSERT INTO ubicaciones (id, edificio_id, nombre, puntaje) VALUES (?, ?, ?, ?)',
      [ubicacionId, req.params.id, nombre, puntaje || 0]
    );

    res.status(201).json({ message: 'Ubicación creada exitosamente', id: ubicacionId });
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    res.status(500).json({ error: 'Error al crear ubicación' });
  }
});

// Actualizar ubicación
router.put('/ubicaciones/:id', async (req, res) => {
  try {
    const { nombre, puntaje, activa } = req.body;
    await pool.query(
      'UPDATE ubicaciones SET nombre = ?, puntaje = ?, activa = ? WHERE id = ?',
      [nombre, puntaje, activa, req.params.id]
    );
    res.json({ message: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
});

// Eliminar ubicación
router.delete('/ubicaciones/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ubicaciones WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ubicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ubicación:', error);
    res.status(500).json({ error: 'Error al eliminar ubicación' });
  }
});

module.exports = router;
