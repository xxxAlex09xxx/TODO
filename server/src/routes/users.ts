import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

export const usersRouter = Router();

// Применяем обе проверки: сначала авторизация, потом проверка на админа
usersRouter.use(authMiddleware);
usersRouter.use(adminMiddleware);

// Обновленный интерфейс
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

// GET /admin/users — получить всех пользователей
usersRouter.get('/', (req: AuthRequest, res: Response) => {
    db.all(
        'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC',
        [],
        (err, rows: User[]) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ users: rows });
        }
    );
});

// PATCH /admin/users/:id/role — изменить роль пользователя
usersRouter.patch('/:id/role', (req: AuthRequest, res: Response) => {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Некорректный id' });
        return;
    }

    if (role !== 'admin' && role !== 'user') {
        res.status(400).json({ error: 'Некорректная роль' });
        return;
    }

    // Запрещаем админу менять свою же роль
    if (userId === req.userId) {
        res.status(400).json({ error: 'Нельзя изменить свою собственную роль' });
        return;
    }

    db.run(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId],
        function (this: { changes: number }, err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            res.json({ message: 'Роль успешно обновлена' });
        }
    );
});

// 👇 НОВЫЙ ЭНДПОИНТ: PATCH /admin/users/:id/status — заблокировать/разблокировать
usersRouter.patch('/:id/status', (req: AuthRequest, res: Response) => {
    const userId = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Некорректный id' });
        return;
    }

    if (status !== 'active' && status !== 'blocked') {
        res.status(400).json({ error: 'Некорректный статус' });
        return;
    }

    // Запрещаем админу блокировать самого себя
    if (userId === req.userId) {
        res.status(400).json({ error: 'Нельзя изменить статус самого себя' });
        return;
    }

    db.run(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, userId],
        function (this: { changes: number }, err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            res.json({ message: 'Статус успешно обновлен' });
        }
    );
});

// DELETE /admin/users/:id — удалить пользователя
usersRouter.delete('/:id', (req: AuthRequest, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Некорректный id' });
        return;
    }

    if (userId === req.userId) {
        res.status(400).json({ error: 'Нельзя удалить самого себя' });
        return;
    }

    db.run(
        'DELETE FROM users WHERE id = ?',
        [userId],
        function (this: { changes: number }, err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Пользователь не найден' });
                return;
            }
            res.json({ message: 'Пользователь удален' });
        }
    );
});