// src/features/logout/ui/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/store/hooks';
import { useAuth } from '../../../app/providers/AuthProvider';
// 👇 Нам нужно будет добавить clearTodos в слайс (см. шаг 3)
import { clearTodos } from '../../../entities/todo/model/slice';
import style from './LogoutButton.module.scss'; // Создай этот файл и скопируй туда стили .submitButton

export const LogoutButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout(); // Очищает куки на сервере
        dispatch(clearTodos()); // Очищает Redux (чтобы задачи не мигали при выходе)
        navigate('/login');
    };

    return (
        <button className={style.submitButton} onClick={handleLogout}>
            Выйти
        </button>
    );
};