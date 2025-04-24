'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getBuses } from '@/store/slices/busSlice';
import BusList from '@/components/BusList';

const BusesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { buses, loading, error } = useAppSelector((state) => state.buses);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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