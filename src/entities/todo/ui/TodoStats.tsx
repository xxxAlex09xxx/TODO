// src/widgets/todo-stats/ui/TodoStats.tsx
import { TodoState, useTodos } from '@/entities/todo';

export const TodoStats = () => {
    // Всегда запрашиваем 1-ю страницу с фильтром 'all'.
    // Это гарантирует, что мы получим общую статистику.
    const { stats } = useTodos(1, 'all');

    return (
        <TodoState 
            total={stats.total} 
            completed={stats.completed} 
            active={stats.active} 
        />
    );
};