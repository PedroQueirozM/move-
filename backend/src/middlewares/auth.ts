import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  papel: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Verificar se foi passado header alternativo de demo (útil para trocar perfil na barra superior)
    const demoUserId = req.headers['x-user-id'] as string;
    if (demoUserId) {
      req.user = { id: demoUserId, email: '', papel: 'ALUNO' };
      return next();
    }
    res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'move_plus_super_secret_jwt_key_2026';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido ou expirado.' });
      return;
    }
    req.user = decoded as AuthUser;
    next();
  });
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.papel)) {
      res.status(403).json({ error: 'Acesso não autorizado para este perfil.' });
      return;
    }
    next();
  };
}
