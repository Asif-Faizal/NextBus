const API_URL = 'http://localhost:5001/api';

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

let isRefreshing = false;
let failedQueue: Array<() => void> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom();
    } else {
      prom();
    }
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('No refresh token available in localStorage');
    throw new Error('No refresh token available');
  }

  console.log('Attempting to refresh token with:', refreshToken);

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    console.log('Refresh token response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Refresh token failed:', errorData);
      throw new Error(errorData.message || 'Failed to refresh token');
    }

    const data = await response.json();
    console.log('Token refresh successful:', data);

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    console.error('Error during token refresh:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    console.log('Making API request to:', url);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('API response status:', response.status);

    if (response.status === 401 && retryCount === 0) {
      console.log('Received 401, attempting token refresh');
      
      if (isRefreshing) {
        console.log('Token refresh already in progress, queuing request');
        // If token refresh is in progress, wait for it
        return new Promise((resolve, reject) => {
          failedQueue.push(() => {
            apiRequest(url, options, 1)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        await refreshToken();
        isRefreshing = false;
        processQueue(null);
        console.log('Token refreshed, retrying original request');
        // Retry the original request with new token
        return apiRequest(url, options, 1);
      } catch (error) {
        console.error('Token refresh failed:', error);
        isRefreshing = false;
        processQueue(error as Error);
        throw error;
      }
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}; 