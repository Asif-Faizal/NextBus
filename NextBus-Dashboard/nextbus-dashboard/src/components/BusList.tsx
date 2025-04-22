import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';
import { Bus } from '@/services/busService';

interface BusListProps {
  buses: Bus[];
  loading: boolean;
  error: string | null;
}

const BusList: React.FC<BusListProps> = ({ buses, loading, error }) => {
  const { isDarkMode } = useTheme();
  
  const cardBackground = isDarkMode 
    ? theme.colors.dark.card.background 
    : theme.colors.light.card.background;
  
  const textPrimary = isDarkMode 
    ? theme.colors.dark.text.primary 
    : theme.colors.light.text.primary;
  
  const textSecondary = isDarkMode 
    ? theme.colors.dark.text.secondary 
    : theme.colors.light.text.secondary;

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1:
        return 'WAITING FOR APPROVAL';
      case 2:
        return 'ACTIVE';
      case 3:
        return 'WAITING FOR EDIT';
      case 4:
        return 'WAITING FOR DELETE';
      default:
        return 'UNKNOWN';
    }
  };

  const getStatusClass = (status: number): string => {
    switch (status) {
      case 1:
        return 'bg-yellow-200 text-yellow-800';
      case 2:
        return 'bg-green-200 text-green-800';
      case 3:
        return 'bg-blue-200 text-blue-800';
      case 4:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (buses.length === 0) {
    return (
      <div 
        className="p-6 rounded-lg shadow-md text-center"
        style={{ backgroundColor: cardBackground, color: textSecondary }}
      >
        No buses found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <div 
          key={bus._id} 
          className="p-4 rounded-lg shadow-md"
          style={{ backgroundColor: cardBackground }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold" style={{ color: textPrimary }}>
              {bus.busName}
            </h3>
            <span 
              className={`px-3 py-1 rounded-full text-xs ${getStatusClass(bus.status)}`}
            >
              {getStatusLabel(bus.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2" style={{ color: textSecondary }}>
            <div>
            <p><strong>{bus.busType} - {bus.busSubType}</strong> </p>
              <p><strong>Plate:</strong> {bus.busNumberPlate}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusList; 