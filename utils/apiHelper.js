// utils/apiHelper.js
export const getAuthConfig = (token) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  };
  
  export const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Clear token and redirect to login
      document.cookie = 'token=; path=/; max-age=0';
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  };