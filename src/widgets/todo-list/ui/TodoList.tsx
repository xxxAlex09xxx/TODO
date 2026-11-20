import { useSearchParams } from 'react-router-dom';
import { useTodos, TodoItem } from '@/entities/todo';
import type { TaskFilter } from '@/entities/todo/model/types';
import style from './TodoList.module.scss';

const FILTER_EMPTY_MESSAGES = {
    all: 'У вас пока нет задач',
    active: 'Все задачи выполнены!',
    completed: 'Нет выполненных задач',
};

export const TodoList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const filter = (searchParams.get('filter') as TaskFilter) || 'all';

    const {
        todos,
        loading,
        error,
        pagination,
        toggleTodo,
        deleteTodo,
    } = useTodos(page, filter);

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', String(newPage));
            return prev;
        });
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    if (todos.length === 0) {
        return (
            <p className={style.emptyMessage}>
                {FILTER_EMPTY_MESSAGES[filter] ?? FILTER_EMPTY_MESSAGES.all}
            </p>
        );
    }

    return (
        <div className={style.listContainer}>
            <ul className={style.todoList}>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                    />
                ))}
            </ul>

            {pagination && pagination.totalPages > 1 && (
    <div className={style.pagination}>
        <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
        >
            Назад
        </button>

        {/* 👇 ВОТ ЭТОТ БЛОК ВЫВОДИТ НОМЕРА */}
        {Array.from({ length: 7 }, (_, i) => {
            // Вычисляем, какую страницу показывать (смещаем окно вокруг текущей)
            const pageNumber = pagination.page - 2 + i;
            
            // Скрываем номера, которые выходят за пределы (меньше 1 или больше максимума)
            if (pageNumber < 1 || pageNumber > pagination.totalPages) return null;

            return (
                <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={pagination.page === pageNumber}
                    style={{ fontWeight: pagination.page === pageNumber ? 'bold' : 'normal' }}
                >
                    {pageNumber}
                </button>
            );
        })}

        <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
        >
            Далее
        </button>
    </div>
)}
        </div>
    );
};