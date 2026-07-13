import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Validar email institucional UNAL
    if (!email.endsWith('@unal.edu.co')) {
      return res.status(400).json({ error: 'Debe usar correo institucional @unal.edu.co' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND activo = true',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'your_super_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al procesar login' });
  }
});

// Register (solo admin puede crear usuarios)
router.post('/register', authenticateToken, async (req: any, res: Response) => {
  try {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password || !nombre || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar que el creador sea admin
    if (req.user?.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear usuarios' });
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
      'SELECT id, email, nombre, rol FROM usuarios WHERE email = ?',
      [email]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser[0],
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Logout (cliente debe eliminar el token)
router.post('/logout', authenticateToken, (_req: any, res: Response) => {
  res.json({ message: 'Logout exitoso' });
});

// Verificar token
router.get('/verify', authenticateToken, (req: any, res: Response) => {
  res.json({
    valid: true,
    user: {
      id: req.user?.id,
      email: req.user?.email,
      rol: req.user?.rol,
    },
  });
});

export default router;
