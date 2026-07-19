import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { MemoryStore } from './store/memoryStore.js';

dotenv.config();

const app = express();
const store = new MemoryStore();
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.JWT_SECRET || 'uifce-dev-secret-change-me';
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
      if (!origin || isLocalDev || configuredOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '1mb' }));

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = store.findUserById(payload.sub);
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido o expirado' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'uifce-support-api',
    storage: 'memory',
  });
});

app.post(
  '/api/auth/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail.endsWith('@unal.edu.co')) {
      res.status(400).json({ error: 'Debe usar un correo institucional @unal.edu.co' });
      return;
    }

    if (!password || String(password).length < 6) {
      res.status(400).json({ error: 'La contrasena debe tener al menos 6 caracteres' });
      return;
    }

    const user = store.getOrCreateUser(normalizedEmail);
    res.json({
      token: signToken(user),
      user,
    });
  })
);

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(req.user);
});

app.get('/api/usuarios', requireAuth, (_req, res) => {
  res.json(store.listUsers());
});

app.post(
  '/api/usuarios',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.status(201).json(store.createUser(req.body));
  })
);

app.put(
  '/api/usuarios/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(store.updateUser(req.params.id, req.body));
  })
);

app.delete('/api/usuarios/:id', requireAuth, (req, res) => {
  const deleted = store.deleteUser(req.params.id);
  res.status(deleted ? 204 : 404).send();
});

app.get('/api/tickets', requireAuth, (_req, res) => {
  res.json(store.listTickets());
});

app.get('/api/tickets/:id', requireAuth, (req, res) => {
  const ticket = store.findTicketById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket no encontrado' });
    return;
  }
  res.json(ticket);
});

app.post(
  '/api/tickets',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.status(201).json(store.createTicket(req.body, req.user.id));
  })
);

app.put(
  '/api/tickets/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(store.updateTicket(req.params.id, req.body, req.user.id));
  })
);

app.delete('/api/tickets/:id', requireAuth, (req, res) => {
  const deleted = store.deleteTicket(req.params.id);
  res.status(deleted ? 204 : 404).send();
});

app.post(
  '/api/tickets/:id/comentarios',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.status(201).json(store.addComment(req.params.id, req.body.contenido, req.user.id));
  })
);

app.get('/api/categorias', requireAuth, (_req, res) => {
  res.json({
    categorias: store.listCategorias(),
    subcategorias: store.listSubcategorias(),
  });
});

app.get('/api/ubicaciones', requireAuth, (_req, res) => {
  res.json(store.listUbicaciones());
});

app.get('/api/auditoria', requireAuth, (_req, res) => {
  res.json(store.listAuditoria());
});

app.get('/api/auditoria/:id', requireAuth, (req, res) => {
  const record = store.listAuditoria().find((item) => item.id === req.params.id);
  if (!record) {
    res.status(404).json({ error: 'Registro de auditoria no encontrado' });
    return;
  }
  res.json(record);
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Error interno del servidor' : error.message,
  });
});

app.listen(port, () => {
  console.log(`UIFCE support API escuchando en http://localhost:${port}/api`);
});
