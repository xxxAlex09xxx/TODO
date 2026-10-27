// server/src/utils/mailer.ts
import nodemailer from 'nodemailer';

// Создаем транспорт для отправки писем
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // 👈 ОБЯЗАТЕЛЬНО для порта 465 (Яндекс)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Функция для отправки письма со ссылкой на сброс
export const sendResetEmail = async (to: string, token: string) => {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:555'}/reset-password?token=${token}`;
    
    const info = await transporter.sendMail({
        // 👇 Отправитель должен совпадать с SMTP_USER, иначе Яндекс заблокирует
        from: `"Todo App" <${process.env.SMTP_USER}>`, 
        to,
        subject: 'Сброс пароля',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #676ae9;">Сброс пароля</h2>
                <p>Вы запросили сброс пароля для вашего аккаунта.</p>
                <p>Для того чтобы задать новый пароль, перейдите по ссылке ниже:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #676ae9; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                    Сбросить пароль
                </a>
                <p style="color: #666; font-size: 14px;">Ссылка действительна в течение 1 часа.</p>
                <p style="color: #666; font-size: 14px;">Если вы не запрашивали сброс, просто проигнорируйте это письмо.</p>
            </div>
        `,
    });

    // Для реальной почты просто выводим факт отправки в консоль
    console.log(`📧 Письмо со ссылкой сброса успешно отправлено на ${to}`);
};



