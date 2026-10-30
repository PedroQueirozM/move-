"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        // Verificar se foi passado header alternativo de demo (útil para trocar perfil na barra superior)
        const demoUserId = req.headers['x-user-id'];
        if (demoUserId) {
            req.user = { id: demoUserId, email: '', papel: 'ALUNO' };
            return next();
        }
        res.status(401).json({ error: 'Token de autenticação não fornecido.' });
        return;
    }
    const secret = process.env.JWT_SECRET || 'move_plus_super_secret_jwt_key_2026';
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Token inválido ou expirado.' });
            return;
        }
        req.user = decoded;
        next();
    });
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.papel)) {
            res.status(403).json({ error: 'Acesso não autorizado para este perfil.' });
            return;
        }
        next();
    };
}
