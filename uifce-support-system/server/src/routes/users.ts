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
    let paramIndex = 1;

    if (rol) {
      query += ` AND rol = $${paramIndex}`;
      params.push(rol);
      paramIndex++;
    }

    query += ' ORDER BY nombre ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
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

    const result = await pool.query(
      'SELECT id, email, nombre, rol, activo, fecha_creacion FROM usuarios WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
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
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, rol, activo, fecha_creacion',
      [email, hashedPassword, nombre, rol]
    );

    res.status(201).json(result.rows[0]);
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
    let paramIndex = 1;

    if (nombre) {
      updates.push(`nombre = $${paramIndex}`);
      params.push(nombre);
      paramIndex++;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramIndex}`);
      params.push(hashedPassword);
      paramIndex++;
    }

    if (rol && req.user?.rol === 'admin') {
      updates.push(`rol = $${paramIndex}`);
      params.push(rol);
      paramIndex++;
    }

    if (activo !== undefined && req.user?.rol === 'admin') {
      updates.push(`activo = $${paramIndex}`);
      params.push(activo);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, nombre, rol, activo, fecha_creacion`;

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
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
    const userResult = await pool.query('SELECT email FROM usuarios WHERE id = $1', [id]);
    if (userResult.rows.length > 0 && userResult.rows[0].email === 'uniic_bog@unal.edu.co') {
      return res.status(403).json({ error: 'No se puede eliminar el usuario administrador principal' });
    }
    
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
