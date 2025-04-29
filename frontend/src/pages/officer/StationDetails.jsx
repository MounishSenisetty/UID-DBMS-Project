import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAssignedPollingStations, getAssignedElectors, verifyElector, voteForElector } from '../../services/api';
import Loader from '../../components/common/Loader';

const StationDetails = () => {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [electors, setElectors] = useState([]);
  const [loadingElectors, setLoadingElectors] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredElectors, setFilteredElectors] = useState([]);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStationId !== null) {
      fetchElectors(selectedStationId);
    }
  }, [selectedStationId]);

  const fetchStations = async () => {
    setLoadingStations(true);
    try {
      const data = await getAssignedPollingStations();
      setStations(data);
      if (data.length > 0) {
        setSelectedStationId(data[0].id);
      }
    } catch {
      toast.error('Failed to fetch polling stations');
    } finally {
      setLoadingStations(false);
    }
  };

  const fetchElectors = async (stationId) => {
    setLoadingElectors(true);
    try {
      // Since no backend route for electors by polling station, fetch all assigned electors and filter client-side
      const data = await getAssignedElectors();
      const filtered = data.filter(elector => elector.pollingStationId === stationId);
      setElectors(filtered);
      setFilteredElectors(filtered);
      setSearchTerm('');
    } catch {
      toast.error('Failed to fetch electors');
    } finally {
      setLoadingElectors(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setFilteredElectors(electors);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = electors.filter(
      (elector) =>
        elector.serialNumber?.toString().includes(lowerTerm) ||
        elector.name?.toLowerCase().includes(lowerTerm)
    );
    setFilteredElectors(filtered);
  };

  const handleVerify = async (electorId) => {
    setUpdatingId(electorId);
    try {
      await verifyElector(electorId);
      toast.success('Elector verified successfully');
      const updatedElectors = electors.map((elector) =>
        elector.id === electorId ? { ...elector, verified: true } : elector
      );
      setElectors(updatedElectors);
      setFilteredElectors(updatedElectors.filter(elector =>
        elector.serialNumber?.toString().includes(searchTerm.toLowerCase()) ||
        elector.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch {
      toast.error('Failed to verify elector');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVote = async (electorId) => {
    setUpdatingId(electorId);
    try {
      // For voting, candidateId is required, but UI does not provide candidate selection, so this is a placeholder
      const candidateId = 1; // TODO: Replace with actual candidate selection
      await voteForElector(electorId, candidateId);
      toast.success('Vote recorded successfully');
      const updatedElectors = electors.map((elector) =>
        elector.id === electorId ? { ...elector, voted: true } : elector
      );
      setElectors(updatedElectors);
      setFilteredElectors(updatedElectors.filter(elector =>
        elector.serialNumber?.toString().includes(searchTerm.toLowerCase()) ||
        elector.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch {
      toast.error('Failed to record vote');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loadingStations) return <Loader fullScreen />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Polling Station Details</h2>
      <div className="mb-4">
        <label htmlFor="station-select" className="block mb-2 font-medium">Select Polling Station:</label>
        <select
          id="station-select"
          value={selectedStationId || ''}
          onChange={(e) => setSelectedStationId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name} - {station.area || station.ward || ''}
            </option>
          ))}
        </select>
      </div>

      {loadingElectors ? (
        <Loader fullScreen />
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">Electors</h3>
          <input
            type="text"
            placeholder="Search electors by serial number or name"
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b border-gray-300 text-left">Serial Number</th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">Name</th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">Verification Status</th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">Voting Status</th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredElectors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">No electors found.</td>
                  </tr>
                ) : (
                  filteredElectors.map((elector) => (
                    <tr
                      key={elector.id}
                      className={elector.verified ? 'bg-green-100' : ''}
                    >
                      <td className="px-4 py-2 border-b border-gray-300">{elector.serialNumber}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{elector.name}</td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {elector.verified ? (
                          <span className="text-green-600 font-semibold">Verified &#10003;</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Not Verified</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {elector.voted ? (
                          <span className="text-green-600 font-semibold">Voted &#10003;</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Not Voted</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300 space-x-2">
                        {!elector.verified && (
                          <button
                            onClick={() => handleVerify(elector.id)}
                            disabled={updatingId === elector.id}
                            className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
                          >
                            {updatingId === elector.id ? 'Verifying...' : 'Verify'}
                          </button>
                        )}
                        {!elector.voted && (
                          <button
                            onClick={() => handleVote(elector.id)}
                            disabled={updatingId === elector.id}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updatingId === elector.id ? 'Voting...' : 'Vote'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StationDetails;
