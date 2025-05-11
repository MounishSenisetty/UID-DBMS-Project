import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import api from '../../services/api'
import Loader from '../../components/common/Loader'
import Card from '../../components/common/Card'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const LiveResults = () => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [selectedConstituency, setSelectedConstituency] = useState('all')
  const [electionStatus, setElectionStatus] = useState('active') // active, completed
  const [statistics, setStatistics] = useState({
    totalVotes: 0,
    totalElectors: 0,
    turnout: 0,
  })

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        // Would be implemented with actual API when available
        // Simulating API response
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockConstituencies = [
          { id: 1, name: 'Northern District' },
          { id: 2, name: 'Southern District' },
          { id: 3, name: 'Eastern District' },
          { id: 4, name: 'Western District' },
          { id: 5, name: 'Central District' },
        ]
        
        const mockResults = [
          { 
            candidateId: 1, 
            candidateName: 'John Smith', 
            partyName: 'Progressive Party', 
            constituencyId: 1,
            constituencyName: 'Northern District',
            votes: 1245,
            color: '#3366CC',
            isLeading: true,
          },
          { 
            candidateId: 2, 
            candidateName: 'Emma Johnson', 
            partyName: 'Conservative Alliance', 
            constituencyId: 1,
            constituencyName: 'Northern District',
            votes: 1102,
            color: '#DC3912',
            isLeading: false,
          },
          { 
            candidateId: 3, 
            candidateName: 'Michael Brown', 
            partyName: 'Liberty Union', 
            constituencyId: 1,
            constituencyName: 'Northern District',
            votes: 897,
            color: '#FF9900',
            isLeading: false,
          },
          { 
            candidateId: 4, 
            candidateName: 'Sarah Wilson', 
            partyName: 'Green Future', 
            constituencyId: 1,
            constituencyName: 'Northern District',
            votes: 736,
            color: '#109618',
            isLeading: false,
          },
          { 
            candidateId: 5, 
            candidateName: 'David Lee', 
            partyName: 'Progressive Party', 
            constituencyId: 2,
            constituencyName: 'Southern District',
            votes: 1523,
            color: '#3366CC',
            isLeading: true,
          },
          { 
            candidateId: 6, 
            candidateName: 'Lisa Chen', 
            partyName: 'Conservative Alliance', 
            constituencyId: 2,
            constituencyName: 'Southern District',
            votes: 1211,
            color: '#DC3912',
            isLeading: false,
          },
          { 
            candidateId: 7, 
            candidateName: 'Robert Garcia', 
            partyName: 'Liberty Union', 
            constituencyId: 2,
            constituencyName: 'Southern District',
            votes: 943,
            color: '#FF9900',
            isLeading: false,
          },
          { 
            candidateId: 8, 
            candidateName: 'Jennifer Kim', 
            partyName: 'Green Future', 
            constituencyId: 2,
            constituencyName: 'Southern District',
            votes: 812,
            color: '#109618',
            isLeading: false,
          },
          // More results for other constituencies
          { 
            candidateId: 9, 
            candidateName: 'Thomas Parker', 
            partyName: 'Progressive Party', 
            constituencyId: 3,
            constituencyName: 'Eastern District',
            votes: 1342,
            color: '#3366CC',
            isLeading: true,
          },
          { 
            candidateId: 10, 
            candidateName: 'Maria Rodriguez', 
            partyName: 'Conservative Alliance', 
            constituencyId: 3,
            constituencyName: 'Eastern District',
            votes: 1257,
            color: '#DC3912',
            isLeading: false,
          },
          { 
            candidateId: 11, 
            candidateName: 'James Wilson', 
            partyName: 'Progressive Party', 
            constituencyId: 4,
            constituencyName: 'Western District',
            votes: 1654,
            color: '#3366CC',
            isLeading: true,
          },
          { 
            candidateId: 12, 
            candidateName: 'Elizabeth Taylor', 
            partyName: 'Liberty Union', 
            constituencyId: 4,
            constituencyName: 'Western District',
            votes: 1431,
            color: '#FF9900',
            isLeading: false,
          },
          { 
            candidateId: 13, 
            candidateName: 'Charles Martin', 
            partyName: 'Conservative Alliance', 
            constituencyId: 5,
            constituencyName: 'Central District',
            votes: 1876,
            color: '#DC3912',
            isLeading: true,
          },
          { 
            candidateId: 14, 
            candidateName: 'Patricia Adams', 
            partyName: 'Progressive Party', 
            constituencyId: 5,
            constituencyName: 'Central District',
            votes: 1754,
            color: '#3366CC',
            isLeading: false,
          },
          { 
            candidateId: 15, 
            candidateName: 'Daniel Wright', 
            partyName: 'Green Future', 
            constituencyId: 5,
            constituencyName: 'Central District',
            votes: 1132,
            color: '#109618',
            isLeading: false,
          },
        ]
        
        setResults(mockResults)
        setConstituencies(mockConstituencies)
        setStatistics({
          totalVotes: 18873,
          totalElectors: 25000,
          turnout: 75.49,
        })
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchResults, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  // Filter results based on selected constituency
  const filteredResults = selectedConstituency === 'all'
    ? results
    : results.filter(result => result.constituencyId.toString() === selectedConstituency)

  // Prepare chart data
  const partyResults = {}
  filteredResults.forEach(result => {
    if (!partyResults[result.partyName]) {
      partyResults[result.partyName] = {
        votes: 0,
        color: result.color
      }
    }
    partyResults[result.partyName].votes += result.votes
  })

  const chartData = {
    labels: Object.keys(partyResults),
    datasets: [
      {
        label: 'Votes',
        data: Object.values(partyResults).map(party => party.votes),
        backgroundColor: Object.values(partyResults).map(party => party.color),
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: selectedConstituency === 'all' ? 'Overall Party Performance' : `Party Performance in ${constituencies.find(c => c.id.toString() === selectedConstituency)?.name || ''}`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Votes',
        },
      },
    },
  }

  // Group results by constituency for easier display
  const resultsByConstituency = {}
  filteredResults.forEach(result => {
    if (!resultsByConstituency[result.constituencyName]) {
      resultsByConstituency[result.constituencyName] = []
    }
    resultsByConstituency[result.constituencyName].push(result)
  })

  // Sort candidates by votes in each constituency
  Object.keys(resultsByConstituency).forEach(constituencyName => {
    resultsByConstituency[constituencyName].sort((a, b) => b.votes - a.votes)
  })

  return (
    <div className="animate-fade-in">
      <div className="bg-primary-600 text-white py-12 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Live Election Results</h1>
          <p className="text-lg mb-6">
            Follow the real-time results of the elections as votes are counted
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{statistics.totalVotes.toLocaleString()}</div>
              <div className="text-sm">Total Votes Cast</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{statistics.turnout.toFixed(1)}%</div>
              <div className="text-sm">Voter Turnout</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold flex items-center">
                <span className={`inline-block h-3 w-3 mr-2 rounded-full ${electionStatus === 'active' ? 'bg-success-500 animate-pulse-slow' : 'bg-error-500'}`}></span>
                <span>{electionStatus === 'active' ? 'Live' : 'Completed'}</span>
              </div>
              <div className="text-sm">Election Status</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <label htmlFor="constituency" className="block text-sm font-medium text-neutral-700 mb-2">
            Select Constituency
          </label>
          <select
            id="constituency"
            className="input"
            value={selectedConstituency}
            onChange={(e) => setSelectedConstituency(e.target.value)}
          >
            <option value="all">All Constituencies</option>
            {constituencies.map((constituency) => (
              <option key={constituency.id} value={constituency.id}>
                {constituency.name}
              </option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <Loader text="Loading results..." />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card className="h-96">
                  <div className="h-full">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </Card>
              </div>
              
              <div>
                <Card title="Leading Parties" className="h-96 overflow-auto">
                  <div className="space-y-4">
                    {Object.keys(partyResults)
                      .sort((a, b) => partyResults[b].votes - partyResults[a].votes)
                      .map((partyName, index) => (
                        <div key={partyName} className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: partyResults[partyName].color }}>
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="text-sm font-medium text-neutral-900">{partyName}</div>
                            <div className="text-sm text-neutral-500">{partyResults[partyName].votes.toLocaleString()} votes</div>
                          </div>
                          <div className="flex-shrink-0">
                            {index === 0 && (
                              <span className="badge badge-success">Leading</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Constituency Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(resultsByConstituency).map((constituencyName) => (
                  <Card 
                    key={constituencyName} 
                    title={constituencyName}
                    className="h-full"
                  >
                    <div className="space-y-3">
                      {resultsByConstituency[constituencyName].map((candidate, index) => (
                        <div key={candidate.candidateId} className="relative">
                          <div className="flex justify-between mb-1">
                            <div className="text-sm font-medium">
                              {candidate.candidateName}
                              <span className="text-sm font-normal text-neutral-500 ml-1">
                                ({candidate.partyName})
                              </span>
                            </div>
                            <div className="text-sm font-medium">{candidate.votes.toLocaleString()}</div>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${(candidate.votes / resultsByConstituency[constituencyName][0].votes) * 100}%`,
                                backgroundColor: candidate.color
                              }}
                            ></div>
                          </div>
                          {index === 0 && (
                            <span className="absolute -top-1 -right-1 badge badge-success">
                              Leading
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LiveResults