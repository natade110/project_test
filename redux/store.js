import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import activityReducer from './features/activitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activity: activityReducer,
  },
  // Adding middleware to handle async operations
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;