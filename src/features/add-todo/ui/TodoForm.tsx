// features/add-todo/ui/TodoForm.tsx
import style from './TodoForm.module.scss';

interface TodoFormProps {
    mode?: 'create' | 'edit';                     // ⬅️ по умолчанию 'create'
    todoId?: number;                               // ⬅️ нужен для edit
    initialValues?: {                              // ⬅️ для edit
        title: string;
        description?: string;
    };
    onSubmit: (data: { title: string; description: string }) => void;                         // ⬅️ вместо onClose
    onCancel: () => void;                          // ⬅️ для кнопки «Отмена»
}

export const TodoForm = ({
    mode = 'create',
    initialValues,
    onSubmit,
    onCancel,
}: TodoFormProps) => {



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = ((formData.get('title') as string) || '').trim();
        const description = ((formData.get('description') as string) || '').trim();

        if (!title || !description) return;

        onSubmit({ title, description });
        e.currentTarget.reset();

    };

    return (
        <form onSubmit={handleSubmit} className={style.form}>
            <label className={style.label}>
                Тема
                <input
                    className={style.input}
                    type="text"
                    name="title"
                    placeholder="Введите тему задачи"
                    defaultValue={initialValues?.title ?? ''}   // ⬅️ для edit
                    autoFocus
                    required
                />
            </label>

            <label className={style.label}>
                Описание
                <textarea
                    className={style.textarea}
                    name="description"
                    placeholder="Введите описание задачи"
                    defaultValue={initialValues?.description ?? ''}   // ⬅️ для edit
                    rows={4}
                    required
                />
            </label>

            <div className={style.actions}>
                <button type="button" onClick={onCancel} className={style.cancelButton}>
                    Отмена
                </button>
                <button type="submit" className={style.submitButton}>
                    {mode === 'edit' ? 'Сохранить' : 'Добавить'}   {/* ⬅️ текст */}
                </button>
            </div>
        </form>
    );
};