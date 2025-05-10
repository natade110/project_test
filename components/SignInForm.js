// components/SignInForm.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn, setAuthLoading, setAuthError } from '@/redux/features/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password complexity
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least 1 lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least 1 number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least 1 special character';
    }
    return '';
  };

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Email validation
    if (!email.trim()) {
      setEmailError('Invalid username');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      
      setPasswordError('Invalid password 22');
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        dispatch(setAuthLoading(true));
        
        // Call the sign-in API endpoint
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        console.log('Sign-in response:', data);

        if (response.ok && data.token) {
          // Set token in cookies directly
          document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`;
          
          // Update Redux state with token and user info
          dispatch(signIn({
            token: data.token,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName
          }));
          
          // Navigate to landing page
          router.push('/dashboard');
        } else {
          // Handle error
          if (data.error === 'Invalid email or password') {
            // Check if email format is valid before showing error
            if (isValidEmail(email)) {
              // If email is valid format, just show password error
              setPasswordError('Invalid password');
            } else {
              // If email format is invalid, show both errors
              setEmailError('Invalid username');
              setPasswordError('Invalid password');
            }
          } else {
            // For other server errors
            setEmailError(data.error || 'Sign in failed');
          }
          dispatch(setAuthError(data.error || 'Sign in failed'));
        }
      } catch (error) {
        console.error('Sign in error:', error);
        setEmailError('Sign in failed. Please try again.');
        dispatch(setAuthError('Sign in failed'));
      } finally {
        setIsSubmitting(false);
        dispatch(setAuthLoading(false));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-custom">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back!</h1>
        <h2 className="text-lg text-center mb-8 text-gray">Sign in to your account to continue</h2>
        
        <form onSubmit={handleSignIn}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-bold mb-1">Email <span className="text-secondary">*</span></label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={emailError ? 'error' : ''}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="mt-1 text-secondary text-sm">{emailError}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-1">Password <span className="text-secondary">*</span></label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className={passwordError ? 'error' : ''}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="mt-1 text-secondary text-sm">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/signup" className="text-primary">
            New User? Sign up!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;