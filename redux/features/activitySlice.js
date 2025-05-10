// redux/features/activitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNewActivity = createAsyncThunk(
  'activity/fetchNewActivity',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching new activity...');
      
      // Add a fallback in case the API fails
      let retries = 2;
      let error;
      
      while (retries > 0) {
        try {
          const response = await fetch('/api/activity', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // Prevent caching
            cache: 'no-cache'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch activity: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Activity data fetched successfully:', data);
          return data;
        } catch (err) {
          error = err;
          retries--;
          // Wait 1 second before retry
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // If all retries fail, try the fallback API
      try {
        console.log('Using fallback activity API');
        const fallbackResponse = await fetch('/api/fallback-activity', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('Fallback activity retrieved successfully:', fallbackData);
          return fallbackData;
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
      
      // If both main API and fallback fail, reject with the original error
      throw error;
    } catch (error) {
      console.error('Error in fetchNewActivity thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch activity');
    }
  }
);

// Fallback activity data in case API fails
const fallbackActivity = {
  activity: "Create a personal website",
  type: "creative",
  participants: 1,
  price: 0.1,
  accessibility: 0.8
};

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
    },
    setFallbackActivity: (state) => {
      state.activity = fallbackActivity;
      state.loading = false;
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

export const { clearActivity, clearActivityError, setFallbackActivity } = activitySlice.actions;

export default activitySlice.reducer;