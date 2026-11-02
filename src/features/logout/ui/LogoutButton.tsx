// src/features/logout/ui/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store/hooks';
import { useAuth } from '@/app/providers/AuthProvider';
import { clearTodos } from '@/entities/todo/model/slice';
import { ThemeToggle } from '@/features/toggle-theme/ui/ThemeToggle';
import style from './LogoutButton.module.scss'; 

export const LogoutButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { logout, user  } = useAuth();

    const handleLogout = async () => {
        await logout(); // Очищает куки на сервере
        dispatch(clearTodos()); 
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