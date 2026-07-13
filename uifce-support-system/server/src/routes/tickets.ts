import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Generar ID único para ticket
const generateTicketId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `TKT-${timestamp}-${random}`.toUpperCase();
};

// Obtener todos los tickets (con filtros opcionales)
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const { estado, prioridad, usuario_id } = req.query;
    
    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (estado) {
      query += ` AND estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    if (prioridad) {
      query += ` AND prioridad = $${paramIndex}`;
      params.push(prioridad);
      paramIndex++;
    }

    if (usuario_id) {
      query += ` AND usuario_id = $${paramIndex}`;
      params.push(usuario_id);
      paramIndex++;
    }

    // Solo técnicos y admins pueden ver todos los tickets
    if (req.user?.rol === 'usuario') {
      query += ` AND usuario_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    }

    query += ' ORDER BY fecha_creacion DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
});

// Obtener ticket por ID
router.get('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Verificar permisos
    const ticket = result.rows[0];
    if (req.user?.rol === 'usuario' && ticket.usuario_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para ver este ticket' });
    }

    // Obtener comentarios
    const comentarios = await pool.query(
      'SELECT * FROM comentarios WHERE ticket_id = $1 ORDER BY fecha_creacion ASC',
      [id]
    );

    res.json({ ...ticket, comentarios: comentarios.rows });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
});

// Crear nuevo ticket
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const {
      categoria,
      subcategoria,
      ubicacion,
      edificio,
      descripcion,
      cantidadEquipos,
      telefonoContacto,
    } = req.body;

    if (!categoria || !subcategoria || !ubicacion || !edificio || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Calcular prioridad y tiempo estimado (simplificado)
    const prioridad = 'media';
    const tiempoEstimado = 24; // horas

    const ticketId = generateTicketId();
    const usuarioNombre = req.user?.nombre || 'Usuario';

    const result = await pool.query(
      `INSERT INTO tickets 
       (id, usuario_id, usuario_nombre, categoria, subcategoria, ubicacion, edificio, 
        descripcion, prioridad, estado, tiempo_estimado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        ticketId,
        req.user?.id,
        usuarioNombre,
        categoria,
        subcategoria,
        ubicacion,
        edificio,
        descripcion,
        prioridad,
        'abierto',
        tiempoEstimado,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error al crear ticket' });
  }
});

// Actualizar ticket (asignar técnico, cambiar estado, etc.)
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, tecnico_asignado, categoria, subcategoria, ubicacion, edificio } = req.body;

    // Verificar permisos
    if (req.user?.rol === 'usuario') {
      return res.status(403).json({ error: 'Solo técnicos y admins pueden actualizar tickets' });
    }

    // Construir query dinámica
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (estado) {
      updates.push(`estado = $${paramIndex}`);
      params.push(estado);
      paramIndex++;
      
      if (estado === 'en_proceso' && !tecnico_asignado) {
        updates.push(`tecnico_asignado = $${paramIndex}`);
        params.push(req.user?.id);
        paramIndex++;
        updates.push(`fecha_asignacion = NOW()`);
      }
      
      if (estado === 'cerrado') {
        updates.push(`fecha_resolucion = NOW()`);
      }
    }

    if (tecnico_asignado) {
      updates.push(`tecnico_asignado = $${paramIndex}`);
      params.push(tecnico_asignado);
      paramIndex++;
      updates.push(`fecha_asignacion = NOW()`);
    }

    if (categoria) {
      updates.push(`categoria = $${paramIndex}`);
      params.push(categoria);
      paramIndex++;
    }

    if (subcategoria) {
      updates.push(`subcategoria = $${paramIndex}`);
      params.push(subcategoria);
      paramIndex++;
    }

    if (ubicacion) {
      updates.push(`ubicacion = $${paramIndex}`);
      params.push(ubicacion);
      paramIndex++;
    }

    if (edificio) {
      updates.push(`edificio = $${paramIndex}`);
      params.push(edificio);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    params.push(id);
    const query = `UPDATE tickets SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar ticket:', error);
    res.status(500).json({ error: 'Error al actualizar ticket' });
  }
});

// Agregar comentario a ticket
router.post('/:id/comentarios', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: 'El comentario es requerido' });
    }

    const result = await pool.query(
      `INSERT INTO comentarios (ticket_id, usuario_id, usuario_nombre, texto) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [id, req.user?.id, req.user?.nombre || 'Usuario', texto]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
});

// Eliminar ticket (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json({ message: 'Ticket eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ error: 'Error al eliminar ticket' });
  }
});

export default router;
