import React, { useEffect, useState } from 'react';
import { getElectorProfile } from '../../services/api';

const ElectorDashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getElectorProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch elector profile:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Elector Dashboard</h2>
      <p>Welcome, {profile.name}!</p>
      <p>Polling Station: {profile.PollingStation?.name || 'N/A'}</p>
      <p>Constituency: {profile.PollingStation?.Constituency?.name || 'N/A'}</p>
      <p>Voting Status: {profile.voted ? 'Voted' : 'Not Voted'}</p>
      {/* Additional dashboard content and stats can be added here */}
    </div>
  );
};

export default ElectorDashboard;
