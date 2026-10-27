// app/pages/ResetPasswordPage/ResetPasswordForm.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../Login/LoginPage.module.scss';

interface ResetPasswordFormProps {
    onSubmit: (password: string) => void;
    loading: boolean;
    error: string | null;
    hasToken: boolean;
}

export const ResetPasswordForm = ({ onSubmit, loading, error, hasToken }: ResetPasswordFormProps) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className={style.page}>
            <div className={style.card}>
                <h1 className={style.title}>Новый пароль</h1>
                <p className={style.subtitle}>Придумайте новый пароль для вашего аккаунта</p>

                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.field}>
                        <label className={style.label} htmlFor="password">
                            Новый пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className={style.input}
                            placeholder="Минимум 6 символов"
                        />
                    </div>

                    {error && <div className={style.error}>{error}</div>}

                    <button className={style.submitButton} type="submit" disabled={loading || !hasToken}>
                        {loading ? 'Сохранение...' : 'Сохранить пароль'}
                    </button>
                </form>
                
                <Link to="/login" className={style.switchButton}>
                    Вернуться ко входу
                </Link>
            </div>
        </div>
    );
};