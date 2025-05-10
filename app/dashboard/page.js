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
  
  // Function to handle sign-out using both the API and client-side cookie clearing
  const handleSignOut = async () => {
    try {
      // Clear cookies on client side
      const clearTokenCookie = () => {
        // Clear with all possible parameters to ensure it's removed
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "token=; path=/; max-age=0;";
        document.cookie = "token=; path=/; domain=localhost; max-age=0;";
        document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict;";
        console.log("Token cookie cleared on client side");
      };
      
      // First, call our API endpoint to clear HTTP-only cookies
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include' // Important for cookie operations
      });
      
      if (!response.ok) {
        console.error('Error signing out via API');
      } else {
        console.log('API signout successful');
      }
      
      // Always clear cookies on client side as a backup
      clearTokenCookie();
      
      // Update redux state
      dispatch(signOut());
      
      // Set a flag in localStorage to sync across tabs
      localStorage.setItem('auth_signout', Date.now().toString());
      
      // Force reload the application to ensure clean state
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      } else {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, attempt to redirect
      router.push('/signin');
    }
  };
  
  useEffect(() => {
    const checkAuth = () => {
      // Check authentication status
      if (!isLoggedIn && !document.cookie.includes('token=')) {
        console.log("Not authenticated, redirecting to signin");
        router.push('/signin');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
    
    // Listen for storage events to sync logout across tabs
    const handleStorageChange = (event) => {
      if (event.key === 'auth_signout') {
        router.push('/signin');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, token, router]);

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