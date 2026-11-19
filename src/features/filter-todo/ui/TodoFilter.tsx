// src/features/filter-todo/ui/TodoFilters.tsx
import { useSearchParams } from 'react-router-dom';
import type { TaskFilter } from '@/entities/todo/model/types';
import style from './TodoFilter.module.scss';

export const TodoFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // 👇 Получаем текущий фильтр из URL или 'all' по умолчанию
    const currentFilter = (searchParams.get('filter') as TaskFilter) || 'all';

    const filters: { value: TaskFilter; label: string }[] = [
        { value: 'all', label: 'Все' },
        { value: 'active', label: 'Активные' },
        { value: 'completed', label: 'Выполненные' },
    ];

    const handleFilterChange = (value: TaskFilter) => {
        // 👇 Меняем URL (без перезагрузки страницы)
        setSearchParams({ filter: value });
    };

    return (
        <div className={style.filters}>
            {filters.map(({ value, label }) => (
                <button
                    key={value}
                    className={currentFilter === value ? style.active : ''}
                    onClick={() => handleFilterChange(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};