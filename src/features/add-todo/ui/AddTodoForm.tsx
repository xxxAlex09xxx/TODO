import { useAddTodo } from '../model/useAddTodo';
import style from './TodoForm.module.scss';

interface AddTodoFormProps {
    onClose: () => void;
}

export const AddTodoForm = ({ onClose }: AddTodoFormProps) => {
    const addTodo = useAddTodo(); 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Забираем данные прямо из формы в момент отправки
        const formData = new FormData(e.currentTarget);
        const title = (formData.get('title') as string || '').trim();
        const description = (formData.get('description') as string || '').trim();
        
        if (!title || !description) return;

        
        addTodo(title, description);
        
        // Очищаем форму и закрываем модалку
        e.currentTarget.reset(); 
        onClose(); 
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
                    rows={4}
                    required
                />
            </label>

            <div className={style.actions}>
                <button 
                    type="button" 
                    onClick={onClose} 
                    className={style.cancelButton}
                >
                    Отмена
                </button>
                <button 
                    type="submit" 
                    className={style.submitButton}
                >
                    Добавить
                </button>
            </div>
        </form>
    );
};