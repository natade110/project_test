// redux/features/activitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNewActivity = createAsyncThunk(
  'activity/fetchNewActivity',
  async (_, { rejectWithValue }) => {
    try {
      // Use our proxy API route instead of directly accessing BoredAPI
      const response = await fetch('/api/activity');
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
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
      })
      .addCase(fetchNewActivity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearActivity } = activitySlice.actions;

export default activitySlice.reducer;