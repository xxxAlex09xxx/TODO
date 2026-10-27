// server/src/utils/tokens.ts
import crypto from 'crypto';
import { db } from '../db';

// Хешируем токен — в БД храним только хеш
export const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Сохранить refresh-токен в БД
export const saveRefreshToken = (userId: number, token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const tokenHash = hashToken(token);
        // 7 дней
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        db.run(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, tokenHash, expiresAt],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};

// Найти токен в БД
export interface StoredToken {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: string;
    revoked: number;
}

export const findRefreshToken = (token: string): Promise<StoredToken | undefined> => {
    return new Promise((resolve, reject) => {
        const tokenHash = hashToken(token);
        db.get(
            'SELECT * FROM refresh_tokens WHERE token_hash = ?',
            [tokenHash],
            (err, row: StoredToken | undefined) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};

// Отозвать конкретный токен
export const revokeRefreshToken = (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const tokenHash = hashToken(token);
        db.run(
            'UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?',
            [tokenHash],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};

// Отозвать все токены пользователя
export const revokeAllUserTokens = (userId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?',
            [userId],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};