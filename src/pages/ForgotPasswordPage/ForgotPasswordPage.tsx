// app/pages/ForgotPasswordPage/ForgotPasswordPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../shared/api/auth';
import style from '../Login/LoginPage.module.scss'; // 👈 Используем стили логина

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            await forgotPassword(email);
            setMessage('Если email зарегистрирован, письмо отправлено. Проверьте почту.');
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
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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