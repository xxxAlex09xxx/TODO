import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { ThemeToggle } from '@/features/toggle-theme';
import style from './UserProfile.module.scss';

export const UserProfile = () => {
    const { user } = useAuth();


return (
<div className={style.wrapper}>
    {/* 👇 Ссылка на админку (только для админа) */}
    {user?.role === 'admin' && (
        <Link to="/admin" className={style.adminLink}>
            Админка
        </Link>
    )}
    <ThemeToggle/>
</div>
)
};