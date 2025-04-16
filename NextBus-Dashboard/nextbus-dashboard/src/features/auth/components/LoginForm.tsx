'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { login } from '@/services/authService';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { theme } from '@/theme/theme';

interface LoginFormData {
  username: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

interface LoginFormProps {
  isDarkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isDarkMode }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
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
      dispatch(loginStart());
      const response = await login({
        username: formData.username,
        password: formData.password
      });
      
      console.log('Login response:', response);
      
      dispatch(loginSuccess({
        user: {
          _id: response._id,
          username: response.username,
          role: response.role,
        },
        token: response.token,
      }));
      
      router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const textTheme = isDarkMode 
    ? theme.colors.dark.text 
    : theme.colors.light.text;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md" isDarkMode={isDarkMode}>
        <form onSubmit={handleSubmit} className="p-8">
          <h2 
            className="text-3xl font-bold text-center mb-8"
            style={{ 
              color: textTheme.primary,
              fontFamily: theme.fontFamily.primary
            }}
          >
            Welcome Back
          </h2>
          
          <Input
            type="text"
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            isDarkMode={isDarkMode}
            required
          />
          
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
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
          
          {errors.username || errors.password ? (
            <div 
              className="mt-4 text-center text-sm"
              style={{ 
                color: isDarkMode ? theme.colors.dark.error : theme.colors.light.error,
                fontFamily: theme.fontFamily.primary
              }}
            >
              {errors.username || errors.password}
            </div>
          ) : null}
        </form>
      </Card>
    </div>
  );
};

export default LoginForm; 