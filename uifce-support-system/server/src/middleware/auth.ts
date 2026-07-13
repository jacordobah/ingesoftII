import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const secret = process.env.JWT_SECRET || 'your_super_secret_key';
  
  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    
    req.user = user;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No autorizado para esta acción' });
    }

    next();
  };
};
