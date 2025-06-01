import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [officerData, setOfficerData] = useState(null);
  const [stationStats, setStationStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [officerResponse, statsResponse] = await Promise.all([
          api.get(`/api/officers/profile/${user.linkedId}`),
          api.get(`/api/votes/stats/${user.pollingStationId || 1}`)
        ]);
        
        setOfficerData(officerResponse.data);
        setStationStats(statsResponse.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.linkedId) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <Loader />;

  const turnoutPercentage = stationStats?.turnoutPercentage || 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Welcome Header */}
      <Card padding="sm" className="p-4 sm:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Officer Dashboard</h1>
        <p className="text-sm sm:text-base text-indigo-100">Welcome back, {officerData?.name || 'Officer'}</p>
        <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Role: {officerData?.role || 'Officer'}
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card padding="sm" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 8h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-blue-600 truncate">
            {officerData?.PollingStation?.name || 'Not Assigned'}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Assigned Station</div>
        </Card>

        <Card padding="sm" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            {stationStats?.totalElectors || 0}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Registered Electors</div>
        </Card>

        <Card padding="sm" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-yellow-600">
            {stationStats?.totalVotes || 0}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Votes Cast</div>
        </Card>

        <Card padding="sm" className="p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-purple-600">
            {turnoutPercentage}%
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Voter Turnout</div>
        </Card>
      </div>

      {/* Turnout Progress */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Voter Turnout Progress
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
            <span>Progress: {stationStats?.totalVotes || 0} of {stationStats?.totalElectors || 0} electors</span>
            <span className="font-medium">{turnoutPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(turnoutPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </Card>

      {/* Station Information */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Station Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Station Name</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg truncate">
              {officerData?.PollingStation?.name || 'Not assigned'}
            </p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Area</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg truncate">
              {officerData?.PollingStation?.area || 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ward</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg truncate">
              {officerData?.PollingStation?.ward || 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Officer Role</label>
            <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg truncate">
              {officerData?.role || 'Officer'}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/officer/verification')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm sm:text-base">Verify Electors</span>
          </button>
          
          <button 
            onClick={() => navigate('/officer/station-details')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm sm:text-base">Station Details</span>
          </button>
          
          <button 
            onClick={() => navigate('/results')}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation sm:col-span-2 lg:col-span-1"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm sm:text-base">View Results</span>
          </button>
        </div>
      </Card>

      {/* Real-time Updates */}
      <Card padding="sm" className="p-3 sm:p-4 bg-green-50 border-green-200">
        <div className="flex flex-col sm:flex-row sm:items-center text-green-700 space-y-1 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs sm:text-sm">System is online and monitoring voting activities</span>
          </div>
          <span className="text-xs sm:ml-auto">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </Card>
    </div>
  );
};

export default OfficerDashboard;

