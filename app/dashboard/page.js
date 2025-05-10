"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { signOut, checkAuth } from '@/redux/features/authSlice';

export default function DashboardPage() {
  const { isLoggedIn, token, loading: authLoading } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to handle sign-out using both the API and client-side cookie clearing
  const handleSignOut = async () => {
    try {
      // Clear cookies on client side
      const clearTokenCookie = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "token=; path=/; max-age=0;";
      };
      
      // First, call our API endpoint to clear HTTP-only cookies
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Always clear cookies on client side as a backup
      clearTokenCookie();
      
      // Update redux state
      dispatch(signOut());
      
      // Set a flag in localStorage to sync across tabs
      localStorage.setItem('auth_signout', Date.now().toString());
      
      // Force reload the application to ensure clean state
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, attempt to redirect
      router.push('/signin');
    }
  };
  
  useEffect(() => {
    // Important: This will check auth status on mount and after refresh
    dispatch(checkAuth());

    // Set a timeout to prevent infinite loading state
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds timeout as fallback
    
    return () => clearTimeout(timeout);
  }, [dispatch]);
  
  // This effect runs when auth state changes
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        // If auth check is complete and user is not logged in, redirect
        router.push('/signin');
      } else {
        // Auth check is complete and user is logged in
        setIsLoading(false);
      }
    }
  }, [isLoggedIn, authLoading, router]);

  // If still loading, show loading spinner
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