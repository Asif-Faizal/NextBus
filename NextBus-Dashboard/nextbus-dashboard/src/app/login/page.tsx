'use client';

import React from 'react';
import GradientBackground from '@/components/GradientBackground';
import LoginForm from '@/features/auth/components/LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';

const LoginContent = () => {
  const { isDarkMode } = useTheme();
  
  const textTheme = isDarkMode 
    ? theme.colors.dark.text 
    : theme.colors.light.text;
  
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-50 items-center">
          {/* Left column with heading */}
          <div className="w-full md:w-1/2 flex flex-col items-start md:items-start justify-center space-y-4">
            <h1 
              className="text-4xl md:text-5xl font-bold text-left"
              style={{ 
                color: textTheme.primary,
                fontFamily: theme.fontFamily.primary,
                fontWeight: theme.fontWeight.bold
              }}
            >
              Welcome to NextBus
            </h1>
            <p 
              className="text-xl md:text-2xl text-left"
              style={{ 
                color: textTheme.secondary,
                fontFamily: theme.fontFamily.primary
              }}
            >
              Sign in to access your dashboard
            </p>
            <p 
              className="text-base md:text-lg text-left mt-8"
              style={{ 
                color: textTheme.secondary,
                fontFamily: theme.fontFamily.primary
              }}
            >
              Plan your journey and track your rides with real-time updates.
            </p>
          </div>
          
          {/* Right column with form */}
          <div className="w-full md:w-1/2">
            <LoginForm isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </>
  );
};

const LoginPage = () => {
  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  );
};

export default LoginPage; 