// redux/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to clear auth cookies
const clearAuthCookies = () => {
  if (typeof window !== 'undefined') {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
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

// Async thunk to check authentication status
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuthAsync',
  async (_, { rejectWithValue }) => {
    try {
      // Check for token in cookies
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
        
        if (!token) {
          return { isLoggedIn: false, token: null };
        }
        
        // Optionally validate token with the server
        // For now, just return that we found a token
        return { 
          isLoggedIn: true, 
          token 
        };
      }
      
      return { isLoggedIn: false, token: null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initialize state
const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true, // Start with loading true
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
      state.loading = false;
    },
    signOut: (state) => {
      // Clear cookies using the helper function
      clearAuthCookies();
      
      // Update Redux state
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    checkAuth: (state) => {
      // Set loading to true when starting auth check
      state.loading = true;
      
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
        state.loading = false;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.token = null;
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { signIn, signOut, setAuthLoading, setAuthError, checkAuth } = authSlice.actions;
export default authSlice.reducer;