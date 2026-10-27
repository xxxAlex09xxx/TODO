// src/entities/todo/api/todos.ts
import { apiFetch } from '../../../shared/api/client';

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

// Преобразование: 0/1 → boolean
const formatTodo = (todo: TodoFromServer) => ({
    ...todo,
    completed: todo.completed === 1,
});

// GET /todos → { todos: [...] }
export const fetchTodos = async () => {
    const response = await apiFetch(API_URL);
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    const data: { todos: TodoFromServer[] } = await response.json();
    return data.todos.map(formatTodo);
};

// POST /todos → { todo }
export const createTodo = async (data: { title: string; description: string }) => {
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
    patch: { title?: string; description?: string; completed?: boolean }
) => {
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

// DELETE /todos/:id → { message }
export const deleteTodoById = async (id: number): Promise<void> => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
};