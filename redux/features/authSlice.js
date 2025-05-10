// redux/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper function to clear auth cookies
const clearAuthCookies = () => {
  if (typeof window !== 'undefined') {
    // Try all possible cookie clearing combinations
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie = "token=; path=/; domain=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict;";
    document.cookie = "token=; path=/; max-age=0;";
    
    // Make a network request to the signout API to clear HTTP-only cookies
    fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    }).catch(err => {
      console.error('Error during API signout:', err);
    });
  }
};

// Initialize state
const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const { token, email, firstName, lastName } = action.payload;
      
      // Update state
      state.token = token;
      state.user = { email, firstName, lastName };
      state.isLoggedIn = true;
      state.error = null;
    },
    signOut: (state) => {
      // Clear cookies using the helper function
      clearAuthCookies();
      
      // Update Redux state
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
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        let token = null;
        
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('token=')) {
            token = cookie.substring('token='.length);
            break;
          }
        }
        
        state.token = token;
        state.isLoggedIn = !!token;
      }
    }
  }
});

export const { signIn, signOut, setAuthLoading, setAuthError, checkAuth } = authSlice.actions;
export default authSlice.reducer;