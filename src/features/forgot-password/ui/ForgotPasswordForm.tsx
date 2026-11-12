// src/pages/ForgotPasswordPage/ForgotPasswordForm.tsx
import { useState } from 'react';
import { forgotPassword } from '@/shared/api';
import style from './ForgotPasswordForm.module.scss'; // 👈 Стили лежат в папке страницы

export const ForgotPasswordForm = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget; 
        setError(null);
        setMessage(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string || '').trim();

        try {
            await forgotPassword(email);
            setMessage('Если email зарегистрирован, письмо отправлено. Проверьте почту.');
            form.reset();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Что-то пошло не так');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={style.form} onSubmit={handleSubmit}>
            <div className={style.field}>
                <label className={style.label} htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={style.input}
                    placeholder="Ваш email"
                />
            </div>

            {error && <div className={style.error}>{error}</div>}
            {message && <div className={style.success}>{message}</div>}

            <button className={style.submitButton} type="submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить ссылку'}
            </button>
        </form>
    );
};