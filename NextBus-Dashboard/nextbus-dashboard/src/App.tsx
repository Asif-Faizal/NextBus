'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/index';
import Login from './app/login/page';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider } from './context/ThemeContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <ThemeProvider>
        {pathname === '/login' ? (
          <Login />
        ) : (
          <PrivateRoute>
            <div>Home Page Content</div>
          </PrivateRoute>
        )}
      </ThemeProvider>
    </Provider>
  );
};

export default App; 