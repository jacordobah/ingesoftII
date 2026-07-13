import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Obtener todas las categorías
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
       (SELECT COUNT(*) FROM subcategorias WHERE categoria_id = c.id) as subcategorias_count
       FROM categorias c 
       ORDER BY c.nombre ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Obtener categoría por ID con subcategorías
router.get('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const categoriaResult = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    
    if (categoriaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const subcategoriasResult = await pool.query(
      'SELECT * FROM subcategorias WHERE categoria_id = $1 ORDER BY nombre ASC',
      [id]
    );

    res.json({
      ...categoriaResult.rows[0],
      subcategorias: subcategoriasResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// Crear categoría (solo admin)
router.post('/', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const result = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Actualizar categoría (solo admin)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (nombre) {
      updates.push(`nombre = $${paramIndex}`);
      params.push(nombre);
      paramIndex++;
    }

    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramIndex}`);
      params.push(descripcion);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);
    const query = `UPDATE categorias SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// Eliminar categoría (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

export default router;
