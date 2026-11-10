// src/features/logout/ui/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import style from './LogoutButton.module.scss';
import { useQueryClient } from '@tanstack/react-query';

export const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        await logout(); // Очищает куки на сервере 
        queryClient.clear(); // 👈 Очищаем весь кэш React Query
        navigate('/login');
    };
    return (
        <div className={style.wrapper}>
            <span className={style.email}>{user?.email}</span>
            <button
                className={style.submitButton}
                onClick={handleLogout}
            >
                Выйти
            </button>
        </div>
    );
};