"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { signOut } from '@/redux/features/authSlice';

export default function DashboardPage() {
  const { isLoggedIn, token } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Function to clear token cookie - defined outside useEffect for reuse
  const clearTokenCookie = () => {
    // Multiple clearing methods to ensure it works
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost;";
    document.cookie = "token=; max-age=-99999999; path=/;";
    document.cookie = "token=; max-age=0; path=/;";
    console.log("Token cookie cleared");
  };
  
  // Function to get token from cookies
  const getTokenFromCookies = () => {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length, cookie.length);
      }
    }
    return null;
  };

  useEffect(() => {
    const checkAuth = () => {
      // Get token from cookies
      const tokenFromCookies = getTokenFromCookies();
      
      console.log("Auth check:", { 
        isLoggedIn, 
        reduxToken: token ? 'exists' : 'missing',
        cookieToken: tokenFromCookies ? 'exists' : 'missing'
      });

      // Check authentication status
      if (!isLoggedIn && !tokenFromCookies) {
        console.log("Not authenticated, redirecting to signin");
        
        // Clear the token cookie as a precaution
        clearTokenCookie();
        
        // Use window.location for more reliable redirection
        router.push('/signin');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [isLoggedIn, token]);

  // Function to handle sign-out that can be passed down to Dashboard
  const handleSignOut = () => {
    // Clear the token cookie
    clearTokenCookie();
    
    // Update redux state
    dispatch(signOut());
    
    // Set a flag in localStorage to sync across tabs
    localStorage.setItem('auth_signout', Date.now().toString());
    
    // Use direct location change for more reliable navigation
    router.push('/signin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  // Pass the signOut handler to Dashboard
  return <Dashboard onSignOut={handleSignOut} />;
}