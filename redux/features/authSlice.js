// redux/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get token from cookies helper
const getTokenFromCookies = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length, cookie.length);
      }
    }
  }
  return null;
};

// Set token in cookies
const setTokenInCookies = (token) => {
  if (typeof window !== 'undefined') {
    // Set cookie with 1 day expiry
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
  }
};

// Remove token from cookies
const removeTokenFromCookies = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; path=/; max-age=0';
  }
};

// Get initial state safely for SSR
const getInitialState = () => {
  const hasWindow = typeof window !== 'undefined';
  const token = hasWindow ? getTokenFromCookies() : null;
  
  return {
    user: null,
    token: token,
    isLoggedIn: !!token,
    loading: false,
    error: null,
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    signIn: (state, action) => {
      state.isLoggedIn = true;
      state.user = {
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
      state.token = action.payload.token;
      state.error = null;
      
      // Set token in cookies
      setTokenInCookies(action.payload.token);
    },
    signOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      
      // Remove token from cookies
      removeTokenFromCookies();
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { signIn, signOut, setAuthError, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;