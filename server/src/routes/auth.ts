// server/src/routes/auth.ts
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { hashPassword, comparePassword } from '../utils/password';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/mailer';
import {
    saveRefreshToken,
    findRefreshToken,
    hashToken,
} from '../utils/tokens';
import {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
} from '../utils/jwt';
import { config } from '../config';

export const authRouter = Router();

interface User {
    id: number;
    email: string;
    password_hash: string;
    created_at: string;
    role: string; // 👈 ДОБАВИЛИ
}

interface AuthBody {
    email: string;
    password: string;
}

// 📌 POST /auth/register
authRouter.post('/register', async (req: Request<{}, {}, AuthBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email и пароль обязательны' });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
        return;
    }

    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existing) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (existing) {
            res.status(409).json({ error: 'Email уже занят' });
            return;
        }

        const passwordHash = await hashPassword(password);

        db.run(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)',
            [email, passwordHash],
            async function (this: { lastID: number }, err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const userId = this.lastID;
                const accessToken = createAccessToken(userId);
                const refreshToken = createRefreshToken(userId);

                console.log(`\n🔵 REGISTER: Пользователь ${email} создан (ID: ${userId})`);

                await new Promise<void>((resolve, reject) => {
                    db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [userId], (delErr) => {
                        if (delErr) {
                            console.error('❌ Ошибка DELETE в REGISTER:', delErr.message);
                            reject(delErr);
                        } else {
                            console.log('🗑️ Старые токены в REGISTER удалены (если были)');
                            resolve();
                        }
                    });
                });

                await saveRefreshToken(userId, refreshToken);
                console.log('✅ Новый токен сохранен в REGISTER');

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: config.isProd,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(201).json({
                    accessToken,
                    user: { id: userId, email, role: 'user' }, // 👈 ДОБАВИЛИ role
                });
            }
        );
    });
});

// 📌 POST /auth/login
authRouter.post('/login', (req: Request<{}, {}, AuthBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email и пароль обязательны' });
        return;
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user: User | undefined) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!user) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);

        console.log(`\n🟢 LOGIN: Пользователь ${email} вошел (ID: ${user.id})`);

        await new Promise<void>((resolve, reject) => {
            db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [user.id], (delErr) => {
                if (delErr) {
                    console.error('❌ Ошибка DELETE в LOGIN:', delErr.message);
                    reject(delErr);
                } else {
                    console.log('🗑️ Старые токены в LOGIN удалены');
                    resolve();
                }
            });
        });

        await saveRefreshToken(user.id, refreshToken);
        console.log('✅ Новый токен сохранен в LOGIN');

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.isProd,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: { id: user.id, email: user.email, role: user.role }, // 👈 ДОБАВИЛИ role
        });
    });
});

// 📌 POST /auth/refresh
authRouter.post('/refresh', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        console.log('❌ REFRESH: Токен отсутствует в куки');
        res.status(401).json({ error: 'Refresh token отсутствует' });
        return;
    }

    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        console.log('❌ REFRESH: Невалидный токен');
        res.status(401).json({ error: 'Невалидный refresh token' });
        return;
    }

    const stored = await findRefreshToken(refreshToken);

    if (!stored) {
        console.log('❌ REFRESH: Токен не найден в базе (возможно, удален)');
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.isProd,
            sameSite: 'lax',
        });
        res.status(401).json({ error: 'Refresh token отозван' });
        return;
    }

    if (stored.revoked === 1) {
        console.log('❌ REFRESH: Токен помечен как revoked');
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.isProd,
            sameSite: 'lax',
        });
        res.status(401).json({ error: 'Refresh token отозван' });
        return;
    }

    if (new Date(stored.expires_at).getTime() < Date.now()) {
        console.log('❌ REFRESH: Токен истек');
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.isProd,
            sameSite: 'lax',
        });
        res.status(401).json({ error: 'Refresh token истёк' });
        return;
    }

    console.log('🔄 REFRESH: Обновляем токен для user:', payload.userId);

    const tokenHash = hashToken(refreshToken);
    await new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash], (delErr) => {
            if (delErr) {
                console.error('❌ Ошибка DELETE в REFRESH:', delErr.message);
                reject(delErr);
            } else {
                console.log('🗑️ Старый токен в REFRESH удален');
                resolve();
            }
        });
    });

    const newAccessToken = createAccessToken(payload.userId);
    const newRefreshToken = createRefreshToken(payload.userId);
    await saveRefreshToken(payload.userId, newRefreshToken);
    console.log('✅ Новый токен сохранен в REFRESH');

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: config.isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
});

// 📌 POST /auth/logout
authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        console.log('🚪 LOGOUT: Удаляем токен при выходе');
        const tokenHash = hashToken(refreshToken);
        await new Promise<void>((resolve) => {
            db.run('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash], (delErr) => {
                if (delErr) console.error('❌ Ошибка DELETE в LOGOUT:', delErr.message);
                else console.log('🗑️ Токен удален в LOGOUT');
                resolve();
            });
        });
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.isProd,
        sameSite: 'lax',
    });

    res.json({ message: 'Выход выполнен' });
});

// 📌 GET /auth/me
authRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    
    // 👇 ДОБАВИЛИ role в SELECT
    db.get('SELECT id, email, role FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!user) {
            res.status(404).json({ error: 'Пользователь не найден' });
            return;
        }

        res.json({ user });
    });
});

// 📌 POST /auth/forgot-password
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email обязателен' });
        return;
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user: User | undefined) => {
        if (err || !user) {
            res.json({ message: 'Если email зарегистрирован, письмо отправлено' });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

        db.run(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [resetToken, expiresAt, user.id],
            async (updateErr) => {
                if (!updateErr) {
                    try {
                        await sendResetEmail(user.email, resetToken);
                    } catch (mailErr) {
                        console.error('❌ Ошибка отправки письма:', mailErr);
                    }
                }
                res.json({ message: 'Если email зарегистрирован, письмо отправлено' });
            }
        );
    });
});

// 📌 POST /auth/reset-password
authRouter.post('/reset-password', async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 6) {
        res.status(400).json({ error: 'Неверные данные' });
        return;
    }

    db.get(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?',
        [token, new Date().toISOString()],
        async (err, user: User | undefined) => {
            if (err) {
                res.status(500).json({ error: 'Ошибка сервера' });
                return;
            }

            if (!user) {
                res.status(400).json({ error: 'Токен недействителен или истек' });
                return;
            }

            const passwordHash = await hashPassword(newPassword);

            db.run(
                'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
                [passwordHash, user.id],
                (updateErr) => {
                    if (updateErr) {
                        res.status(500).json({ error: 'Не удалось обновить пароль' });
                        return;
                    }

                    db.run(
                        'DELETE FROM refresh_tokens WHERE user_id = ?',
                        [user.id],
                        (deleteErr) => {
                            if (deleteErr) {
                                console.error('❌ Ошибка удаления refresh-токенов:', deleteErr);
                            }
                            res.json({ message: 'Пароль успешно изменен. Все сессии сброшены.' });
                        }
                    );
                }
            );
        }
    );
});