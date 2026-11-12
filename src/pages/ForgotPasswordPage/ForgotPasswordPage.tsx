// src/pages/ForgotPasswordPage/ForgotPasswordPage.tsx
import { Link } from 'react-router-dom';
import { ForgotPasswordForm } from '@/features/forgot-password';
import style from './ForgotPasswordPage.module.scss';

const ForgotPasswordPage = () => {
    return (
        <div className={style.page}>
            <div className={style.card}>
                <h1 className={style.title}>Сброс пароля</h1>
                <p className={style.subtitle}>
                    Введите email, и мы отправим ссылку для восстановления
                </p>

                <ForgotPasswordForm />

                <Link to="/login" className={style.switchButton}>
                    Вернуться ко входу
                </Link>
            </div>
        </div>
    );
};
export default ForgotPasswordPage;