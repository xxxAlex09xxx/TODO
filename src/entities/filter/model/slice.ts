// src/entities/filter/model/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskFilter = 'all' | 'active' | 'completed';

interface FilterState {
    filter: TaskFilter;
}

const initialState: FilterState = {
    filter: 'all',
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<TaskFilter>) => {
            state.filter = action.payload;
        },
    },
});

export const { setFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;