'use client';

import React, { forwardRef } from 'react';
import { theme } from '@/theme/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isDarkMode?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isDarkMode = false, className = '', ...props }, ref) => {
    const inputTheme = isDarkMode ? theme.colors.dark.input : theme.colors.light.input;
    const textTheme = isDarkMode ? theme.colors.dark.text : theme.colors.light.text;
    
    return (
      <div className="w-full mb-4">
        {label && (
          <label
            className="block mb-2 text-sm font-medium"
            style={{ 
              color: textTheme.primary,
              fontFamily: theme.fontFamily.primary,
              fontWeight: theme.fontWeight.normal
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 transition-all duration-200 outline-none ${className}`}
          style={{
            backgroundColor: inputTheme.background,
            color: textTheme.primary,
            borderRadius: theme.borderRadius.small,
            border: `1px solid ${error ? theme.colors.light.error : inputTheme.border}`,
            fontFamily: theme.fontFamily.primary,
            boxShadow: error ? 'none' : theme.shadows.small,
          }}
          {...props}
        />
        {error && (
          <p
            className="mt-1 text-sm"
            style={{ 
              color: theme.colors.light.error,
              fontFamily: theme.fontFamily.primary
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 