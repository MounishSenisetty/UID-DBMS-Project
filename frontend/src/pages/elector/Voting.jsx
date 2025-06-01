import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ElectorVoting = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('/api/candidates');
        setCandidates(response.data);
      } catch (error) {
        toast.error('Failed to load candidates');
      }
    };

    const checkVoteStatus = async () => {
      try {
        const response = await api.get(`/api/electors/vote-status/${user.linkedId}`);
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
    
    setVoting(true);
    try {
      await api.post('/api/votes', {
        electorSerialNumber: user.linkedId,
        candidateId: selectedCandidate,
      });
      toast.success('Vote cast successfully! Thank you for participating in democracy.');
      setHasVoted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <Loader />;

  if (hasVoted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Already Cast</h2>
          <p className="text-gray-600 mb-6">
            You have already participated in this election. Thank you for exercising your democratic right!
          </p>          <Button 
            onClick={() => navigate('/elector/results')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Results
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Cast Your Vote</h1>
        <p className="text-blue-100">Select your preferred candidate and exercise your democratic right</p>
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Voting Instructions
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">1</span>
            Review all candidates carefully before making your selection
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">2</span>
            Click on the candidate card to select your preferred choice
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">3</span>
            Confirm your selection by clicking "Submit Vote"
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">4</span>
            Your vote cannot be changed once submitted
          </li>
        </ul>
      </Card>

      {/* Candidates */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Select Your Candidate
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              className={`
                cursor-pointer rounded-lg border-2 p-6 transition-all duration-200
                ${selectedCandidate === candidate.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              <div className="text-center">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                  ${selectedCandidate === candidate.id ? 'bg-blue-200' : 'bg-gray-200'}
                `}>
                  <span className={`
                    text-2xl font-bold
                    ${selectedCandidate === candidate.id ? 'text-blue-700' : 'text-gray-600'}
                  `}>
                    {candidate.name.charAt(0)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {candidate.name}
                </h3>
                
                <div className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${candidate.Party?.name ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}
                `}>
                  {candidate.Party?.name || 'Independent'}
                </div>
                
                {selectedCandidate === candidate.id && (
                  <div className="mt-4">
                    <div className="flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Submit Vote */}
      {selectedCandidate && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Your Vote</h3>
              <p className="text-gray-600">
                You have selected: <span className="font-medium">
                  {candidates.find(c => c.id === selectedCandidate)?.name}
                </span>
              </p>
            </div>
            <Button
              onClick={handleVote}
              disabled={voting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {voting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Vote
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ElectorVoting;
