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
    // Fetch initial activity when component mounts
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
            <h1 className="text-3xl font-bold text-[#212433]">Landing Page</h1>
            <h2 className="text-xl text-gray-600">Let's find something to do!</h2>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-[#DA0B62] text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : activity ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Activity Name</h3>
                  <p className="text-lg text-[#212433]">{activity.activity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Type</h3>
                  <p className="text-lg text-[#212433]">{activity.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Participants</h3>
                  <p className="text-lg text-[#212433]">{activity.participants}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Budget in USD</h3>
                  <p className="text-lg text-[#212433]">${activity.price || '0'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No activity found. Try getting a new one!</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGetNewActivity}
            className="bg-[#0BDAA5] text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-colors text-lg"
          >
            Get New Activity
          </button>
        </div>
      </div>

      <style jsx>{`
        .loader {
          border-top-color: #0BDAA5;
          animation: spinner 1s linear infinite;
        }
        
        @keyframes spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;