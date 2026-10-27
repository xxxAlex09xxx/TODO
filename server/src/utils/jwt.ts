// server/src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
    userId: number;
}

// Создать access token (15 минут)
export const createAccessToken = (userId: number): string => {
    return jwt.sign(
        { userId } as TokenPayload,
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpires as jwt.SignOptions['expiresIn'] }
    );
};

// Создать refresh token (7 дней)
export const createRefreshToken = (userId: number): string => {
    return jwt.sign(
        { userId } as TokenPayload,
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpires as jwt.SignOptions['expiresIn'] }
    );
};

// Проверить access token
export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
};

// Проверить refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
};