// src/widgets/todo-list/TodoList.tsx
import { useEffect,useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/store/hooks';
import { loadTodos } from '../../entities/todo/model/slice';
import { TodoItem } from '../../entities/todo/ui/TodoItem'; // 👈 Импортируем карточку
import { useToggleTodo } from '../../features/toggle-todo/model/useToggleTodo';
import { useDeleteTodo } from '../../features/delete-todo/model/useDeleteTodo';

export const TodoList = () => {
    const dispatch = useAppDispatch();
    const { todos, loading, error, filter } = useAppSelector((state) => state.todos);
     const toggle = useToggleTodo();
    const remove = useDeleteTodo();

    useEffect(() => {
        dispatch(loadTodos());
    }, [dispatch]);

    const visibleTodos = useMemo(() => {
        switch (filter) {
            case 'active':
                return todos.filter(t => !t.completed);
            case 'completed':
                return todos.filter(t => t.completed);
            case 'all':
            default:
                return todos;
        }
    }, [todos, filter]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <ul>
            {visibleTodos.slice().reverse().map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggle(todo.id, !todo.completed)}
                    onDelete={() => remove(todo.id)}
                />
            ))}
        </ul>
    );
};