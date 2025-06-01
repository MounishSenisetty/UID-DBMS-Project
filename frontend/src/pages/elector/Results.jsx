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
      } catch {
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Live Election Results</h1>
        <p className="text-sm sm:text-base text-green-100">Real-time voting results and statistics</p>
        <div className="mt-4 flex items-center text-xs sm:text-sm">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{totalVotes}</div>
          <div className="text-sm sm:text-base text-gray-600">Total Votes Cast</div>
        </Card>
        
        <Card className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{results.length}</div>
          <div className="text-sm sm:text-base text-gray-600">Candidates</div>
        </Card>
        
        <Card className="p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
            {winner ? getVotePercentage(winner.voteCount) : 0}%
          </div>
          <div className="text-sm sm:text-base text-gray-600">Leading Margin</div>
        </Card>
      </div>      {/* Winner Announcement */}
      {winner && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center sm:mr-4 self-start">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-yellow-800 mb-1">Leading Candidate</h2>
              <div className="text-sm sm:text-base text-yellow-700">
                <div className="font-semibold">{winner.Candidate?.name}</div>
                {winner.Candidate?.Party?.name && (
                  <div className="text-xs sm:text-sm">({winner.Candidate.Party.name})</div>
                )}
                <div className="text-xs sm:text-sm mt-1">
                  {winner.voteCount} votes ({getVotePercentage(winner.voteCount)}%)
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}      {/* Results Table */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Detailed Results</span>
        </h2>
        
        {results.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm sm:text-base text-gray-500">No votes have been cast yet</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {results
              .sort((a, b) => parseInt(b.voteCount) - parseInt(a.voteCount))
              .map((result, index) => (
                <div key={result.candidateId} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <div className={`
                        w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-3 flex-shrink-0
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'}
                      `}>
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-lg truncate">
                          {result.Candidate?.name || 'Unknown Candidate'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {result.Candidate?.Party?.name || 'Independent'}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right self-start sm:self-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {result.voteCount}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {getVotePercentage(result.voteCount)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div 
                      className={`
                        h-2 sm:h-3 rounded-full transition-all duration-500
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
      <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center text-blue-700 text-xs sm:text-sm">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Results automatically refresh every 30 seconds</span>
        </div>
      </Card>
    </div>
  );
};

export default ElectorResults;
