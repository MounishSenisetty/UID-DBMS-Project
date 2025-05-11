import React from 'react';

const StationDetails = () => {
  // Sample data
  const station = {
    name: 'Central Community Center',
    address: '123 Main St, Springfield',
    capacity: 1200,
    status: 'Active',
  };
  const officers = [
    { id: 1, name: 'James Wilson', role: 'Station Manager' },
    { id: 2, name: 'Sarah Johnson', role: 'Verification Officer' },
    { id: 3, name: 'Michael Brown', role: 'Verification Officer' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Polling Station Details</h2>
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <div className="mb-2"><span className="font-medium">Name:</span> {station.name}</div>
        <div className="mb-2"><span className="font-medium">Address:</span> {station.address}</div>
        <div className="mb-2"><span className="font-medium">Capacity:</span> {station.capacity}</div>
        <div className="mb-2"><span className="font-medium">Status:</span> <span className={`badge ${station.status === 'Active' ? 'badge-success' : 'badge-error'}`}>{station.status}</span></div>
      </div>
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">Assigned Officers</h3>
        <ul className="space-y-2">
          {officers.map(officer => (
            <li key={officer.id} className="flex items-center">
              <span className="font-medium mr-2">{officer.name}</span>
              <span className="badge badge-secondary">{officer.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StationDetails;
