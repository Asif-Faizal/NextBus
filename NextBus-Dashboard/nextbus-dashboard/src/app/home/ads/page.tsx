'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';

const AdsPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const cardBackground = isDarkMode
    ? theme.colors.dark.card.background
    : theme.colors.light.card.background;

  const textPrimary = isDarkMode
    ? theme.colors.dark.text.primary
    : theme.colors.light.text.primary;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold" style={{ color: textPrimary }}>
          Advertisement Configuration
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Ads Section */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: cardBackground }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: textPrimary }}>
            Active Advertisements
          </h2>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: textPrimary }}>
              No active advertisements configured.
            </p>
          </div>
        </div>

        {/* Ad Configuration Section */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: cardBackground }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: textPrimary }}>
            Configure New Advertisement
          </h2>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: textPrimary }}>
              Advertisement configuration options will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsPage; 