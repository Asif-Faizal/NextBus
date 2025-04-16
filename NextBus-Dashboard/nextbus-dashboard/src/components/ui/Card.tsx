'use client';

import React from 'react';
import { theme } from '@/theme/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  isDarkMode = false 
}) => {
  const cardTheme = isDarkMode 
    ? theme.colors.dark.card.background 
    : theme.colors.light.card.background;
    
  return (
    <div 
      className={`p-6 ${className}`}
      style={{
        backgroundColor: cardTheme,
        borderRadius: theme.borderRadius.medium,
        boxShadow: theme.shadows.medium,
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  );
};

export default Card; 