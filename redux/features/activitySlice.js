// redux/features/activitySlice.js - Updated version
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNewActivity = createAsyncThunk(
  'activity/fetchNewActivity',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching new activity...');
      
      // Use our proxy API route with better error handling
      const response = await fetch('/api/activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Prevent caching issues
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch activity');
      }
      
      const data = await response.json();
      console.log('Activity data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchNewActivity thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch activity');
    }
  }
);

const initialState = {
  activity: null,
  loading: false,
  error: null,
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivity: (state) => {
      state.activity = null;
    },
    clearActivityError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewActivity.fulfilled, (state, action) => {
        state.activity = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchNewActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred';
        console.error('Activity fetch rejected:', state.error);
      });
  },
});

export const { clearActivity, clearActivityError } = activitySlice.actions;

export default activitySlice.reducer;