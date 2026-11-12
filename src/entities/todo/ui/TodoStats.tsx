// src/widgets/todo-stats/ui/TodoStats.tsx
import { useTodos, TodoState } from '@/entities/todo';

export const TodoStats = () => {
    const { stats } = useTodos(); 

    return (
        <TodoState 
            total={stats.total} 
            completed={stats.completed} 
            active={stats.active} 
        />
    );
};