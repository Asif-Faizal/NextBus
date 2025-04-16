import React from 'react';
import { useAppSelector } from '../store/hooks';

const Home: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600">
            You are logged in as {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;