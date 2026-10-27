// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../../entities/todo/model/slice'; // 👈 Проверь путь!

export const store = configureStore({
    reducer: {
        todos: todoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;