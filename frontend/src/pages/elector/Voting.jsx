import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Input from '../../components/common/Input';

const ElectorVoting = () => {
  const { currentUser } = useAuth();
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ward, setWard] = useState('');
  const [electorDetails, setElectorDetails] = useState(null);

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await api.get('/api/constituencies');
        setConstituencies(response.data);
        // Removed setting selectedConstituency here to avoid overwriting elector's constituency
      } catch {
        toast.error('Failed to load constituencies');
      }
    };

    const fetchCandidates = async (constituencyId) => {
      if (!constituencyId) {
        setCandidates([]);
        return;
      }
      try {
        const response = await api.get(`/api/candidates?constituencyId=${constituencyId}`);
        setCandidates(response.data);
      } catch {
        toast.error('Failed to load candidates');
      }
    };

    const checkVoteStatus = async () => {
      if (!currentUser || !currentUser.serialNumber) return;
      try {
        const response = await api.get(`/api/votes/status?electorSerialNumber=${currentUser.serialNumber}`);
        setHasVoted(response.data.hasVoted);
      } catch {
        toast.error('Failed to check vote status');
      }
    };

    const fetchElectorDetails = async () => {
      try {
        const response = await api.get('/api/electors/me');
        console.log('Elector details fetched:', response.data);
        setElectorDetails(response.data);
        setWard(response.data.PollingStation?.ward || '');
        setSelectedConstituency(response.data.PollingStation?.Constituency?.id || '');
      } catch (error) {
        console.error('Error loading elector details:', error);
        toast.error('Failed to load elector details');
      }
    };

    if (currentUser) {
      fetchElectorDetails();
      fetchConstituencies();
      checkVoteStatus();
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    const fetchCandidatesForSelectedConstituency = async () => {
      if (!selectedConstituency) {
        setCandidates([]);
        return;
      }
      try {
        const response = await api.get(`/api/candidates?constituencyId=${selectedConstituency}`);
        setCandidates(response.data);
        setSelectedCandidate(null);
      } catch (error) {
        console.error('Error loading candidates:', error);
        toast.error('Failed to load candidates');
      }
    };
    fetchCandidatesForSelectedConstituency();
  }, [selectedConstituency]);

  const handleVote = () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate to vote');
      return;
    }
    if (!selectedConstituency || !ward) {
      toast.error('Please select your constituency and provide your ward');
      return;
    }
    setShowConfirmModal(true);
  };

    const confirmVote = async () => {
      setShowConfirmModal(false);
      setSubmitting(true);
      try {
        await api.post('/api/votes', {
          electorSerialNumber: electorDetails?.serialNumber,
          candidateId: selectedCandidate,
          constituencyId: selectedConstituency,
          ward,
        });
        toast.success('Vote cast successfully');
        setHasVoted(true);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cast vote');
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <div>
        <SkeletonLoader className="h-6 w-48 mb-4" />
        {[...Array(5)].map((_, i) => (
          <SkeletonLoader key={i} className="h-10 mb-2 rounded" />
        ))}
      </div>
    );
  }

  if (hasVoted) {
    return <p>You have already cast your vote. Thank you for participating.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Cast Your Vote</h2>
      <div className="mb-4 max-w-sm">
        <label htmlFor="constituency" className="block mb-1 font-medium">Constituency</label>
        <select
          id="constituency"
          value={selectedConstituency}
          onChange={(e) => setSelectedConstituency(e.target.value)}
          className="input w-full"
        >
          <option value="">Select Constituency</option>
          {constituencies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4 max-w-sm">
        <Input
          label="Ward"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        />
      </div>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <label className={`cursor-pointer flex items-center p-2 rounded hover:bg-gray-100 focus-within:ring-2 focus-within:ring-primary-500 ${selectedCandidate === candidate.id ? 'bg-primary-100' : ''}`}>
              <input
                type="radio"
                name="candidate"
                value={candidate.id}
                onChange={() => setSelectedCandidate(candidate.id)}
                checked={selectedCandidate === candidate.id}
                className="mr-3"
                aria-checked={selectedCandidate === candidate.id}
              />
              {candidate.name} ({candidate.partyName || 'Independent'})
            </label>
          </li>
        ))}
      </ul>
      <Button
        onClick={handleVote}
        disabled={submitting}
        loading={submitting}
        className="mt-4"
      >
        Submit Vote
      </Button>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Vote"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmVote} loading={submitting}>Confirm</Button>
          </div>
        }
      >
        <p>Are you sure you want to cast your vote for this candidate?</p>
      </Modal>
    </div>
  );
};

export default ElectorVoting;
