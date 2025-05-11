import React from 'react';

const OfficerDashboard = () => {
  // Sample data
  const assignedStation = 'Central Community Center';
  const pendingVerifications = 12;
  const todaysVoters = 87;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Officer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="text-sm text-neutral-500 mb-1">Assigned Station</div>
          <div className="text-xl font-bold text-primary-700">{assignedStation}</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="text-sm text-neutral-500 mb-1">Pending Verifications</div>
          <div className="text-xl font-bold text-warning-600">{pendingVerifications}</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="text-sm text-neutral-500 mb-1">Today's Voters</div>
          <div className="text-xl font-bold text-success-600">{todaysVoters}</div>
        </div>
      </div>
      <p>Welcome to the Officer Dashboard. Here you can view your assignments and monitor the voting process.</p>
      {/* Additional dashboard content and stats can be added here */}
    </div>
  );
};

export default OfficerDashboard;
