import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bus, fetchBuses } from '@/services/busService';

interface BusState {
  buses: Bus[];
  loading: boolean;
  error: string | null;
}

const initialState: BusState = {
  buses: [],
  loading: false,
  error: null,
};

export const getBuses = createAsyncThunk(
  'buses/fetchBuses',
  async (_, { rejectWithValue }) => {
    try {
      const buses = await fetchBuses();
      return buses;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const busSlice = createSlice({
  name: 'buses',
  initialState,
  reducers: {
    clearBusesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBuses.fulfilled, (state, action: PayloadAction<Bus[]>) => {
        state.loading = false;
        state.buses = action.payload;
      })
      .addCase(getBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBusesError } = busSlice.actions;
export default busSlice.reducer; 