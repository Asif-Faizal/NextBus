import React, { useState } from 'react';
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
    const [showFilters, setShowFilters] = useState(false);

    // Local state for filter inputs
    const [nameInput, setNameInput] = useState(filters.busName);
    const [plateInput, setPlateInput] = useState(filters.busNumberPlate);
    const [statusInput, setStatusInput] = useState<number | string>(filters.status || '');
    const [typeInput, setTypeInput] = useState(filters.busType);
    const [subTypeInput, setSubTypeInput] = useState(filters.busSubType);

    // Bus type and sub-type options
    const busTypes = ['', 'AC', 'NON AC'];
    const busSubTypes = ['', 'Sleeper', 'Seater'];

    const cardBackground = isDarkMode
        ? theme.colors.dark.card.background
        : theme.colors.light.card.background;

    const primaryColor = isDarkMode
        ? theme.colors.dark.primary
        : theme.colors.light.primary;

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
            className={`p-3 rounded-lg shadow-md mb-3 transition-all duration-300 ease-in-out ${
                showFilters ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
            style={{ backgroundColor: cardBackground }}
        >
            <h3 className="text-sm font-semibold mb-2" style={{ color: textPrimary }}>
                Search and Filter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                {/* Bus Name Filter */}
                <div>
                    <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: textPrimary }}
                    >
                        Bus Name
                    </label>
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full p-1.5 rounded border text-sm"
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
                        className="block text-xs font-medium mb-1"
                        style={{ color: textPrimary }}
                    >
                        License Plate
                    </label>
                    <input
                        type="text"
                        value={plateInput}
                        onChange={(e) => setPlateInput(e.target.value)}
                        className="w-full p-1.5 rounded border text-sm"
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
                        className="block text-xs font-medium mb-1"
                        style={{ color: textPrimary }}
                    >
                        Status
                    </label>
                    <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        className="w-full p-1.5 rounded border text-sm"
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
                        className="block text-xs font-medium mb-1"
                        style={{ color: textPrimary }}
                    >
                        Bus Type
                    </label>
                    <select
                        value={typeInput}
                        onChange={(e) => setTypeInput(e.target.value)}
                        className="w-full p-1.5 rounded border text-sm"
                        style={{
                            backgroundColor: inputBackground,
                            color: inputText,
                            borderColor: inputBorder
                        }}
                    >
                        {busTypes.map((type) => (
                            <option key={type} value={type}>
                                {type || 'All Types'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bus Sub-Type Filter */}
                <div>
                    <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: textPrimary }}
                    >
                        Bus Sub-Type
                    </label>
                    <select
                        value={subTypeInput}
                        onChange={(e) => setSubTypeInput(e.target.value)}
                        className="w-full p-1.5 rounded border text-sm"
                        style={{
                            backgroundColor: inputBackground,
                            color: inputText,
                            borderColor: inputBorder
                        }}
                    >
                        {busSubTypes.map((subType) => (
                            <option key={subType} value={subType}>
                                {subType || 'All Sub-Types'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={applyFilters}
                    style={{ backgroundColor: primaryColor, color: textSecondary }}
                    className="px-3 py-1.5 rounded text-sm hover:opacity-80 transition-opacity"
                >
                    Search
                </button>

                <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
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
                    style={{ backgroundColor: primaryColor, color: textSecondary }}
                    className={`px-3 py-1 rounded ${page === 1
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
                    style={{ backgroundColor: primaryColor, color: textSecondary }}
                    className={`px-3 py-1 rounded ${page === totalPages
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
            <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Filter Toggle Button */}
            <div className="mb-3">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ backgroundColor: primaryColor, color: textSecondary }}
                    className="px-4 py-2 rounded-lg flex items-center space-x-2 hover:opacity-80 transition-opacity text-sm"
                >
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                            showFilters ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Filters */}
            {renderFilters()}

            {/* Buses List */}
            {buses.length === 0 ? (
                <div
                    className="p-4 rounded-lg shadow-md text-center text-sm"
                    style={{ backgroundColor: cardBackground, color: textSecondary }}
                >
                    No buses found. Try adjusting your filters.
                </div>
            ) : (
                <div className="space-y-3">
                    {buses.map((bus) => (
                        <div
                            key={bus._id}
                            className="p-3 rounded-lg shadow-md"
                            style={{ backgroundColor: cardBackground }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold" style={{ color: textPrimary }}>
                                    {bus.busName}
                                </h3>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs ${getStatusClass(bus.status)}`}
                                >
                                    {getStatusLabel(bus.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 text-sm" style={{ color: textPrimary }}>
                                <div>
                                    <p><strong>{bus.busType} - {bus.busSubType}</strong></p>
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