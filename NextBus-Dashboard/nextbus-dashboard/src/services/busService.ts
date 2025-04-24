import { apiRequest } from './apiHandler';

const API_URL = 'http://localhost:5001/api'; // Replace with your actual API URL

export interface Bus {
  _id: string;
  busName: string;
  busNumberPlate: string;
  busOwnerName: string;
  busType: string;
  busSubType: string;
  driverName: string;
  conductorName: string;
  status: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  approvedBy?: string;
  lastModifiedBy?: string;
}

export interface PaginatedBusResult {
  data: Bus[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BusQueryOptions {
  page?: number;
  limit?: number;
  busName?: string;
  busNumberPlate?: string;
  status?: number;
  busType?: string;
  busSubType?: string;
}

export const fetchBuses = async (options: BusQueryOptions = {}): Promise<PaginatedBusResult> => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.busName) queryParams.append('busName', options.busName);
    if (options.busNumberPlate) queryParams.append('busNumberPlate', options.busNumberPlate);
    if (options.status) queryParams.append('status', options.status.toString());
    if (options.busType) queryParams.append('busType', options.busType);
    if (options.busSubType) queryParams.append('busSubType', options.busSubType);

    const queryString = queryParams.toString();
    const url = `${API_URL}/buses${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest(url, {
      method: 'GET',
    });

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error('You do not have permission to access this resource');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch buses');
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching buses');
  }
}; 