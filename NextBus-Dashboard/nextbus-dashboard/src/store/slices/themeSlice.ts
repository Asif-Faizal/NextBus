import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
}

const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

const initialState: ThemeState = {
  isDarkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', state.isDarkMode);
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
