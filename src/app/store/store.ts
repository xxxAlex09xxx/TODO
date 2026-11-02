// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '@/entities/todo/model/slice';
import themeReducer from '@/entities/theme/model/slice';

export const store = configureStore({
    reducer: {
        todos: todoReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;