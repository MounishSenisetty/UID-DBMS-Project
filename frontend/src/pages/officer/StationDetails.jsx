import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const StationDetails = () => {
  const [stationData, setStationData] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStationDetails();
    fetchStationStats();
    const interval = setInterval(() => {
      fetchStationStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchStationDetails = async () => {
    try {
      const stationId = localStorage.getItem('stationId') || '1';
      
      // Fetch station info
      const stationResponse = await fetch(`/api/polling-stations/${stationId}`);
      if (stationResponse.ok) {
        const station = await stationResponse.json();
        setStationData(station);
      }

      // Fetch assigned officers
      const officersResponse = await fetch(`/api/officers/by-station/${stationId}`);
      if (officersResponse.ok) {
        const officersData = await officersResponse.json();
        setOfficers(officersData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching station details:', error);
      toast.error('Failed to load station details');
      setLoading(false);
    }
  };

  const fetchStationStats = async () => {
    try {
      const stationId = localStorage.getItem('stationId') || '1';
      const response = await fetch(`/api/votes/stats/${stationId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching station stats:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const defaultStation = {
    id: 1,
    name: 'Central Community Center',
    address: '123 Main St, Springfield',
    capacity: 1200,
    status: 'Active',
    constituencyName: 'Springfield Central'
  };

  const station = stationData || defaultStation;
  const turnoutPercentage = stats ? (stats.totalVotes / station.capacity * 100).toFixed(1) : 0;
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Polling Station Details</h1>
        <p className="text-blue-100 text-sm sm:text-base">Comprehensive overview of your polling station</p>
      </div>

      {/* Tab Navigation */}
      <Card>
        {/* Mobile Dropdown Navigation */}
        <div className="sm:hidden border-b border-gray-200 p-4">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'officers', label: 'Officers', icon: '👥' },
              { id: 'statistics', label: 'Statistics', icon: '📈' },
              { id: 'voters', label: 'Voter Management', icon: '🗳️' }
            ].map(tab => (
              <option key={tab.id} value={tab.id}>
                {tab.icon} {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden sm:flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'officers', label: 'Officers', icon: '👥' },
            { id: 'statistics', label: 'Statistics', icon: '📈' },
            { id: 'voters', label: 'Voter Management', icon: '🗳️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 lg:px-6 py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm">Station ID</p>
                      <p className="text-xl sm:text-2xl font-bold">{station.id}</p>
                    </div>
                    <div className="text-2xl sm:text-3xl">🏢</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs sm:text-sm">Capacity</p>
                      <p className="text-xl sm:text-2xl font-bold">{station.capacity}</p>
                    </div>
                    <div className="text-2xl sm:text-3xl">👥</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs sm:text-sm">Turnout</p>
                      <p className="text-xl sm:text-2xl font-bold">{turnoutPercentage}%</p>
                    </div>
                    <div className="text-2xl sm:text-3xl">📊</div>
                  </div>
                </div>

                <div className={`bg-gradient-to-r rounded-lg p-3 sm:p-4 text-white ${
                  station.status === 'Active' 
                    ? 'from-emerald-500 to-emerald-600' 
                    : 'from-red-500 to-red-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs sm:text-sm ${station.status === 'Active' ? 'text-emerald-100' : 'text-red-100'}`}>Status</p>
                      <p className="text-xl sm:text-2xl font-bold">{station.status}</p>
                    </div>
                    <div className="text-2xl sm:text-3xl">{station.status === 'Active' ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>

              <Card>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2 text-lg sm:text-xl">📍</span>
                  Station Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Station Name</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">{station.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm sm:text-base text-gray-700 break-words">{station.address}</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Constituency</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">{station.constituencyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Capacity</label>
                      <p className="text-sm sm:text-base text-gray-700">{station.capacity} voters</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}          {activeTab === 'officers' && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                <span className="mr-2 text-lg sm:text-xl">👥</span>
                Assigned Officers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {officers.length > 0 ? officers.map(officer => (
                  <Card key={officer.id} className="hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto mb-3">
                        {officer.name?.charAt(0) || 'O'}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{officer.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">{officer.role}</p>
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        officer.role === 'Station Manager' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {officer.role}
                      </span>
                    </div>
                  </Card>
                )) : (
                  // Default officers if none loaded
                  [
                    { id: 1, name: 'James Wilson', role: 'Station Manager' },
                    { id: 2, name: 'Sarah Johnson', role: 'Verification Officer' },
                    { id: 3, name: 'Michael Brown', role: 'Verification Officer' }
                  ].map(officer => (
                    <Card key={officer.id} className="hover:shadow-lg transition-shadow">
                      <div className="text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto mb-3">
                          {officer.name.charAt(0)}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{officer.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">{officer.role}</p>
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          officer.role === 'Station Manager' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {officer.role}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}          {activeTab === 'statistics' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                <span className="mr-2 text-lg sm:text-xl">📈</span>
                Voting Statistics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Card className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-2">🗳️</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalVotes || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Total Votes Cast</div>
                </Card>

                <Card className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-2">⏰</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.hourlyRate || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Votes This Hour</div>
                </Card>

                <Card className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl mb-2">👥</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{station.capacity - (stats?.totalVotes || 0)}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Remaining Voters</div>
                </Card>
              </div>

              <Card>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Turnout Progress</h4>
                <div className="mb-2 flex justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Voting Progress</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{turnoutPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 sm:h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(turnoutPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {stats?.totalVotes || 0} out of {station.capacity} voters have cast their votes
                </p>
              </Card>
            </div>
          )}          {activeTab === 'voters' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                <span className="mr-2 text-lg sm:text-xl">🗳️</span>
                Voter Management
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Verify Voters</h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">Check voter eligibility and mark attendance</p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]">
                    Go to Verification
                  </button>
                </Card>

                <Card className="text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📋</div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Voter List</h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">View all registered voters for this station</p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]">
                    View Voter List
                  </button>
                </Card>
              </div>

              <Card>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Quick Actions</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] sm:min-h-[100px]">
                    <span className="text-xl sm:text-2xl mb-1 sm:mb-2">📊</span>
                    <span className="text-xs sm:text-sm font-medium text-center">Generate Report</span>
                  </button>
                  <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] sm:min-h-[100px]">
                    <span className="text-xl sm:text-2xl mb-1 sm:mb-2">🔄</span>
                    <span className="text-xs sm:text-sm font-medium text-center">Refresh Data</span>
                  </button>
                  <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] sm:min-h-[100px]">
                    <span className="text-xl sm:text-2xl mb-1 sm:mb-2">📤</span>
                    <span className="text-xs sm:text-sm font-medium text-center">Export Data</span>
                  </button>
                  <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[80px] sm:min-h-[100px]">
                    <span className="text-xl sm:text-2xl mb-1 sm:mb-2">🆘</span>
                    <span className="text-xs sm:text-sm font-medium text-center">Emergency</span>
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StationDetails;
