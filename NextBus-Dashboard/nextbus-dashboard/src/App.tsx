'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/index';
import Login from './pages/Login';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      {pathname === '/login' ? (
        <Login />
      ) : pathname === '/home' ? (
        <PrivateRoute>
          <div>Home Page Content</div>
        </PrivateRoute>
      ) : (
        <Login />
      )}
    </Provider>
  );
};

export default App; 