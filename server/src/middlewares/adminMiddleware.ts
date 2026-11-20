import { Response, NextFunction } from 'express';
import { db } from '../db';
import { AuthRequest } from './authMiddleware';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Предполагается, что authMiddleware уже отработал и положил req.userId
    if (!req.userId) {
        res.status(401).json({ error: 'Не авторизован' });
        return;
    }

    db.get('SELECT role FROM users WHERE id = ?', [req.userId], (err, row: { role: string } | undefined) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row || row.role !== 'admin') {
            res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора.' });
            return;
        }
        next();
    });
};