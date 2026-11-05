// src/features/logout/ui/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { ThemeToggle } from '@/features/toggle-theme/ui/ThemeToggle';
import style from './LogoutButton.module.scss'; 
import { useQueryClient } from '@tanstack/react-query';

export const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout, user  } = useAuth();
    const queryClient = useQueryClient(); 

    const handleLogout = async () => {
        await logout(); // Очищает куки на сервере 
        queryClient.clear(); // 👈 Очищаем весь кэш React Query
        navigate('/login');
    };
    return (
        <div className={style.wrapper}> 
            <span className={style.email}>{user?.email}</span> 
             <ThemeToggle />
            <button className={style.submitButton} onClick={handleLogout}>
                Выйти
            </button>
        </div>
    );
};