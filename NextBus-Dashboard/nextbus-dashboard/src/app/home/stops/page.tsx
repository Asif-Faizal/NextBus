'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';

const StopsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const cardBackground = isDarkMode 
    ? theme.colors.dark.card.background 
    : theme.colors.light.card.background;

  return (
    <div className="space-y-6">
      <div 
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: cardBackground }}
      >
        <h2 className="text-2xl font-semibold mb-4" style={{ 
          color: isDarkMode ? theme.colors.dark.text.primary : theme.colors.light.text.primary,
          fontFamily: theme.fontFamily.primary
        }}>
          Bus Stops Management
        </h2>
        <p style={{ 
          color: isDarkMode ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary,
          fontFamily: theme.fontFamily.primary
        }}>
          Manage and monitor all bus stops in your network.
        </p>
      </div>
    </div>
  );
};

export default StopsPage; 