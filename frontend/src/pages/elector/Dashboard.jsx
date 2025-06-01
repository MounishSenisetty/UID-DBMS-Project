import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const ElectorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [electorData, setElectorData] = useState(null);
  const [voteStatus, setVoteStatus] = useState(false);
  const [loading, setLoading] = useState(true);  useEffect(() => {
    const fetchElectorData = async () => {      try {
        setLoading(true);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const [profileResponse, voteStatusResponse] = await Promise.all([
          api.get(`/api/electors/profile/${user.linkedId}`, { signal: controller.signal }),
          api.get(`/api/electors/vote-status/${user.linkedId}`, { signal: controller.signal })
        ]);
        
        clearTimeout(timeoutId);
        
        setElectorData(profileResponse.data);
        setVoteStatus(voteStatusResponse.data.hasVoted);
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          toast.error('Request timed out. Please check your connection.');
        } else {
          console.error('Error fetching elector data:', error);
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.linkedId) {
      fetchElectorData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <Loader />;
  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome, {electorData?.name || 'Elector'}!</h1>
        <p className="text-sm sm:text-base text-blue-100">Your gateway to democratic participation</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card padding="sm" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Registration Status</h3>
          <p className="text-sm sm:text-base text-green-600 font-medium">Verified</p>
        </Card>

        <Card padding="sm" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Polling Station</h3>
          <p className="text-sm sm:text-base text-gray-600 truncate">{electorData?.PollingStation?.name || 'Not assigned'}</p>
        </Card>

        <Card padding="sm" className="p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${voteStatus ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
            <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${voteStatus ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Voting Status</h3>
          <p className={`text-sm sm:text-base font-medium ${voteStatus ? 'text-green-600' : 'text-yellow-600'}`}>
            {voteStatus ? 'Vote Cast' : 'Not Voted'}
          </p>
        </Card>
      </div>

      {/* Personal Information */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded">{electorData?.serialNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded truncate">{electorData?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Polling Station</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded truncate">{electorData?.PollingStation?.name || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Area</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded truncate">{electorData?.PollingStation?.area || 'N/A'}</p>
          </div>
        </div>
      </Card>      {/* Quick Actions */}
      {!voteStatus && (
        <Card padding="sm" className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={() => navigate('/elector/voting')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm sm:text-base">Cast Your Vote</span>
            </button>
            <button 
              onClick={() => navigate('/elector/results')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm sm:text-base">View Results</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ElectorDashboard;
