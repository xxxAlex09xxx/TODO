// src/widgets/todo-detail/ui/TodoDetailWidget.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodo } from '@/entities/todo';
import { Modal } from '@/shared/ui';
import { TodoFormContainer } from '@/features/add-todo';
import style from './TodoDetailWidget.module.scss';

interface TodoDetailWidgetProps {
    todoId: number;
}

export const TodoDetailWidget = ({ todoId }: TodoDetailWidgetProps) => {
    const isValidId = Number.isInteger(todoId) && todoId > 0;
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal  = useCallback(() => setIsModalOpen(true),  []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const { todo, isLoading, error, toggleTodo, deleteTodo } = useTodo(
        isValidId ? todoId : undefined,
    );

    const handleDelete = () => {
        deleteTodo();
        navigate('/', { replace: true });
    };

    if (!isValidId) return <div>Некорректный id задачи</div>;
    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!todo) return <div>Задача не найдена</div>;

    return (
        <div className={style.wrapper}>
            <div className={style.card}>
                <div className={style.head}>
                    <button className={style.backButton} onClick={() => navigate(-1)}>
                        ← Назад
                    </button>
                    <div className={style.meta}>
                        <button
                            type="button"
                            className={`${style.statusButton} ${todo.completed ? style.done : style.active}`}
                            onClick={() => toggleTodo(!todo.completed)}
                        >
                            {todo.completed ? '✅ Выполнена' : '🕒 Активна'}
                        </button>
                    </div>
                </div>

                <h1 className={style.title}>{todo.title}</h1>
                <p className={style.description}>
                    {todo.description?.trim() || 'Без описания'}
                </p>

                <div className={style.actions}>
                    <button className={style.addButton} onClick={openModal}>
                        Редактировать
                    </button>
                    <button className={style.deleteButton} onClick={handleDelete}>
                        Удалить
                    </button>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Редактировать задачу"
                >
                    <TodoFormContainer
                        mode="edit"
                        todoId={todo.id}
                        initialValues={{ title: todo.title, description: todo.description }}
                        onSuccess={closeModal}
                        onCancel={closeModal}
                    />
                </Modal>
            </div>
        </div>
    );
};