// app/api/client.ts
import { getAccessToken, setAccessToken } from './auth-token';
import {  refresh } from './auth-refresh';

interface ApiFetchOptions extends RequestInit {
    skipAuth?: boolean;
    _retry?: boolean;
}

export const apiFetch = async (
    url: string,
    options: ApiFetchOptions = {}
): Promise<Response> => {
    const { skipAuth, _retry, headers, ...rest } = options;

    const finalHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // 👈 заставляет браузер всегда запрашивать свежие данные
        ...(headers as Record<string, string>),
    };

    if (!skipAuth) {
        const token = getAccessToken();
        if (token) {
            finalHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        ...rest,
        credentials: 'include',
        headers: finalHeaders,
    });

    // Авторефреш: 401 и это первая попытка
    if (response.status === 401 && !skipAuth && !_retry) {
        try {
            await refresh();
            return apiFetch(url, { ...options, _retry: true });
        } catch {
            setAccessToken(null);
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            throw new Error('Сессия истекла');
        }
    }

    return response;
};