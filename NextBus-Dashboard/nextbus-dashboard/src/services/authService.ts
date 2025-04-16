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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed');
  }
}; 