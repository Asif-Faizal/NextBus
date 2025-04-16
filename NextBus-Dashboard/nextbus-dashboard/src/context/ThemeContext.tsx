'use client';

import React, { createContext, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme: handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 