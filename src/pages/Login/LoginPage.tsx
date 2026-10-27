// app/pages/Login/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../shared/api/auth';
import { useAuth } from '../../app/providers/AuthProvider';
import { LoginForm } from './LoginForm'; // 👈 Импортируем нашу форму

export const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (email: string, password: string) => {
        setError(null);
        setLoading(true);

        try {
            let loggedUser;
            if (mode === 'login') {
                loggedUser = await login(email, password);
            } else {
                loggedUser = await register(email, password);
            }

            setUser(loggedUser);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Что-то пошло не так');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError(null);
    };

    return (
        <LoginForm 
            mode={mode}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            onToggleMode={toggleMode}
        />
    );
};