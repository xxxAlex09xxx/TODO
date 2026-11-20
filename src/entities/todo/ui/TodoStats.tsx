// src/widgets/todo-stats/ui/TodoStats.tsx
import { TodoState, useTodos } from '@/entities/todo';

export const TodoStats = () => {
  
    const { stats } = useTodos(1, 'all');

    return (
        <TodoState 
            total={stats.total} 
            completed={stats.completed} 
            active={stats.active} 
        />
    );
};