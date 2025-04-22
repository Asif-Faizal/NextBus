import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/theme/theme';
import { Bus } from '@/services/busService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  getBuses, 
  setPage, 
  setNameFilter, 
  setPlateFilter, 
  setStatusFilter, 
  setBusTypeFilter, 
  setBusSubTypeFilter,
  resetFilters
} from '@/store/slices/busSlice';

interface BusListProps {
  buses: Bus[];
  loading: boolean;
  error: string | null;
}

const BusList: React.FC<BusListProps> = ({ buses, loading, error }) => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { page, totalPages, filters } = useAppSelector((state) => state.buses);
  
  // Local state for filter inputs
  const [nameInput, setNameInput] = useState(filters.busName);
  const [plateInput, setPlateInput] = useState(filters.busNumberPlate);
  const [statusInput, setStatusInput] = useState<number | string>(filters.status || '');
  const [typeInput, setTypeInput] = useState(filters.busType);
  const [subTypeInput, setSubTypeInput] = useState(filters.busSubType);
  
  const cardBackground = isDarkMode 
    ? theme.colors.dark.card.background 
    : theme.colors.light.card.background;
  
  const textPrimary = isDarkMode 
    ? theme.colors.dark.text.primary 
    : theme.colors.light.text.primary;
  
  const textSecondary = isDarkMode 
    ? theme.colors.dark.text.secondary 
    : theme.colors.light.text.secondary;
    
  const inputBackground = isDarkMode
    ? theme.colors.dark.input.background
    : theme.colors.light.input.background;
    
  const inputText = isDarkMode
    ? theme.colors.dark.text.primary
    : theme.colors.light.text.primary;
    
  const inputBorder = isDarkMode
    ? theme.colors.dark.input.border
    : theme.colors.light.input.border;

  // Apply filters when search button is clicked
  const applyFilters = () => {
    dispatch(setNameFilter(nameInput));
    dispatch(setPlateFilter(plateInput));
    dispatch(setStatusFilter(statusInput === '' ? null : Number(statusInput)));
    dispatch(setBusTypeFilter(typeInput));
    dispatch(setBusSubTypeFilter(subTypeInput));
    dispatch(getBuses());
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setNameInput('');
    setPlateInput('');
    setStatusInput('');
    setTypeInput('');
    setSubTypeInput('');
    dispatch(resetFilters());
    dispatch(getBuses());
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
      dispatch(getBuses());
    }
  };

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

  // Filtering and pagination UI
  const renderFilters = () => (
    <div 
      className="p-4 rounded-lg shadow-md mb-4"
      style={{ backgroundColor: cardBackground }}
    >
      <h3 className="text-lg font-semibold mb-3" style={{ color: textPrimary }}>
        Search and Filter
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Bus Name Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1" 
            style={{ color: textSecondary }}
          >
            Bus Name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full p-2 rounded border"
            style={{ 
              backgroundColor: inputBackground,
              color: inputText,
              borderColor: inputBorder
            }}
            placeholder="Search by name"
          />
        </div>
        
        {/* Bus Plate Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1" 
            style={{ color: textSecondary }}
          >
            License Plate
          </label>
          <input
            type="text"
            value={plateInput}
            onChange={(e) => setPlateInput(e.target.value)}
            className="w-full p-2 rounded border"
            style={{ 
              backgroundColor: inputBackground,
              color: inputText,
              borderColor: inputBorder
            }}
            placeholder="Search by plate number"
          />
        </div>
        
        {/* Status Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1" 
            style={{ color: textSecondary }}
          >
            Status
          </label>
          <select
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
            className="w-full p-2 rounded border"
            style={{ 
              backgroundColor: inputBackground,
              color: inputText,
              borderColor: inputBorder
            }}
          >
            <option value="">All Statuses</option>
            <option value="1">WAITING FOR APPROVAL</option>
            <option value="2">ACTIVE</option>
            <option value="3">WAITING FOR EDIT</option>
            <option value="4">WAITING FOR DELETE</option>
          </select>
        </div>
        
        {/* Bus Type Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1" 
            style={{ color: textSecondary }}
          >
            Bus Type
          </label>
          <input
            type="text"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            className="w-full p-2 rounded border"
            style={{ 
              backgroundColor: inputBackground,
              color: inputText,
              borderColor: inputBorder
            }}
            placeholder="Filter by bus type"
          />
        </div>
        
        {/* Bus SubType Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1" 
            style={{ color: textSecondary }}
          >
            Bus Sub-Type
          </label>
          <input
            type="text"
            value={subTypeInput}
            onChange={(e) => setSubTypeInput(e.target.value)}
            className="w-full p-2 rounded border"
            style={{ 
              backgroundColor: inputBackground,
              color: inputText,
              borderColor: inputBorder
            }}
            placeholder="Filter by sub-type"
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
  
  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 rounded ${
            page === 1 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        
        <div className="flex items-center px-3" style={{ color: textPrimary }}>
          Page {page} of {totalPages}
        </div>
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1 rounded ${
            page === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    );
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

  return (
    <div>
      {/* Filters */}
      {renderFilters()}
      
      {/* Buses List */}
      {buses.length === 0 ? (
        <div 
          className="p-6 rounded-lg shadow-md text-center"
          style={{ backgroundColor: cardBackground, color: textSecondary }}
        >
          No buses found. Try adjusting your filters.
        </div>
      ) : (
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
      )}
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default BusList; 