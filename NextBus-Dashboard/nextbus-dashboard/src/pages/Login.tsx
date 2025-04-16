'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { login } from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import GradientBackground from '@/components/GradientBackground';
import { theme } from '@/theme/theme';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const response = await login({ username, password });
      dispatch(loginSuccess({
        user: {
          _id: response._id,
          username: response.username,
          role: response.role,
        },
        token: response.token,
      }));
      router.push('/home');
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'Login failed'));
    }
  };

  return (
    <GradientBackground isDarkMode={false}>
      <div className="min-h-screen flex items-center justify-between px-20">
        {/* Left side - Welcome text */}
        <div className="w-1/2 pr-12">
          <h1 className="text-5xl font-bold mb-6" style={{ 
            color: theme.colors.light.text.primary,
            fontFamily: theme.fontFamily.primary
          }}>
            Welcome to NextBus
          </h1>
          <p className="text-xl mb-8" style={{ 
            color: theme.colors.light.text.secondary,
            fontFamily: theme.fontFamily.primary
          }}>
            Your journey starts here. Sign in to access your dashboard and manage your bus routes efficiently.
          </p>
        </div>

        {/* Right side - Login form */}
        <div className="w-1/2">
          <div className="max-w-md w-full space-y-8 p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
            <div>
              <h2 className="text-3xl font-bold text-center" style={{ 
                color: theme.colors.light.text.primary,
                fontFamily: theme.fontFamily.primary
              }}>
                Sign in to your account
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Login; 