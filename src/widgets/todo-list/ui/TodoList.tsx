// src/widgets/todo-list/ui/TodoList.tsx
import { useMemo } from 'react';
import { useTodos } from '@/entities/todo/model/useTodos'; // 👈 React Query
import { useAppSelector } from '@/app/store/hooks'; // 👈 Redux (только для фильтра)
import { TodoItem } from '@/entities/todo/ui/TodoItem';
import style from './TodoList.module.scss';

const FILTER_EMPTY_MESSAGES = {
    all: 'У вас пока нет задач',
    active: 'Все задачи выполнены!',
    completed: 'Нет выполненных задач',
};

export const TodoList = () => {
    // 1. Берем задачи и функции из React Query
    const { todos, loading, error, toggleTodo, deleteTodo } = useTodos();
    
    // 2. Берем фильтр из Redux
    const filter = useAppSelector((state) => state.filter.filter);

    // 3. Фильтруем задачи
    const visibleTodos = useMemo(() => {
        switch (filter) {
            case 'active': return todos.filter(t => !t.completed);
            case 'completed': return todos.filter(t => t.completed);
            default: return todos;
        }
    }, [todos, filter]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;
    if (visibleTodos.length === 0) {
        return <p className={style.emptyMessage}>{FILTER_EMPTY_MESSAGES[filter]}</p>;
    }

    return (
        <div className={style.listContainer}>
            <ul className={style.todoList}>
                {visibleTodos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo} // 👈 Просто передаем функцию из хука
                        onDelete={deleteTodo} // 👈 Она сама знает, что делать
                    />
                ))}
            </ul>
        </div>
        
    );
};