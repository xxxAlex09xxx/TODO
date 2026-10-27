// app/api/auth-refresh.ts
import { setAccessToken } from './auth-token';

const AUTH_URL = 'http://localhost:5000/auth';

let refreshPromise: Promise<string> | null = null;
export const refresh = async (): Promise<string> => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const response = await fetch(`${AUTH_URL}/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json().catch(() => null); // 👈 безопасный парсинг в одну строку

            if (!response.ok || !data?.accessToken) {
                setAccessToken(null);
                throw new Error('Сессия истекла');
            }

            setAccessToken(data.accessToken);
            return data.accessToken;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};