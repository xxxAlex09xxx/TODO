import { createSlice } from "@reduxjs/toolkit";

export type Theme = 'light'| 'dark';

interface ThemeState {
    theme: Theme;
}

const initialState: ThemeState = {
    theme: (localStorage.getItem('theme') as Theme) || 'light',
};

const themeSlice = createSlice({
name: 'theme',
initialState,
reducers: {
    toggleTheme: (state) =>{
        state.theme = state.theme === 'light'? 'dark' : 'light';
        localStorage.setItem('theme', state.theme);
    },
},
});

export const {toggleTheme} = themeSlice.actions;
export default themeSlice.reducer
