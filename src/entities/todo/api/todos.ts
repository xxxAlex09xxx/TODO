// src/entities/todo/api/todos.ts
import { apiFetch } from '@/shared/api/client';
import type { Todo } from '../model/types';

const API_URL = 'http://localhost:5000/todos';

// Тип задачи с сервера (completed приходит как 0/1)
interface TodoFromServer {
    id: number;
    title: string;
    description: string;
    completed: 0 | 1;
    user_id: number;
    created_at: string;
}

export interface TodosPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface TodoStatse {
    total: number;
    completed: number;
    active: number;
}

interface TodoResponse {
    todos: TodoFromServer[];
    pagination: TodosPagination;
    stats: TodoStatse;
}

export type TodoFilter = 'all' | 'active' | 'completed'


// Преобразование: 0/1 → boolean
const formatTodo = (todo: TodoFromServer) => ({
    ...todo,
    completed: todo.completed === 1,
});

// GET /todos → { todos: [...] }
export const fetchTodos = async (params: {
    page: number;
    limit: number;
    filter: TodoFilter;
}): Promise<{
    todos: Todo[];
    pagination: TodosPagination;
    stats: TodoStatse;
}> => {
    const searchParams = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
        filter: params.filter,
    });

    const response = await apiFetch(`${API_URL}?${searchParams}`);
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    const data: TodoResponse = await response.json();
    return {
        todos: data.todos.map(formatTodo),
        pagination: data.pagination,
        stats: data.stats,
    };
};

// POST /todos → { todo }
export const createTodo = async (data: { title: string; description: string }): Promise<Todo> => {
    const response = await apiFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    const json: { todo: TodoFromServer } = await response.json();
    return formatTodo(json.todo);
};

// PATCH /todos/:id → { todo }
export const updateTodo = async (
    id: number,
    patch: { completed?: boolean, title?: string; description?: string }
): Promise<Todo> => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
    });
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    const data: { todo: TodoFromServer } = await response.json();
    return formatTodo(data.todo);
};

// DELETE /todo/:id → удалить задачу
export const deleteTodoById = async (id: number): Promise<void> => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
};
// DELETE /todos — удалить все задачи
export const deleteTodoAll = async (): Promise<void> => {
    const response = await apiFetch(API_URL, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
};


// GET /todo → { todo: Todo }
export const fetchTodoById = async (id: number): Promise<Todo> => {
    const response = await apiFetch(`${API_URL}/${id}`)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Задача  не найдена')
        }
        throw new Error(`ошибка: ${response.status}`)
    }
    const data: { todo: TodoFromServer } = await response.json();
    return formatTodo(data.todo);
}

