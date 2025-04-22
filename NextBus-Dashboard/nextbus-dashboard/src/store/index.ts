import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import busReducer from './slices/busSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    buses: busReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;