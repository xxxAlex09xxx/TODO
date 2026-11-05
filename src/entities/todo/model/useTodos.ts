// app/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodoById,
} from '../api/todos';

interface TodoStats {
    total: number;
    completed: number;
    active: number;
}

// Ключ для кэша React Query
const TODOS_KEY = ['todos'];

export const useTodos = () => {
    const queryClient = useQueryClient();

    // 📥 Загрузка задач
    const {
        data: todos = [],
        isLoading: loading,
        error: queryError,
    } = useQuery({
        queryKey: TODOS_KEY,
        queryFn: fetchTodos,
    });

    // ➕ Добавление
    const addMutation = useMutation({
        mutationFn: ({ title, description }: { title: string; description: string }) =>
            createTodo({ title, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // 🔄 Переключение
    const toggleMutation = useMutation({
        mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
            updateTodo(id, { completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // 🗑️ Удаление
    const deleteMutation = useMutation({
        mutationFn: deleteTodoById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // 📊 Статистика
    const stats: TodoStats = {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        active: todos.filter(t => !t.completed).length,
    };

    // Ошибка — из любого места
    const error =
        queryError?.message ??
        addMutation.error?.message ??
        toggleMutation.error?.message ??
        deleteMutation.error?.message ??
        null;

    return {
        todos,
        loading,
        error,
        stats,

        addTodo: (title: string, description: string) => addMutation.mutate({ title, description }),

        toggleTodo: (id: number) => {
            const todo = todos.find(t => t.id === id);
            if (!todo) return;
            toggleMutation.mutate({ id, completed: !todo.completed });
        },

        deleteTodo: (id: number) => deleteMutation.mutate(id),

        fetchTodos: () =>
            queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    };
};
