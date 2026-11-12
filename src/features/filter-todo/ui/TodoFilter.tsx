// src/features/filter-todo/ui/TodoFilters.tsx
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setFilter } from '@/entities/filter';
import type { TaskFilter } from '@/entities/todo';
import style from './TodoFilter.module.scss'; // 👈 Скопируй стили из старого проекта

export const TodoFilters = () => {
    const dispatch = useAppDispatch();
    // Достаем текущий фильтр из Redux
    const currentFilter = useAppSelector((state) => state.filter.filter);

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