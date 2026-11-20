import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodoById,
    deleteTodoAll,
    type TodoFilter,
    type TodoStatse,
} from '../api/todos';

const TODOS_KEY = ['todos'];
const PAGE_SIZE = 9;

export const useTodos = (page?: number, filter?: TodoFilter) => {
    const queryClient = useQueryClient();

    // Загрузка только нужной страницы с выбранным фильтром
    const {
        data,
        isLoading: loading,
        error: queryError,
    } = useQuery({
        queryKey: [...TODOS_KEY, page, filter],
        queryFn: () => fetchTodos({
            page: page ?? 1,
        limit: PAGE_SIZE,
        filter: filter ?? 'all',
        }),
        enabled: page !== undefined && filter !== undefined,
    });

    const todos = data?.todos ?? [];
    const pagination = data?.pagination;

    const stats: TodoStatse = {
        total: data?.stats.total ?? 0,
        completed: data?.stats.completed ?? 0,
        active: data?.stats.active ?? 0,
    };

    // ➕ Добавление
    const addMutation = useMutation({
        mutationFn: ({ title, description }: { title: string; description: string }) =>
            createTodo({ title, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // 🔄 Переключение статуса
    const toggleMutation = useMutation({
        mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
            updateTodo(id, { completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // 🗑️ Удаление одной задачи
    const deleteMutation = useMutation({
        mutationFn: deleteTodoById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // 🗑️ Удаление всех задач
    const deleteAllMutation = useMutation({
        mutationFn: deleteTodoAll,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_KEY });
        },
    });

    // Общая ошибка
    const error =
        queryError?.message ??
        addMutation.error?.message ??
        toggleMutation.error?.message ??
        deleteMutation.error?.message ??
        deleteAllMutation.error?.message ??
        null;
        console.log(stats)

    return {
        todos,
        loading,
        error,
        stats,
        pagination,

        addTodo: (title: string, description: string) =>
            addMutation.mutate({ title, description }),

        toggleTodo: (id: number) => {
            const todo = todos.find(t => t.id === id);
            if (!todo) return;

            toggleMutation.mutate({
                id,
                completed: !todo.completed,
            });
        },

        deleteTodo: (id: number) => deleteMutation.mutate(id),

        deleteAllTodos: () => deleteAllMutation.mutate(),

        fetchTodos: () =>
            queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    };
};
