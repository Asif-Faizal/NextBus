import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bus, fetchBuses, BusQueryOptions, PaginatedBusResult } from '@/services/busService';

interface BusState {
  buses: Bus[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: {
    busName: string;
    busNumberPlate: string;
    status: number | null;
    busType: string;
    busSubType: string;
  };
}

const initialState: BusState = {
  buses: [],
  loading: false,
  error: null,
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  filters: {
    busName: '',
    busNumberPlate: '',
    status: null,
    busType: '',
    busSubType: ''
  }
};

export const getBuses = createAsyncThunk(
  'buses/fetchBuses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { buses: BusState };
      const { page, limit, filters } = state.buses;
      
      // Build query options from state
      const queryOptions: BusQueryOptions = {
        page,
        limit,
        ...(filters.busName && { busName: filters.busName }),
        ...(filters.busNumberPlate && { busNumberPlate: filters.busNumberPlate }),
        ...(filters.status && { status: filters.status }),
        ...(filters.busType && { busType: filters.busType }),
        ...(filters.busSubType && { busSubType: filters.busSubType })
      };
      
      const result = await fetchBuses(queryOptions);
      return result;
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
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.filters.busName = action.payload;
      state.page = 1; // Reset to first page when filter changes
    },
    setPlateFilter: (state, action: PayloadAction<string>) => {
      state.filters.busNumberPlate = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.status = action.payload;
      state.page = 1;
    },
    setBusTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.busType = action.payload;
      state.page = 1;
    },
    setBusSubTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.busSubType = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBuses.fulfilled, (state, action: PayloadAction<PaginatedBusResult>) => {
        state.loading = false;
        state.buses = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearBusesError, 
  setPage, 
  setLimit, 
  setNameFilter, 
  setPlateFilter, 
  setStatusFilter, 
  setBusTypeFilter, 
  setBusSubTypeFilter,
  resetFilters
} = busSlice.actions;
export default busSlice.reducer; 