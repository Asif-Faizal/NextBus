import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Helper function to safely access localStorage
const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getStoredRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: !!getStoredToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state: AuthState) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state: AuthState, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    loginFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer; 