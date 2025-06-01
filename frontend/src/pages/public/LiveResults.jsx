import { useEffect, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import Loader from '../../components/common/Loader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const LiveResults = () => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [selectedConstituency, setSelectedConstituency] = useState('all')
  const [electionStatus] = useState('active') // active, completed
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header Section - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 animate-pulse-slow">🗳️ Live Election Results</h1>
            <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 text-blue-100 px-4">
              Follow the real-time results of the elections as votes are counted across all constituencies
            </p>
            
            {/* Live Status Indicator */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/30">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 ${electionStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="font-semibold text-sm sm:text-lg">
                {electionStatus === 'active' ? '🔴 LIVE COUNTING' : '✅ COUNTING COMPLETED'}
              </span>
            </div>
          </div>
          
          {/* Enhanced Statistics Dashboard - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-2xl sm:text-3xl font-bold truncate">{statistics.totalVotes.toLocaleString()}</div>
                  <div className="text-blue-100 mt-1 text-sm sm:text-base">Total Votes Cast</div>
                  <div className="text-xs text-blue-200 mt-1 hidden sm:block">
                    +{Math.floor(Math.random() * 50)} in last minute
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl flex-shrink-0 ml-2">📊</div>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-2xl sm:text-3xl font-bold">{statistics.turnout.toFixed(1)}%</div>
                  <div className="text-purple-100 mt-1 text-sm sm:text-base">Voter Turnout</div>
                  <div className="w-full bg-white/30 rounded-full h-1.5 sm:h-2 mt-2">
                    <div 
                      className="bg-green-400 h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${statistics.turnout}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl flex-shrink-0 ml-2">📈</div>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-2xl sm:text-3xl font-bold flex items-center">
                    <span className={`inline-block h-2 w-2 sm:h-3 sm:w-3 mr-2 rounded-full ${electionStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                    <span>{constituencies.length}</span>
                  </div>
                  <div className="text-pink-100 mt-1 text-sm sm:text-base">Constituencies</div>
                  <div className="text-xs text-pink-200 mt-1 hidden sm:block">All reporting results</div>
                </div>
                <div className="text-2xl sm:text-4xl flex-shrink-0 ml-2">🏛️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Enhanced Constituency Filter - Responsive */}
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 w-full lg:max-w-md">
              <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 mb-2">
                🏘️ Filter by Constituency
              </label>
              <select
                id="constituency"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all text-sm sm:text-base"
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
              >
                <option value="all">🌍 All Constituencies</option>
                {constituencies.map((constituency) => (
                  <option key={constituency.id} value={constituency.id}>
                    📍 {constituency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 hover:bg-blue-50 w-full sm:w-auto min-h-[40px]"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-updating every 30s</span>
              </div>
            </div>
          </div>
        </Card>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader text="Loading live results..." />
          </div>
        ) : (
          <>
            {/* Enhanced Charts Section - Responsive */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Bar Chart */}
              <div className="xl:col-span-2">
                <Card className="h-[400px] sm:h-[500px] p-4 sm:p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Vote Distribution</h3>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Real-time data</span>
                    </div>
                  </div>
                  <div className="h-[320px] sm:h-[400px]">
                    <Bar 
                      data={chartData} 
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            ...chartOptions.plugins.title,
                            font: {
                              size: window.innerWidth < 640 ? 12 : 16,
                              weight: 'bold',
                            }
                          }
                        },
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            ...chartOptions.scales.y,
                            ticks: {
                              font: {
                                size: window.innerWidth < 640 ? 10 : 12
                              }
                            }
                          },
                          x: {
                            ticks: {
                              font: {
                                size: window.innerWidth < 640 ? 10 : 12
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Card>
              </div>
              
              {/* Pie Chart and Leading Parties - Responsive */}
              <div className="space-y-4 sm:space-y-6">
                {/* Doughnut Chart */}
                <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">🥧 Party Share</h3>
                  <div className="h-40 sm:h-48">
                    <Doughnut
                      data={{
                        labels: Object.keys(partyResults),
                        datasets: [{
                          data: Object.values(partyResults).map(party => party.votes),
                          backgroundColor: Object.values(partyResults).map(party => party.color),
                          borderWidth: 2,
                          borderColor: '#ffffff',
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }}
                    />
                  </div>
                </Card>
                
                {/* Leading Parties */}
                <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">🏆 Leading Parties</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {Object.keys(partyResults)
                      .sort((a, b) => partyResults[b].votes - partyResults[a].votes)
                      .slice(0, 4)
                      .map((partyName, index) => (
                        <div key={partyName} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div 
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0"
                              style={{ backgroundColor: partyResults[partyName].color }}
                            >
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{partyName}</div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {((partyResults[partyName].votes / statistics.totalVotes) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-gray-900 text-sm sm:text-base">
                              {partyResults[partyName].votes.toLocaleString()}
                            </div>
                            {index === 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                🥇 Leading
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Enhanced Constituency Results - Responsive */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  🏘️ Constituency-wise Results
                </h2>
                <Button
                  variant="outline"
                  onClick={() => {/* Export functionality */}}
                  className="flex items-center space-x-2 w-full sm:w-auto min-h-[40px]"
                >
                  <span>📄</span>
                  <span>Export Results</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Object.keys(resultsByConstituency).map((constituencyName) => (
                  <Card 
                    key={constituencyName} 
                    className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{constituencyName}</h3>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Live</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {resultsByConstituency[constituencyName].slice(0, 3).map((candidate, index) => (
                        <div key={candidate.candidateId} className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div 
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ backgroundColor: candidate.color }}
                              >
                                {index + 1}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {candidate.candidateName}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {candidate.partyName}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xs sm:text-sm font-bold text-gray-900">
                                {candidate.votes.toLocaleString()}
                              </div>
                              {index === 0 && (
                                <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  🏆
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(candidate.votes / resultsByConstituency[constituencyName][0].votes) * 100}%`,
                                backgroundColor: candidate.color
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      
                      {resultsByConstituency[constituencyName].length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-xs text-gray-500">
                            +{resultsByConstituency[constituencyName].length - 3} more candidates
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Auto-refresh Notice - Responsive */}
            <Card className="p-3 sm:p-4 bg-blue-50/80 border-blue-200/50 backdrop-blur-sm">
              <div className="flex items-center justify-center text-blue-700">
                <div className="flex items-center space-x-2 sm:space-x-3 text-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium">
                    Results automatically refresh every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default LiveResults