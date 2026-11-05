// src/entities/todo/ui/TodoState.tsx
import { useTodos } from '../model/useTodos'; // 👈 Импорт хука
import style from './TodoState.module.scss';

export const TodoState = () => {
    const { stats } = useTodos(); // 👈 Берем статистику из хука

    return (
        <div className={style.todoStats}>
            <span>Всего: {stats.total}</span>
            <span>✅ Выполнено: {stats.completed}</span>
            <span>⏳ Осталось: {stats.active}</span>
        </div>
    );
};