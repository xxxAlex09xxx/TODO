// src/widgets/todo-list/TodoList.tsx
import { useEffect,useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/store/hooks';
import { loadTodos, toggleTodo, removeTodo } from '../../entities/todo/model/slice';
import { TodoItem } from '../../entities/todo/ui/TodoItem'; // 👈 Импортируем карточку

export const TodoList = () => {
    const dispatch = useAppDispatch();
    const { todos, loading, error, filter } = useAppSelector((state) => state.todos);

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
                    onToggle={(id) => {
                        const task = todos.find(t => t.id === id);
                        if (task) {
                            dispatch(toggleTodo({ id, completed: !task.completed }));
                        }
                    }}
                    onDelete={(id) => dispatch(removeTodo(id))}
                />
            ))}
        </ul>
    );
};