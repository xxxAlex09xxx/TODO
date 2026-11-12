// src/pages/TodoDetailPage/TodoDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTodo } from '@/entities/todo'; 
import style from './TodoDetailPage.module.scss';

const TodoDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const todoId = Number(id);
    const navigate = useNavigate();

    
    const { todo, isLoading, error, toggleTodo, deleteTodo } = useTodo(todoId);

    const handleDelete = () => {
        deleteTodo();
        navigate('/', { replace: true });
    };

    if (!Number.isFinite(todoId)) {              //проверка что число
        return <div>Некорректный id задачи</div>;
    }

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

                <button className={style.deleteButton} onClick={handleDelete}>
                    Удалить задачу
                </button>
            </div>
        </div>
    );
};
export default TodoDetailPage;