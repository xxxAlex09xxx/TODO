import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/shared/api/auth';
import style from '../Login/LoginPage.module.scss';

export const ForgotPasswordPage = () => {
    // Оставляем только стейты для статуса запроса
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        // Забираем email через FormData (как в AddTodoForm)
        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string || '').trim();

        try {
            await forgotPassword(email);
            setMessage('Если email зарегистрирован, письмо отправлено. Проверьте почту.');
            e.currentTarget.reset(); // Очищаем инпут
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Что-то пошло не так');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.page}>
            <div className={style.card}>
                <h1 className={style.title}>Сброс пароля</h1>
                <p className={style.subtitle}>Введите email, и мы отправим ссылку для восстановления</p>

                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.field}>
                        <label className={style.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email" // 👈 Добавили name
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

                <Link to="/login" className={style.switchButton}>
                    Вернуться ко входу
                </Link>
            </div>
        </div>
    );
};