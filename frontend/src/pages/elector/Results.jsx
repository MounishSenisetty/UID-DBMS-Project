
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ElectorResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/votes/count');
        setResults(response.data.voteCounts);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <p>Loading results...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Live Voting Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.candidateId}>
            {result.Candidate?.name} ({result.Candidate?.Party?.name || 'Independent'}): {result.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectorResults;
