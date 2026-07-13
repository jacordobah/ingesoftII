import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { rol } = req.query;
    
    let query = 'SELECT id, email, nombre, rol, activo, fecha_creacion FROM usuarios WHERE 1=1';
    const params: any[] = [];

    if (rol) {
      query += ` AND rol = ?`;
      params.push(rol);
    }

    query += ' ORDER BY nombre ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar permisos: solo admin puede ver otros usuarios
    if (req.user?.rol !== 'admin' && req.user?.id !== parseInt(id)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const [rows] = await pool.query(
      'SELECT id, email, nombre, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear usuario (solo admin)
router.post('/', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password || !nombre || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar email institucional
    if (!email.endsWith('@unal.edu.co')) {
      return res.status(400).json({ error: 'Debe usar correo institucional @unal.edu.co' });
    }

    // Validar rol
    if (!['usuario', 'tecnico', 'admin'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, rol) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, nombre, rol]
    );

    const [newUser] = await pool.query(
      'SELECT id, email, nombre, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario (solo admin o el propio usuario)
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, password, rol, activo } = req.body;

    // Verificar permisos
    if (req.user?.rol !== 'admin' && req.user?.id !== parseInt(id)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Solo admin puede cambiar rol y estado activo
    if (req.user?.rol !== 'admin' && (rol || activo !== undefined)) {
      return res.status(403).json({ error: 'Solo admin puede cambiar rol y estado' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (nombre) {
      updates.push(`nombre = ?`);
      params.push(nombre);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = ?`);
      params.push(hashedPassword);
    }

    if (rol && req.user?.rol === 'admin') {
      updates.push(`rol = ?`);
      params.push(rol);
    }

    if (activo !== undefined && req.user?.rol === 'admin') {
      updates.push(`activo = ?`);
      params.push(activo);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;

    await pool.query(query, params);
    
    const [updatedUser] = await pool.query(
      'SELECT id, email, nombre, rol, activo, fecha_creacion FROM usuarios WHERE id = ?',
      [id]
    );
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    // No permitir eliminar el propio usuario
    if (req.user?.id === parseInt(id)) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }

    // Proteger usuario admin principal (uniic_bog@unal.edu.co)
    const [userResult] = await pool.query('SELECT email FROM usuarios WHERE id = ?', [id]);
    if (userResult.length > 0 && userResult[0].email === 'uniic_bog@unal.edu.co') {
      return res.status(403).json({ error: 'No se puede eliminar el usuario administrador principal' });
    }
    
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
