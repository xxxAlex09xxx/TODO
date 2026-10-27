// app/pages/Login/LoginForm.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './LoginPage.module.scss';

const TEXTS = {
    login: {
        title: 'Вход',
        subtitle: 'Войдите, чтобы продолжить',
        submit: 'Войти',
        switch: 'Нет аккаунта? Зарегистрироваться',
    },
    register: {
        title: 'Регистрация',
        subtitle: 'Создайте аккаунт, чтобы начать',
        submit: 'Зарегистрироваться',
        switch: 'Уже есть аккаунт? Войти',
    },
} as const;

interface LoginFormProps {
    mode: 'login' | 'register';
    onSubmit: (email: string, password: string) => void;
    loading: boolean;
    error: string | null;
    onToggleMode: () => void;
}

export const LoginForm = ({ mode, onSubmit, loading, error, onToggleMode }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 👇 Теперь просто берем нужный кусок текста
    const t = TEXTS[mode];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <div className={style.page}>
            <div className={style.card}>
                <h1 className={style.title}>{t.title}</h1>
                <p className={style.subtitle}>{t.subtitle}</p>

                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.field}>
                        <label className={style.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={style.input}
                        />
                    </div>

                    <div className={style.field}>
                        <label className={style.label} htmlFor="password">Пароль</label>
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

                    <button className={style.submitButton} type="submit" disabled={loading}>
                        {loading ? 'Подождите...' : t.submit}
                    </button>

                    {mode === 'login' && (
                        <div className={style.forgotPasswordWrapper}>
                            <Link to="/forgot-password" className={style.forgotPasswordLink}>
                                Забыли пароль?
                            </Link>
                        </div>
                    )}
                </form>

                <button className={style.switchButton} type="button" onClick={onToggleMode}>
                    {t.switch}
                </button>
            </div>
        </div>
    );
};