import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Obtener todas las ubicaciones
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const { edificio } = req.query;
    
    let query = 'SELECT * FROM ubicaciones WHERE 1=1';
    const params: any[] = [];

    if (edificio) {
      query += ` AND edificio = ?`;
      params.push(edificio);
    }

    query += ' ORDER BY edificio, nombre ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({ error: 'Error al obtener ubicaciones' });
  }
});

// Obtener todos los edificios
router.get('/edificios/all', authenticateToken, async (_req: any, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT nombre FROM edificios ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener edificios:', error);
    res.status(500).json({ error: 'Error al obtener edificios' });
  }
});

// Obtener ubicación por ID
router.get('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query('SELECT * FROM ubicaciones WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    res.status(500).json({ error: 'Error al obtener ubicación' });
  }
});

// Crear ubicación (solo admin)
router.post('/', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { nombre, edificio, puntaje } = req.body;

    if (!nombre || !edificio || !puntaje) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar puntaje
    if (puntaje < 1 || puntaje > 10) {
      return res.status(400).json({ error: 'El puntaje debe estar entre 1 y 10' });
    }

    const [result] = await pool.query(
      'INSERT INTO ubicaciones (nombre, edificio, puntaje) VALUES (?, ?, ?)',
      [nombre, edificio, puntaje]
    );

    const [newUbicacion] = await pool.query('SELECT * FROM ubicaciones WHERE id = ?', [result.insertId]);
    res.status(201).json(newUbicacion[0]);
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    res.status(500).json({ error: 'Error al crear ubicación' });
  }
});

// Crear edificio (solo admin)
router.post('/edificios', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const [result] = await pool.query(
      'INSERT INTO edificios (nombre) VALUES (?)',
      [nombre]
    );

    const [newEdificio] = await pool.query('SELECT * FROM edificios WHERE nombre = ?', [nombre]);
    res.status(201).json(newEdificio[0]);
  } catch (error) {
    console.error('Error al crear edificio:', error);
    res.status(500).json({ error: 'Error al crear edificio' });
  }
});

// Actualizar ubicación (solo admin)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, edificio, puntaje } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (nombre) {
      updates.push(`nombre = ?`);
      params.push(nombre);
    }

    if (edificio) {
      updates.push(`edificio = ?`);
      params.push(edificio);
    }

    if (puntaje) {
      if (puntaje < 1 || puntaje > 10) {
        return res.status(400).json({ error: 'El puntaje debe estar entre 1 y 10' });
      }
      updates.push(`puntaje = ?`);
      params.push(puntaje);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);
    const query = `UPDATE ubicaciones SET ${updates.join(', ')} WHERE id = ?`;

    await pool.query(query, params);
    
    const [updatedUbicacion] = await pool.query('SELECT * FROM ubicaciones WHERE id = ?', [id]);
    
    if (updatedUbicacion.length === 0) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }

    res.json(updatedUbicacion[0]);
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
});

// Eliminar ubicación (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM ubicaciones WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }

    res.json({ message: 'Ubicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ubicación:', error);
    res.status(500).json({ error: 'Error al eliminar ubicación' });
  }
});

export default router;
