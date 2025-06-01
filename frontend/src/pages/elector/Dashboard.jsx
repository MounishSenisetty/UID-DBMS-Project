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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectorData = async () => {
      try {
        const [profileResponse, voteStatusResponse] = await Promise.all([
          api.get(`/api/electors/profile/${user.linkedId}`),
          api.get(`/api/electors/vote-status/${user.linkedId}`)
        ]);
        
        setElectorData(profileResponse.data);
        setVoteStatus(voteStatusResponse.data.hasVoted);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.linkedId) {
      fetchElectorData();
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {electorData?.name || 'Elector'}!</h1>
        <p className="text-blue-100">Your gateway to democratic participation</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Registration Status</h3>
          <p className="text-green-600 font-medium">Verified</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Polling Station</h3>
          <p className="text-gray-600">{electorData?.PollingStation?.name || 'Not assigned'}</p>
        </Card>

        <Card className="p-6 text-center">
          <div className={`w-12 h-12 ${voteStatus ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <svg className={`w-6 h-6 ${voteStatus ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Voting Status</h3>
          <p className={`font-medium ${voteStatus ? 'text-green-600' : 'text-yellow-600'}`}>
            {voteStatus ? 'Vote Cast' : 'Not Voted'}
          </p>
        </Card>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{electorData?.serialNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{electorData?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Polling Station</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{electorData?.PollingStation?.name || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{electorData?.PollingStation?.area || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {!voteStatus && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">            <button 
              onClick={() => navigate('/elector/voting')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Cast Your Vote
            </button>
            <button 
              onClick={() => navigate('/elector/results')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Results
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ElectorDashboard;
