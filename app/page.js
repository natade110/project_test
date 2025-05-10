import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect based on authentication status
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  }, [isLoggedIn, router]);

  return null; // No content needed as we're redirecting
}