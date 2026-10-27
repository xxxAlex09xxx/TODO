// entities/todo/model/slice.ts
import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import type { Todo, TaskFilter } from './types';
import { fetchTodos, createTodo, deleteTodoById, updateTodo } from '../api/todos';

// Асинхронные экшены (Thunks)
export const loadTodos = createAsyncThunk('todos/load', async () => {
    return await fetchTodos();
});

export const addTodo = createAsyncThunk(
    'todos/add', 
    async (data: { title: string; description: string }) => {
        return await createTodo(data); 
    }
);

export const toggleTodo = createAsyncThunk(
    'todos/toggle',
    async ({ id, completed }: { id: number; completed: boolean }) => {
        return await updateTodo(id, { completed });
    }
);

export const removeTodo = createAsyncThunk(
    'todos/remove',
    async (id: number) => {
        await deleteTodoById(id);
        return id; // Возвращаем id, чтобы удалить его из стейта
    }
);

interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
    filter:TaskFilter;
}

const initialState: TodoState = {
    todos: [],
    loading: false,
    error: null,
    filter: 'all',
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        // 👇 Добавляем экшен для очистки задач при выходе
        clearTodos: (state) => {
            state.todos = [];
        },
        setFilter: (state, action: PayloadAction<TaskFilter>) => {
            state.filter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка задач
            .addCase(loadTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
                state.loading = false;
                state.todos = action.payload;
            })
            .addCase(loadTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка загрузки';
            })
            // Добавление
            .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.todos.push(action.payload); // Добавляем то, что вернул сервер (с реальным ID)
            })
            // Переключение
            .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                const index = state.todos.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = action.payload; // Обновляем задачу на ту, что вернул сервер
                }
            })
            // Удаление
            .addCase(removeTodo.fulfilled, (state, action: PayloadAction<number>) => {
                state.todos = state.todos.filter(t => t.id !== action.payload);
            });
    },
});

export const { clearTodos, setFilter } = todoSlice.actions;
export default todoSlice.reducer;