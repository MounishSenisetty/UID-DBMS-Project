import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ElectorVoting = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Fetch candidates for the elector's constituency
        const response = await api.get(`/candidates?constituencyId=${user.constituencyId}`);
        setCandidates(response.data);
      } catch (error) {
        toast.error('Failed to load candidates');
      }
    };

    const checkVoteStatus = async () => {
      try {
        const response = await api.get(`/votes/status?electorSerialNumber=${user.serialNumber}`);
        setHasVoted(response.data.hasVoted);
      } catch (error) {
        toast.error('Failed to check vote status');
      }
    };

    fetchCandidates();
    checkVoteStatus();
    setLoading(false);
  }, [user]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate to vote');
      return;
    }
    try {
      await api.post('/votes', {
        electorSerialNumber: user.serialNumber,
        candidateId: selectedCandidate,
      });
      toast.success('Vote cast successfully');
      setHasVoted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (hasVoted) {
    return <p>You have already cast your vote. Thank you for participating.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Cast Your Vote</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <label>
              <input
                type="radio"
                name="candidate"
                value={candidate.id}
                onChange={() => setSelectedCandidate(candidate.id)}
              />
              {candidate.name} ({candidate.Party?.name || 'Independent'})
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleVote}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit Vote
      </button>
    </div>
  );
};

export default ElectorVoting;
