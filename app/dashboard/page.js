"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  const { isLoggedIn, token } = useSelector(state => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Function to get token from cookies
      const getTokenFromCookies = () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('token=')) {
            return cookie.substring('token='.length, cookie.length);
          }
        }
        return null;
      };

      // Check if user is logged in via Redux state or cookie
      const tokenFromCookies = getTokenFromCookies();
      
      console.log("Auth check:", { 
        isLoggedIn, 
        reduxToken: token ? 'exists' : 'missing',
        cookieToken: tokenFromCookies ? 'exists' : 'missing'
      });

      if (!isLoggedIn && !tokenFromCookies) {
        console.log("Not authenticated, redirecting to signin");
        router.push('/signin');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [isLoggedIn, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return <Dashboard />;
}