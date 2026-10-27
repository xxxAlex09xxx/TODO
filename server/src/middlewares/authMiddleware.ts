import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Невалидный токен' });
    }
};