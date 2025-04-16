'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { theme } from '@/theme/theme';

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  isDarkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isDarkMode }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // This would be replaced with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If authentication is successful, redirect to dashboard
      console.log('Login successful', formData);
      // window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const textTheme = isDarkMode 
    ? theme.colors.dark.text 
    : theme.colors.light.text;

  return (
    <Card className="w-full max-w-md" isDarkMode={isDarkMode}>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          isDarkMode={isDarkMode}
          required
        />
        
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          isDarkMode={isDarkMode}
          required
        />
        
        <div className="flex justify-between items-center mb-6">
          <label 
            className="flex items-center cursor-pointer"
            style={{ 
              color: textTheme.secondary,
              fontFamily: theme.fontFamily.primary
            }}
          >
            <input
              type="checkbox"
              className="mr-2"
              style={{ accentColor: isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary }}
            />
            <span className="text-sm">Remember me</span>
          </label>
          
          <a
            href="#"
            className="text-sm hover:underline"
            style={{ 
              color: isDarkMode ? theme.colors.dark.secondary : theme.colors.light.secondary,
              fontFamily: theme.fontFamily.primary
            }}
          >
            Forgot password?
          </a>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        >
          Sign In
        </Button>
        
        <div 
          className="mt-4 text-center"
          style={{ 
            color: textTheme.secondary,
            fontFamily: theme.fontFamily.primary
          }}
        >
        </div>
      </form>
    </Card>
  );
};

export default LoginForm; 