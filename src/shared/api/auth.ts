import {setAccessToken, getAccessToken} from './auth-token'
import { apiFetch } from './client';
import { refresh } from './auth-refresh';

const AUTH_URL = 'http://localhost:5000/auth';

export interface User {
    id: number;
    email: string;
}


// ===== Запросы =====
export { refresh };   // ⬅️ реэкспорт, чтобы старые импорты не сломались

export const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Не удалось войти');
    }

    const data: { accessToken: string; user: User } = await response.json();
    setAccessToken(data.accessToken);
    return data.user;
};

export const register = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Не удалось зарегистрироваться');
    }

    const data: { accessToken: string; user: User } = await response.json();
    setAccessToken(data.accessToken);
    return data.user;
};

export const logout = async (): Promise<void> => {
    try {
        await fetch(`${AUTH_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch {
        // сетевые ошибки игнорируем — токен всё равно чистим локально
    }
    setAccessToken(null);
};


export const getMe = async (): Promise<User> => {
    const response = await apiFetch(`${AUTH_URL}/me`);

    // 👇 Если 401 или 304 или 204 — это не ошибка парсинга, а отсутствие данных
    if (!response.ok || response.status === 304 || response.status === 204) {
        throw new Error('Не авторизован');
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Пустой ответ сервера');
    }

    const data: { user: User } = JSON.parse(text);
    return data.user;
};
// app/api/auth.ts
// ... (твой существующий код) ...

// 📌 Запрос на сброс пароля
export const forgotPassword = async (email: string): Promise<void> => {
    const response = await fetch(`${AUTH_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Не удалось отправить запрос');
    }
};

// 📌 Установка нового пароля
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${AUTH_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Не удалось сбросить пароль');
    }
};
export const isAuthenticated = (): boolean => !!getAccessToken();