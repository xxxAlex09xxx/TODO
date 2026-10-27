// app/pages/ResetPasswordPage/ResetPasswordPage.tsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../shared/api/auth';
import { ResetPasswordForm } from './ResetPasswordForm';
import style from '../Login/LoginPage.module.scss';

export const ResetPasswordPage = () => {
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
            setTimeout(() => navigate('/login'), 3000); // через 3 сек перекидываем на логин
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка сброса пароля');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={style.page}>
                <div className={style.card}>
                    <h1 className={style.title}>Готово!</h1>
                    <p className={style.subtitle}>Пароль успешно изменен. Сейчас вас перекинет на страницу входа.</p>
                </div>
            </div>
        );
    }

    return (
        <ResetPasswordForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            hasToken={!!token}
        />
    );
};