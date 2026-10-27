// server/src/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: Number(process.env.PORT) || 5000,

    jwt: {
        accessSecret: process.env.ACCESS_SECRET || 'access-secret-default',
        refreshSecret: process.env.REFRESH_SECRET || 'refresh-secret-default',
        accessExpires: process.env.ACCESS_EXPIRES || '15m',
        refreshExpires: process.env.REFRESH_EXPIRES || '7d',
    },

    isProd: process.env.NODE_ENV === 'production',
};