// src/entities/todo/model/useTodo.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodoById, updateTodo, deleteTodoById } from '../api/todos';

export const useTodo = (id: number) => {
    const queryClient = useQueryClient();

    // 1. Загрузка одной задачи
    const { data: todo, isLoading, error } = useQuery({
        queryKey: ['todo', id],
        queryFn: () => fetchTodoById(id),
        enabled: !isNaN(id), // Не делаем запрос, если id некорректный
    });

    // 2. Переключение статуса
    const toggleMutation = useMutation({
        mutationFn: (completed: boolean) => updateTodo(id, { completed }),
        onSuccess: () => {
            // Обновляем и страницу деталей, и общий список задач
            queryClient.invalidateQueries({ queryKey: ['todo', id] });
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    // 3. Удаление
    const deleteMutation = useMutation({
        mutationFn: () => deleteTodoById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
    

    return {
        todo,
        isLoading,
        error: error ? (error as Error).message : null,
        toggleTodo: (completed: boolean) => toggleMutation.mutate(completed),
        deleteTodo: () => deleteMutation.mutate(),
    };
};