import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const ElectorProfile = () => {
  const { user } = useAuth();
  const [electorData, setElectorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);  const [editFormData, setEditFormData] = useState({});
  useEffect(() => {
    const fetchElectorData = async () => {
      try {
        setLoading(true);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await api.get(`/api/electors/profile/${user.linkedId}`, { signal: controller.signal });
        
        clearTimeout(timeoutId);
        
        setElectorData(response.data);
        setEditFormData({ name: response.data.name });
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          toast.error('Request timed out. Please check your connection.');
        } else {
          console.error('Error loading profile data:', error);
          toast.error('Failed to load profile data');
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

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/api/electors/profile/${user.linkedId}`, editFormData)
      setElectorData(response.data)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (loading) return <Loader />;
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Profile Header */}
      <Card padding="sm" className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-white">
                {electorData?.name?.charAt(0) || 'E'}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {electorData?.name || 'Elector Name'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                Serial Number: {electorData?.serialNumber || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </Card>      {/* Personal Information */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 font-mono text-sm sm:text-base">{electorData?.serialNumber || 'N/A'}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>            
            {isEditing ? (
              <input 
                type="text" 
                className="w-full p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900 text-sm sm:text-base">{electorData?.name || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>
      </Card>      {/* Polling Station Information */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Polling Station Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Station Name</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 text-sm sm:text-base">{electorData?.PollingStation?.name || 'Not assigned'}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 text-sm sm:text-base">{electorData?.PollingStation?.area || 'N/A'}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Ward</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 text-sm sm:text-base">{electorData?.PollingStation?.ward || 'N/A'}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Station ID</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 font-mono text-sm sm:text-base">{electorData?.pollingStationId || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card padding="sm" className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Account Settings
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </button>
          
          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Download Profile Data
          </button>
        </div>
      </Card>

      {isEditing && (
        <Card padding="sm" className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>            
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ElectorProfile;
