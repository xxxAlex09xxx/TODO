import { useState } from 'react';
import { useAppDispatch } from '../../../app/store/hooks';
// ВАЖНО: проверь правильность пути к экшену addTodo. 
// Скорее всего, он лежит в entities/todo/model/slice
import { addTodo } from '../../../entities/todo/model/slice'; 
import style from './TodoForm.module.scss';

interface AddTodoFormProps {
    onClose: () => void;
}

export const AddTodoForm = ({ onClose }: AddTodoFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useAppDispatch(); // Инициализируем dispatch

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedTitle = title.trim();
        const trimmedDesc = description.trim();
        
        if (!trimmedTitle || !trimmedDesc) return;

        // Отправляем задачу на сервер через Redux
        dispatch(addTodo({ 
            title: trimmedTitle, 
            description: trimmedDesc 
        }));
        
        // Очищаем форму
        setTitle('');
        setDescription('');
        
        // Закрываем модалку
        onClose(); 
    };

    return (
        <form onSubmit={handleSubmit} className={style.form}>
            <label className={style.label}>
                Тема
                <input
                    className={style.input}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите тему задачи"
                    autoFocus
                />
            </label>

            <label className={style.label}>
                Описание
                <textarea
                    className={style.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание задачи"
                    rows={4}
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
                    disabled={!title.trim() || !description.trim()}
                >
                    Добавить
                </button>
            </div>
        </form>
    );
};