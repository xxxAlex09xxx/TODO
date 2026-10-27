// src/entities/todo/ui/TodoState.tsx
import { useAppSelector } from '../../../app/store/hooks';
import style from './TodoState.module.scss'; // Перенеси стили сюда

export const TodoState = () => {
    // Достаем задачи из Redux
    const todos = useAppSelector((state) => state.todos.todos);
    
    // Считаем статистику прямо здесь
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    return (
        <div className={style.todoStats}>
            <span>Всего: {total}</span>
            <span>✅ Выполнено: {completed}</span>
            <span>⏳ Осталось: {active}</span>
        </div>
    );
};