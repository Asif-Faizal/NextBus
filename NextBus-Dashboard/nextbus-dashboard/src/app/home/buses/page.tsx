'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getBuses } from '@/store/slices/busSlice';
import BusList from '@/components/BusList';

const BusesPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { buses, loading, error } = useAppSelector((state) => state.buses);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const cardBackground = isDarkMode 
    ? theme.colors.dark.card.background 
    : theme.colors.light.card.background;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getBuses());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="space-y-6">

      {/* Display buses list with enhanced filtering and pagination */}
      <BusList 
        buses={buses}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default BusesPage; 