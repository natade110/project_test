// redux/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get token from cookies
const getTokenFromCookies = () => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring('token='.length);
    }
  }
  return null;
};

// Helper function to set token in cookies
const setTokenInCookies = (token) => {
  if (typeof window === 'undefined') return;
  
  // Set cookie with 1 day expiry
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
};

// Helper function to remove token from cookies
const removeTokenFromCookies = () => {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
};

// Initialize state with token from cookies if available
const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

// A thunk for signing out that handles the cookie removal
export const signOutAsync = createAsyncThunk(
  'auth/signOutAsync',
  async (_, { dispatch }) => {
    // Clear token cookie
    removeTokenFromCookies();
    
    // Dispatch regular sign out action
    dispatch(signOut());
    
    return { success: true };
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const { token, email, firstName, lastName } = action.payload;
      
      // Set token in cookies
      setTokenInCookies(token);
      
      // Update state
      state.token = token;
      state.user = { email, firstName, lastName };
      state.isLoggedIn = true;
      state.error = null;
    },
    signOut: (state) => {
      // Update Redux state only (cookie handling is done in the thunk)
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    checkAuth: (state) => {
      // For client-side auth checking
      const token = getTokenFromCookies();
      state.token = token;
      state.isLoggedIn = !!token;
    }
  }
});

export const { signIn, signOut, setAuthLoading, setAuthError, checkAuth } = authSlice.actions;
export default authSlice.reducer;