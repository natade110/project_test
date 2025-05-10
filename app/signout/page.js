// app/signout/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForceSignOut() {
  const router = useRouter();
  
  useEffect(() => {
    // Force clear all auth data
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; SameSite=Strict";
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = '/signin';
    }, 500);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Signing out...</h1>
      <div className="loader"></div>
    </div>
  );
}