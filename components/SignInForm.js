import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '@/redux/features/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError('Invalid username');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (password.length < 6 || !/\d/.test(password) || 
        !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !password.trim()) {
      setPasswordError('Invalid password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Call the sign-in API endpoint
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in cookies
          document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`; // 1 day
          
          // Update Redux state
          dispatch(signIn({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            token: data.token
          }));
          
          // Navigate to landing page
          router.push('/dashboard');
        } else {
          // Handle error
          if (data.error === 'Invalid email') {
            setEmailError('Invalid username');
          } else if (data.error === 'Invalid password') {
            setPasswordError('Invalid password');
          } else {
            setEmailError(data.error || 'Sign in failed');
          }
        }
      } catch (error) {
        console.error('Sign in error:', error);
        setEmailError('Sign in failed. Please try again.');
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
            <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
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
            <label htmlFor="password" className="block text-sm font-bold mb-1">Password</label>
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
          >
            Sign In
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