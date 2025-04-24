const API_URL = 'http://localhost:5001/api'; // Replace with your actual API URL

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  _id: string;
  username: string;
  role: string;
  token: string;
  refreshToken: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Invalid username or password');
      } else if (response.status === 400) {
        throw new Error('Please check your input and try again');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later');
      } else {
        throw new Error(data.message || data.error || 'Login failed. Please try again');
      }
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during login');
  }
}; 