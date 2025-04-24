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
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
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
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && retryCount === 0) {
      if (isRefreshing) {
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
        // Retry the original request with new token
        return apiRequest(url, options, 1);
      } catch (error) {
        isRefreshing = false;
        processQueue(error as Error);
        throw error;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}; 