const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Obtener todas las categorías con sus subcategorías
router.get('/', async (req, res) => {
  try {
    const [categorias] = await pool.query(
      'SELECT * FROM categorias WHERE activa = TRUE ORDER BY nombre'
    );

    for (const categoria of categorias) {
      const [subcategorias] = await pool.query(
        'SELECT * FROM subcategorias WHERE categoria_id = ? AND activa = TRUE ORDER BY nombre',
        [categoria.id]
      );
      categoria.subcategorias = subcategorias;
    }

    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Obtener categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const [categorias] = await pool.query(
      'SELECT * FROM categorias WHERE id = ?',
      [req.params.id]
    );

    if (categorias.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const [subcategorias] = await pool.query(
      'SELECT * FROM subcategorias WHERE categoria_id = ? AND activa = TRUE',
      [req.params.id]
    );

    res.json({ ...categorias[0], subcategorias });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// Crear categoría
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const categoriaId = `CAT-${uuidv4().slice(0, 8).toUpperCase()}`;

    await pool.query(
      'INSERT INTO categorias (id, nombre, descripcion) VALUES (?, ?, ?)',
      [categoriaId, nombre, descripcion]
    );

    res.status(201).json({ message: 'Categoría creada exitosamente', id: categoriaId });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El nombre de categoría ya existe' });
    }
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, activa } = req.body;
    await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ?, activa = ? WHERE id = ?',
      [nombre, descripcion, activa, req.params.id]
    );
    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

// Crear subcategoría
router.post('/:id/subcategorias', async (req, res) => {
  try {
    const { nombre, puntaje } = req.body;
    const subcategoriaId = `SUB-${uuidv4().slice(0, 8).toUpperCase()}`;

    await pool.query(
      'INSERT INTO subcategorias (id, categoria_id, nombre, puntaje) VALUES (?, ?, ?, ?)',
      [subcategoriaId, req.params.id, nombre, puntaje || 0]
    );

    res.status(201).json({ message: 'Subcategoría creada exitosamente', id: subcategoriaId });
  } catch (error) {
    console.error('Error al crear subcategoría:', error);
    res.status(500).json({ error: 'Error al crear subcategoría' });
  }
});

// Actualizar subcategoría
router.put('/subcategorias/:id', async (req, res) => {
  try {
    const { nombre, puntaje, activa } = req.body;
    await pool.query(
      'UPDATE subcategorias SET nombre = ?, puntaje = ?, activa = ? WHERE id = ?',
      [nombre, puntaje, activa, req.params.id]
    );
    res.json({ message: 'Subcategoría actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar subcategoría:', error);
    res.status(500).json({ error: 'Error al actualizar subcategoría' });
  }
});

// Eliminar subcategoría
router.delete('/subcategorias/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM subcategorias WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subcategoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar subcategoría:', error);
    res.status(500).json({ error: 'Error al eliminar subcategoría' });
  }
});

module.exports = router;
