'use client';

import React from 'react';
import { theme } from '@/theme/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isDarkMode?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isDarkMode = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonTheme = isDarkMode ? theme.colors.dark.button : theme.colors.light.button;
  
  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };
  
  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: buttonTheme.background,
          color: buttonTheme.text,
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: buttonTheme.background,
          border: `2px solid ${buttonTheme.background}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: buttonTheme.background,
          border: `1px solid ${buttonTheme.background}`,
        };
      default:
        return {
          backgroundColor: buttonTheme.background,
          color: buttonTheme.text,
          border: 'none',
        };
    }
  };
  
  return (
    <button
      className={`
        ${sizeClasses[size]} 
        ${fullWidth ? 'w-full' : ''} 
        font-medium transition-all duration-200 
        flex items-center justify-center
        ${className}
      `}
      disabled={isLoading || disabled}
      style={{
        ...getVariantStyles(),
        borderRadius: theme.borderRadius.medium,
        fontFamily: theme.fontFamily.primary,
        fontWeight: theme.fontWeight.bold,
        opacity: (isLoading || disabled) ? 0.7 : 1,
        cursor: (isLoading || disabled) ? 'not-allowed' : 'pointer',
        boxShadow: variant === 'primary' ? theme.shadows.small : 'none',
      }}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 