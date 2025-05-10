import { createSlice } from '@reduxjs/toolkit';

// Check if a token exists in cookies on initial load
const getInitialToken = () => {
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

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? getInitialToken() : null,
  isLoggedIn: typeof window !== 'undefined' ? !!getInitialToken() : false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
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
    },
    signOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
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