// src/widgets/todo-list/TodoList.tsx
import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/store/hooks';
import { loadTodos } from '../../../entities/todo/model/slice';
import { TodoItem } from '../../../entities/todo/ui/TodoItem'; // 👈 Импортируем карточку
import { useToggleTodo } from '../../../features/toggle-todo/model/useToggleTodo';
import { useDeleteTodo } from '../../../features/delete-todo/model/useDeleteTodo';
import style from './TodoList.module.scss'

export const TodoList = () => {
    const dispatch = useAppDispatch();
    const { todos, loading, error, filter } = useAppSelector((state) => state.todos);
    const toggle = useToggleTodo();
    const remove = useDeleteTodo();

    useEffect(() => {
        dispatch(loadTodos());
    }, [dispatch]);
    const FILTER_EMPTY_MESSAGES = {
        all: 'У вас пока нет задач',
        active: 'Все задачи выполнены!',
        completed: 'Нет выполненных задач',
    };

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
    if (visibleTodos.length === 0) {
        return <p className={style.emptyMessage}> {FILTER_EMPTY_MESSAGES[filter]} </p>
    }

    return (
        <div className={style.listContainer}>
            <ul className={style.todoList}>
                {visibleTodos.slice().reverse().map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={() => toggle(todo.id, !todo.completed)}
                        onDelete={() => remove(todo.id)}
                    />
                ))}
            </ul>
        </div>
    );
};