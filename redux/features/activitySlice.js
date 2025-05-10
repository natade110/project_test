import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNewActivity = createAsyncThunk(
  'activity/fetchNewActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://www.boredapi.com/api/activity');
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      const data = await response.json();
      return data;
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
        state.loading = false;
        state.activity = action.payload;
      })
      .addCase(fetchNewActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActivity } = activitySlice.actions;

export default activitySlice.reducer;