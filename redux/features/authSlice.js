// redux/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
};

// Initialize state with token from cookies if available
const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? getTokenFromCookies() : null,
  isLoggedIn: typeof window !== 'undefined' ? !!getTokenFromCookies() : false,
  loading: false,
  error: null,
};

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
      // Clear cookie is handled in the component
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
    }
  }
});

export const { signIn, signOut, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;