import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

        // First Name validation
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
          isValid = false;
        }
    
        // Last Name validation
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
          isValid = false;
        }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Invalid username';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Invalid password';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 lowercase letter';
      isValid = false;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 number';
      isValid = false;
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 special character';
      isValid = false;
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Invalid confirm password';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Call the sign-up API endpoint
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Show user input in console
          console.log({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: '********' // Don't log actual password
          });
          
          // Navigate to sign in page after successful signup
          router.push('/signin');
        } else {
          // Handle error
          if (data.error === 'Email already exists') {
            setErrors({
              ...errors,
              email: 'Email already exists'
            });
          } else {
            alert(data.error || 'Sign up failed');
          }
        }
      } catch (error) {
        console.error('Sign up error:', error);
        alert('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-custom">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                className={errors.firstName ? 'error' : ''}
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="mt-1 text-secondary text-sm">{errors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                className={errors.lastName ? 'error' : ''}
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="mt-1 text-secondary text-sm">{errors.lastName}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-1">Email <span className="text-secondary">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className={errors.email ? 'error' : ''}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="mt-1 text-secondary text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold mb-1">Password <span className="text-secondary">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className={errors.password ? 'error' : ''}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-1 text-secondary text-sm">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-bold mb-1">Confirm Password <span className="text-secondary">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={errors.confirmPassword ? 'error' : ''}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="mt-1 text-secondary text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/signin" className="text-primary">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;