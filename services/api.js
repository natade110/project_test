const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Add token to request headers
const authHeader = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Sign up a new user
 * @param {Object} userData - User data including firstName, lastName, email, and password
 * @returns {Promise} Response from the API
 */
export const signUpUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in a user
 * @param {Object} credentials - User credentials including email and password
 * @returns {Promise} Response from the API with token and user info
 */
export const signInUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Get a new activity from the Bored API
 * @returns {Promise} Response with activity data
 */
export const getActivity = async () => {
  try {
    const response = await fetch('https://www.boredapi.com/api/activity');
    
    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Activity API error:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @param {string} token - Authentication token
 * @returns {Promise} Response with user profile data
 */
// Get user profile (protected route example)
export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'GET',
      headers: authHeader(token),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Export the API service
const apiService = {
  signUpUser,
  signInUser,
  getActivity,
  getUserProfile,
};

export default apiService;