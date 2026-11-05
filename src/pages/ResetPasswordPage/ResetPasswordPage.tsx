// src/pages/ResetPasswordPage/ResetPasswordPage.tsx
import { useResetPassword } from '@/features/reset-password/model/useResetPassword'; // 👈 Импорт хука
import { ResetPasswordForm } from './ResetPasswordForm';
import style from './ResetPasswordPage.module.scss';

export const ResetPasswordPage = () => {
    // 👇 Вся логика теперь в одной строчке
    const { token, error, loading, success, handleSubmit } = useResetPassword();

    if (success) {
        return (
            <div className={style.page}>
                <div className={style.card}>
                    <h1 className={style.title}>Готово!</h1>
                    <p className={style.subtitle}>Пароль успешно изменен. Сейчас вас перекинет на страницу входа.</p>
                </div>
            </div>
        );
    }

    return (
        <ResetPasswordForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            hasToken={!!token}
        />
    );
};