// redux/features/activitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Track if we have an in-flight request to prevent duplicates
let fetchInProgress = false;

export const fetchNewActivity = createAsyncThunk(
  'activity/fetchNewActivity',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get current state
      const state = getState();
      
      // If we already have activity data and a request is in progress, skip this request
      if (fetchInProgress) {
        // console.log('Skipping duplicate activity fetch - request already in progress');
        return state.activity.activity; // Return existing activity
      }
      
      // Mark that we're starting a request
      fetchInProgress = true;
      console.log('Fetching new activity through proxy API...');
      
      // Use our proxy API endpoint instead of direct calls to avoid CORS
      const response = await fetch('/api/activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch activity: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Activity data fetched successfully:', data);
      
      // Request complete, reset flag
      fetchInProgress = false;
      return data;
    } catch (error) {
      console.error('Error in fetchNewActivity thunk:', error);
      // Request complete (with error), reset flag
      fetchInProgress = false;
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