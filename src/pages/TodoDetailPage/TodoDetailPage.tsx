import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { useDeleteTodo } from '@/features/delete-todo/model/useDeleteTodo';
import { useToggleTodo } from '@/features/toggle-todo/model/useToggleTodo';
import style from './TodoDetailPage.module.scss';

export const TodoDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const todoId = Number(id);
    const navigate = useNavigate();

    // Достаем задачу из Redux
    const todos = useAppSelector((state) => state.todos.todos);
    const todo = todos.find((t) => t.id === todoId);

    const toggle = useToggleTodo();
    const remove = useDeleteTodo();

    const handleDelete = () => {
        if (!todo) return;
        remove(todo.id);
        navigate('/', { replace: true }); // Возвращаемся на главную
    };

    if (!Number.isFinite(todoId)) {
        return <div>Некорректный id задачи</div>;
    }

    if (!todo) {
        return <div>Задача не найдена</div>;
    }

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
                            onClick={() => toggle(todo.id, !todo.completed)}
                        >
                            {todo.completed ? '✅ Выполнена' : '🕒 Активна'}
                        </button>
                    </div>
                </div>

                <h1 className={style.title}>{todo.title}</h1>

                <p className={style.description}>
                    {todo.description?.trim() || 'Без описания'}
                </p>

                <button className={style.deleteButton} onClick={handleDelete}>
                    Удалить задачу
                </button>
            </div>
        </div>
    );
};