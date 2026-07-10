const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios ORDER BY nombre'
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarios[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = rol === 'tecnico' ? `TEC-${uuidv4().slice(0, 8).toUpperCase()}` :
                   rol === 'admin' ? `ADM-${uuidv4().slice(0, 8).toUpperCase()}` :
                   `USR-${uuidv4().slice(0, 8).toUpperCase()}`;

    await pool.query(
      'INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)',
      [userId, nombre, email, hashedPassword, rol]
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', id: userId });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;
    await pool.query(
      'UPDATE usuarios SET nombre = ?, email = ?, rol = ?, activo = ? WHERE id = ?',
      [nombre, email, rol, activo, req.params.id]
    );
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
