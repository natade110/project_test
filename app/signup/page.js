"use client";

import SignUpForm from '@/components/SignUpForm';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  return <SignUpForm />;
}