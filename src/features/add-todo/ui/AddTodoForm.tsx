// src/features/add-todo/ui/AddTodoForm.tsx
import { useState } from 'react';
import { useAppDispatch } from '../../../app/store/hooks';
import { addTodo } from '../../../entities/todo/model/slice';
import styles from './TodoForm.module.scss';

export const AddTodoForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Отправляем задачу на сервер через Redux
        dispatch(addTodo({ 
            title: title.trim(), 
            description: description.trim() 
        }));
        
        // Очищаем форму
        setTitle('');
        setDescription('');
    };

    return (
  
            <button type="submit"
            className={styles.addButton}
            >Добавить</button>
       
    );
};