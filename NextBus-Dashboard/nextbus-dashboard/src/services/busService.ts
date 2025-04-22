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

export const fetchBuses = async (): Promise<Bus[]> => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/buses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again');
      } else if (response.status === 403) {
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