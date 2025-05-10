// components/Dashboard.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewActivity } from '@/redux/features/activitySlice';
import { signOut } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activity, loading } = useSelector(state => state.activity);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Fetch initial activity on mount
    handleGetNewActivity();
  }, []);

  const handleGetNewActivity = () => {
    dispatch(fetchNewActivity());
  };

  const handleSignOut = () => {
    // Clear token from cookies
    document.cookie = 'token=; path=/; max-age=0';
    
    // Update Redux state
    dispatch(signOut());
    
    // Navigate to sign in page
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Landing Page</h1>
            <h2 className="text-xl text-gray">Let's find something to do!</h2>
            {user && (
              <p className="text-sm text-gray mt-2">
                Welcome, {user.firstName} {user.lastName}!
              </p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="bg-secondary text-white py-2 px-6 rounded-md"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-custom p-8 mb-8">
          {loading ? (
            <div className="flex justify-center items-center" style={{height: "10rem"}}>
              <div className="loader"></div>
            </div>
          ) : activity ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-gray mb-1">Activity Name</h3>
                <p className="text-lg">{activity.activity}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray mb-1">Type</h3>
                <p className="text-lg">{activity.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray mb-1">Participants</h3>
                <p className="text-lg">{activity.participants}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray mb-1">Budget in USD</h3>
                <p className="text-lg">${activity.price || '0'}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray py-10">No activity found. Try getting a new one!</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGetNewActivity}
            className="bg-primary text-white py-3 px-8 rounded-md text-lg"
          >
            Get New Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;