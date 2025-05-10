// components/Dashboard.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewActivity } from '@/redux/features/activitySlice';

const Dashboard = ({ onSignOut }) => {
  const dispatch = useDispatch();
  const { activity, loading, error } = useSelector(state => state.activity);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Fetch initial activity on mount
    handleGetNewActivity();
  }, []);

  const handleGetNewActivity = () => {
    dispatch(fetchNewActivity());
  };

  // Use the provided signOut handler from parent
  const handleSignOut = () => {
    if (typeof onSignOut === 'function') {
      onSignOut();
    } else {
      clearAuthCookies();
      window.location.href = '/signin';
    }
  };

  // Function to properly clear auth cookies
  const clearAuthCookies = () => {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "token=; path=/; domain=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict;";
        document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict;";
        document.cookie = "token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax;";
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict;";
        document.cookie = "token=; path=/; max-age=0;";
        document.cookie = "token=; path=/; domain=localhost; max-age=0;";
        
        console.log("Token cookie cleared with multiple approaches");
        break;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-custom p-6">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">Landing Page</h1>
          <h2 className="text-lg text-gray">Let's find something to do!</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="text-center text-secondary py-4">
            <p>Error: {error}</p>
            <button 
              onClick={handleGetNewActivity}
              className="mt-4 bg-primary text-white py-2 px-4 rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : activity ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
            <div style={{ paddingTop: '15px' }}>
              <h3 className="text-sm font-bold text-gray">Activity:</h3>
              <p>{activity.activity}</p>
            </div>
            <div style={{ paddingTop: '15px' }}>
              <h3 className="text-sm font-bold text-gray">Type:</h3>
              <p>{activity.type}</p>
            </div>
            <div style={{ paddingTop: '15px' }}>
              <h3 className="text-sm font-bold text-gray">Participant:</h3>
              <p>{activity.participants}</p>
            </div>
            <div style={{ paddingTop: '15px' }}>
              <h3 className="text-sm font-bold text-gray">Budget:</h3>
              <p>${activity.price || '0.00'}</p>
            </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray py-6">No activity found. Try getting a new one!</p>
        )}

        <button
          onClick={handleGetNewActivity}
          className="w-full bg-primary text-white py-3 px-4 rounded-full text-lg mb-4"
          style={{ boxShadow: 'none' }}
          disabled={loading}
        >
          Get New Activity
        </button>

        <div className="text-center">
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              boxShadow: 'none',
              border: 'none',
              color: 'red',
              padding: '5px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
