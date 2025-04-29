import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getAssignedPollingStations } from '../../services/api';

const OfficerDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [votingStatus, setVotingStatus] = useState({ totalElectors: 0, votesCast: 0 });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const stations = await getAssignedPollingStations();
        setAssignments(stations);
        // TODO: Fetch voting status from backend if available
        // For now, set dummy voting status based on fetched stations
        let totalElectors = 0;
        stations.forEach(station => {
          if (station.electorsCount) {
            totalElectors += station.electorsCount;
          }
        });
        setVotingStatus({ totalElectors, votesCast: 0 }); // votesCast to be fetched from backend if possible
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Officer Dashboard</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Assignments</h3>
        <ul className="list-disc list-inside">
          {assignments.map((assignment) => (
            <li key={assignment.id}>{assignment.name}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Voting Status</h3>
        <p>Total Electors: {votingStatus.totalElectors}</p>
        <p>Votes Cast: {votingStatus.votesCast}</p>
        <p>Turnout: {votingStatus.totalElectors > 0 ? ((votingStatus.votesCast / votingStatus.totalElectors) * 100).toFixed(2) : '0.00'}%</p>
      </div>
      <div>
        <Link to="/officer/verification">
          <Button variant="primary">Go to Elector Verification</Button>
        </Link>
      </div>
    </div>
  );
};

export default OfficerDashboard;
