import React, { useState } from 'react';

const ElectorVerification = () => {
  // Sample data
  const [electors, setElectors] = useState([
    { id: 1, name: 'John Smith', serial: 'E1001', status: 'Not Verified' },
    { id: 2, name: 'Emma Johnson', serial: 'E1002', status: 'Verified' },
    { id: 3, name: 'Michael Brown', serial: 'E1003', status: 'Not Verified' },
    { id: 4, name: 'Sarah Wilson', serial: 'E1004', status: 'Verified' },
    { id: 5, name: 'David Lee', serial: 'E1005', status: 'Not Verified' },
  ]);

  const handleVerify = (id) => {
    setElectors(electors.map(e => e.id === id ? { ...e, status: 'Verified' } : e));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Elector Verification</h2>
      <p className="mb-4">Here officers can verify electors at their assigned polling stations.</p>
      <div className="overflow-x-auto rounded-lg shadow-card bg-white">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Serial</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {electors.map(elector => (
              <tr key={elector.id}>
                <td className="px-6 py-4 whitespace-nowrap">{elector.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{elector.serial}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${elector.status === 'Verified' ? 'badge-success' : 'badge-warning'}`}>{elector.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {elector.status === 'Not Verified' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleVerify(elector.id)}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElectorVerification;
