// src/pages/ResetPasswordPage/useResetPassword.ts
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/shared/api/auth';

export const useResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (password: string) => {
        if (!token) {
            setError('Ссылка недействительна (отсутствует токен)');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка сброса пароля');
        } finally {
            setLoading(false);
        }
    };

    // 👇 Возвращаем всё, что нужно компоненту
    return { token, error, loading, success, handleSubmit };
};