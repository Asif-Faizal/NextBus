'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import GradientBackground from '@/components/GradientBackground';
import { theme } from '@/theme/theme';
import { useTheme } from '@/context/ThemeContext';

const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useTheme();

  const cardBackground = isDarkMode 
    ? theme.colors.dark.card.background 
    : theme.colors.light.card.background;

  return (
    <GradientBackground isDarkMode={isDarkMode}>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div 
          className="max-w-4xl w-full backdrop-blur-sm rounded-lg shadow-xl p-8"
          style={{ backgroundColor: cardBackground }}
        >
          <h1 className="text-4xl font-bold mb-6" style={{ 
            color: isDarkMode ? theme.colors.dark.text.primary : theme.colors.light.text.primary,
            fontFamily: theme.fontFamily.primary
          }}>
            Welcome, {user?.username}!
          </h1>
          <p className="text-xl mb-8" style={{ 
            color: isDarkMode ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary,
            fontFamily: theme.fontFamily.primary
          }}>
            You are logged in as {user?.role}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: cardBackground }}
            >
              <h2 className="text-2xl font-semibold mb-4" style={{ 
                color: isDarkMode ? theme.colors.dark.text.primary : theme.colors.light.text.primary,
                fontFamily: theme.fontFamily.primary
              }}>
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span style={{ 
                    color: isDarkMode ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary,
                    fontFamily: theme.fontFamily.primary
                  }}>
                    Total Routes
                  </span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ 
                    color: isDarkMode ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary,
                    fontFamily: theme.fontFamily.primary
                  }}>
                    Active Buses
                  </span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: cardBackground }}
            >
              <h2 className="text-2xl font-semibold mb-4" style={{ 
                color: isDarkMode ? theme.colors.dark.text.primary : theme.colors.light.text.primary,
                fontFamily: theme.fontFamily.primary
              }}>
                Recent Activity
              </h2>
              <p style={{ 
                color: isDarkMode ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary,
                fontFamily: theme.fontFamily.primary
              }}>
                No recent activity to display.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default HomePage; 