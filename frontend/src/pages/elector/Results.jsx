
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const ElectorResults = () => {
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/api/votes/count');
        setResults(response.data.voteCounts || []);
        setWinner(response.data.winner);
        
        // Calculate total votes
        const total = response.data.voteCounts?.reduce((sum, result) => 
          sum + parseInt(result.voteCount), 0
        ) || 0;
        setTotalVotes(total);
      } catch (error) {
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    
    // Auto-refresh results every 30 seconds
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, []);

  const getVotePercentage = (voteCount) => {
    if (totalVotes === 0) return 0;
    return ((parseInt(voteCount) / totalVotes) * 100).toFixed(1);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Live Election Results</h1>
        <p className="text-green-100">Real-time voting results and statistics</p>
        <div className="mt-4 flex items-center text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalVotes}</div>
          <div className="text-gray-600">Total Votes Cast</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{results.length}</div>
          <div className="text-gray-600">Candidates</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {winner ? getVotePercentage(winner.voteCount) : 0}%
          </div>
          <div className="text-gray-600">Leading Margin</div>
        </Card>
      </div>

      {/* Winner Announcement */}
      {winner && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-yellow-800">Leading Candidate</h2>
              <p className="text-yellow-700">
                <span className="font-semibold">{winner.Candidate?.name}</span> 
                {winner.Candidate?.Party?.name && (
                  <span> ({winner.Candidate.Party.name})</span>
                )}
                <span className="ml-2">with {winner.voteCount} votes ({getVotePercentage(winner.voteCount)}%)</span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Results Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Detailed Results
        </h2>
        
        {results.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">No votes have been cast yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results
              .sort((a, b) => parseInt(b.voteCount) - parseInt(a.voteCount))
              .map((result, index) => (
                <div key={result.candidateId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {result.Candidate?.name || 'Unknown Candidate'}
                        </h3>
                        <p className="text-gray-600">
                          {result.Candidate?.Party?.name || 'Independent'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.voteCount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getVotePercentage(result.voteCount)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`
                        h-3 rounded-full transition-all duration-500
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'}
                      `}
                      style={{ width: `${getVotePercentage(result.voteCount)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* Refresh Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center text-blue-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Results automatically refresh every 30 seconds
        </div>
      </Card>
    </div>
  );
};

export default ElectorResults;

export default ElectorResults;
