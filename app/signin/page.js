// app/signin/page.js
"use client";

import SignInForm from '@/components/SignInForm';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/redux/features/authSlice';

export default function SignInPage() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Clean up any stale tokens on signin page load
    if (typeof window !== 'undefined') {
      // Clean up browser storage on page load
      const cleanupToken = () => {
        // This helps ensure the user starts fresh when landing on the sign-in page
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; SameSite=Strict";
      };
      
      cleanupToken();
      dispatch(checkAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  return <SignInForm />;
}