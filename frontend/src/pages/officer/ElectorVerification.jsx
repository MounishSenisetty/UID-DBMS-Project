import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const ElectorVerification = () => {
  const { user } = useAuth();
  const [electors, setElectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  useEffect(() => {
    const fetchElectors = async () => {
      try {
        // Get station ID from localStorage or use default
        const stationId = localStorage.getItem('stationId') || '1';
        
        // Fetch electors for this polling station
        const response = await api.get(`/api/electors/by-station/${stationId}`);
        
        // Add verification status to each elector
        const electorsWithStatus = response.data.map(elector => ({
          ...elector,
          verificationStatus: Math.random() > 0.5 ? 'Verified' : 'Not Verified'
        }));
        setElectors(electorsWithStatus);
      } catch (error) {
        console.error('Error fetching electors:', error);
        
        // Provide fallback mock data when API fails
        const mockElectors = [
          {
            serialNumber: '12345001',
            name: 'John Smith',
            pollingStationId: 1,
            verificationStatus: 'Not Verified'
          },
          {
            serialNumber: '12345002',
            name: 'Sarah Johnson',
            pollingStationId: 1,
            verificationStatus: 'Verified'
          },
          {
            serialNumber: '12345003',
            name: 'Michael Brown',
            pollingStationId: 1,
            verificationStatus: 'Not Verified'
          },
          {
            serialNumber: '12345004',
            name: 'Emily Davis',
            pollingStationId: 1,
            verificationStatus: 'Rejected'
          },
          {
            serialNumber: '12345005',
            name: 'David Wilson',
            pollingStationId: 1,
            verificationStatus: 'Not Verified'
          },
          {
            serialNumber: '12345006',
            name: 'Lisa Anderson',
            pollingStationId: 1,
            verificationStatus: 'Verified'
          },
          {
            serialNumber: '12345007',
            name: 'Robert Taylor',
            pollingStationId: 1,
            verificationStatus: 'Not Verified'
          },
          {
            serialNumber: '12345008',
            name: 'Jennifer Martinez',
            pollingStationId: 1,
            verificationStatus: 'Verified'
          }
        ];
        
        setElectors(mockElectors);
        toast.info('Using demo data - Backend connection unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchElectors();
  }, [user]);

  const handleVerify = (electorId) => {
    setElectors(electors.map(elector => 
      elector.serialNumber === electorId 
        ? { ...elector, verificationStatus: 'Verified' } 
        : elector
    ));
    toast.success('Elector verified successfully');
  };

  const handleReject = (electorId) => {
    setElectors(electors.map(elector => 
      elector.serialNumber === electorId 
        ? { ...elector, verificationStatus: 'Rejected' } 
        : elector
    ));
    toast.warn('Elector verification rejected');
  };

  const filteredElectors = electors.filter(elector => {
    const matchesSearch = elector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elector.serialNumber.toString().includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || elector.verificationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: electors.length,
    verified: electors.filter(e => e.verificationStatus === 'Verified').length,
    pending: electors.filter(e => e.verificationStatus === 'Not Verified').length,
    rejected: electors.filter(e => e.verificationStatus === 'Rejected').length
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Elector Verification</h1>
        <p className="text-green-100">Verify electors at your assigned polling station</p>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600">Total Electors</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-gray-600">Verified</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-gray-600">Pending</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-gray-600">Rejected</div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Electors</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or serial number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Not Verified">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Electors Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Elector List ({filteredElectors.length} of {electors.length})
        </h2>
        
        {filteredElectors.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500">No electors found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredElectors.map(elector => (
                  <tr key={elector.serialNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {elector.serialNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {elector.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {elector.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${elector.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                          elector.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {elector.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {elector.verificationStatus === 'Not Verified' && (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleVerify(elector.serialNumber)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleReject(elector.serialNumber)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {elector.verificationStatus === 'Verified' && (
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      )}
                      {elector.verificationStatus === 'Rejected' && (
                        <span className="text-red-600 font-medium">✗ Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Verification Guidelines</h3>
        <ul className="space-y-2 text-blue-700 text-sm">
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify identity documents before approving any elector
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cross-check name and serial number with official records
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contact supervisor if you encounter any discrepancies
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Maintain accurate records of all verification activities
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default ElectorVerification;
