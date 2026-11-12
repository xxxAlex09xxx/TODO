// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import {themeReducer} from '@/entities/theme';
import {filterReducer} from '@/entities/filter';

export const store = configureStore({
    reducer: { 
        theme: themeReducer,
        filter: filterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;