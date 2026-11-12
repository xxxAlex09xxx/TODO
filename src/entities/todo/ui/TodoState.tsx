// src/entities/todo/ui/TodoState.tsx
import style from './TodoState.module.scss';

interface TodoStateProps {
    total: number;
    completed: number;
    active: number;
}

export const TodoState = ({ total, completed, active }: TodoStateProps) => {
    return (
        <div className={style.todoStats}>
            <span>Всего: {total}</span>
            <span>✅ Выполнено: {completed}</span>
            <span>⏳ Осталось: {active}</span>
        </div>
    );
};