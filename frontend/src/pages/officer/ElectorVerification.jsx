import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAssignedElectors, verifyElector } from '../../services/api';
import Loader from '../../components/common/Loader';

const ElectorVerification = () => {
  const [electors, setElectors] = useState([]);
  const [filteredElectors, setFilteredElectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchElectors();
  }, []);

  const fetchElectors = async () => {
    setLoading(true);
    try {
      const data = await getAssignedElectors();
      setElectors(data);
      setFilteredElectors(data);
    } catch {
      toast.error('Failed to fetch electors');
    } finally {
      setLoading(false);
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

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Elector Verification</h2>
      <input
        type="text"
        placeholder="Search by serial number or name"
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
              <th className="px-4 py-2 border-b border-gray-300 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredElectors.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">No electors found.</td>
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
                    {!elector.verified && (
                      <button
                        onClick={() => handleVerify(elector.id)}
                        disabled={updatingId === elector.id}
                        className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
                      >
                        {updatingId === elector.id ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElectorVerification;
