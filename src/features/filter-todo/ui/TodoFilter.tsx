// src/features/filter-todo/ui/TodoFilters.tsx
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setFilter } from '../../../entities/todo/model/slice';
import type { TaskFilter } from '../../../entities/todo/model/types';
import style from './TodoFilter.module.scss'; // 👈 Скопируй стили из старого проекта

export const TodoFilters = () => {
    const dispatch = useAppDispatch();
    // Достаем текущий фильтр из Redux
    const currentFilter = useAppSelector((state) => state.todos.filter);

    const filters: { value: TaskFilter; label: string }[] = [
        { value: 'all', label: 'Все' },
        { value: 'active', label: 'Активные' },
        { value: 'completed', label: 'Выполненные' },
    ];

    return (
        <div className={style.filters}>
            {filters.map(({ value, label }) => (
                <button
                    key={value}
                    className={currentFilter === value ? style.active : ''}
                    onClick={() => dispatch(setFilter(value))} // 👈 Меняем Redux
                >
                    {label}
                </button>
            ))}
        </div>
    );
};