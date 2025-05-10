"use client";

import Dashboard from '@/components/Dashboard';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign in page if not logged in
    if (!isLoggedIn) {
      router.push('/signin');
    }
  }, [isLoggedIn, router]);

  return isLoggedIn ? <Dashboard /> : null;
}