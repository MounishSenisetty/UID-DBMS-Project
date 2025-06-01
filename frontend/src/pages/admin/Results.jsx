import { useState, useEffect } from 'react'
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
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { toast } from 'react-toastify'
// import api from '../../services/api'
import {
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

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

const Results = () => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [selectedConstituency, setSelectedConstituency] = useState(null)
  const [viewMode, setViewMode] = useState('overview') // overview, detailed, live
  const [statistics, setStatistics] = useState({
    totalVotes: 0,
    turnout: 0,
    constituencies: 0,
    completedStations: 0
  })
  
  useEffect(() => {
    fetchResults()
    if (viewMode === 'live') {
      const interval = setInterval(fetchResults, 10000) // Update every 10 seconds in live mode
      return () => clearInterval(interval)
    }
  }, [viewMode])
  
  const fetchResults = async () => {
    setLoading(true)
    try {
      // For now, we'll use mock data since the API requires authentication
      // In a real app, you'd include the auth token in the request headers
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use mock data
      const resultsData = [
          {
            id: 1,
            constituency: 'Northern District',
            totalVotes: 3980,
            registeredVoters: 5000,
            turnout: 79.6,
            completed: true,
            lastUpdated: '2024-01-15 18:30:00',
            candidates: [
              { name: 'John Smith', party: 'Progressive Party', votes: 1245, percentage: 31.3 },
              { name: 'Emma Johnson', party: 'Conservative Alliance', votes: 1102, percentage: 27.7 },
              { name: 'Michael Brown', party: 'Liberty Union', votes: 897, percentage: 22.5 },
              { name: 'Sarah Wilson', party: 'Green Future', votes: 736, percentage: 18.5 }
            ]
          },
          {
            id: 2,
            constituency: 'Southern District',
            totalVotes: 4489,
            registeredVoters: 5460,
            turnout: 82.3,
            completed: true,
            lastUpdated: '2024-01-15 19:15:00',
            candidates: [
              { name: 'David Lee', party: 'Progressive Party', votes: 1523, percentage: 33.9 },
              { name: 'Lisa Chen', party: 'Conservative Alliance', votes: 1211, percentage: 27.0 },
              { name: 'Robert Garcia', party: 'Liberty Union', votes: 943, percentage: 21.0 },
              { name: 'Jennifer Kim', party: 'Green Future', votes: 812, percentage: 18.1 }
            ]
          },
          {
            id: 3,
            constituency: 'Eastern District',
            totalVotes: 2599,
            registeredVoters: 3987,
            turnout: 65.2,
            completed: true,
            lastUpdated: '2024-01-15 18:45:00',
            candidates: [
              { name: 'Thomas Parker', party: 'Progressive Party', votes: 1342, percentage: 51.6 },
              { name: 'Maria Rodriguez', party: 'Conservative Alliance', votes: 1257, percentage: 48.4 }
            ]
          },
          {
            id: 4,
            constituency: 'Western District',
            totalVotes: 3085,
            registeredVoters: 4491,
            turnout: 68.7,
            completed: true,
            lastUpdated: '2024-01-15 19:00:00',
            candidates: [
              { name: 'James Wilson', party: 'Progressive Party', votes: 1654, percentage: 53.6 },
              { name: 'Elizabeth Taylor', party: 'Liberty Union', votes: 1431, percentage: 46.4 }
            ]
          },
          {
            id: 5,
            constituency: 'Central District',
            totalVotes: 4762,
            registeredVoters: 6000,
            turnout: 79.4,
            completed: true,
            lastUpdated: '2024-01-15 19:30:00',
            candidates: [
              { name: 'Charles Martin', party: 'Conservative Alliance', votes: 1876, percentage: 39.4 },
              { name: 'Patricia Adams', party: 'Progressive Party', votes: 1754, percentage: 36.8 },
              { name: 'Daniel Wright', party: 'Green Future', votes: 1132, percentage: 23.8 }
            ]
          }
        ]
        
        const statsData = {
          totalVotes: 18915,
          totalRegistered: 24938,
          turnout: 75.86,
          constituencies: 5,
          completedStations: 25,
          totalStations: 25,
          leadingParty: 'Progressive Party',
          closestRace: 'Eastern District'
        }
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setResults(resultsData)
      setStatistics(statsData)
    } catch (error) {
      console.error('Error fetching results:', error)
      toast.error('Failed to load election results')
    } finally {
      setLoading(false)
    }
  }
  
  // Calculate party-wise results
  const partyResults = results.reduce((acc, constituency) => {
    constituency.candidates.forEach(candidate => {
      if (!acc[candidate.party]) {
        acc[candidate.party] = 0
      }
      acc[candidate.party] += candidate.votes
    })
    return acc
  }, {})
  
  const partyColors = {
    'Progressive Party': '#3366CC',
    'Conservative Alliance': '#DC3912',
    'Liberty Union': '#FF9900',
    'Green Future': '#109618'
  }
  
  const chartData = {
    labels: Object.keys(partyResults),
    datasets: [
      {
        data: Object.values(partyResults),
        backgroundColor: Object.keys(partyResults).map(party => partyColors[party]),
        borderWidth: 0,
      }
    ]
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
  
  const columns = [
    {
      header: 'Constituency',
      accessor: 'constituency',
      render: (row) => (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            🗳️
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{row.constituency}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              Updated: {new Date(row.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Voting Statistics',
      accessor: 'totalVotes',
      render: (row) => (
        <div className="text-xs sm:text-sm space-y-1">
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium">{row.totalVotes.toLocaleString()}</span>
            <span className="text-gray-500 hidden sm:inline">votes cast</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-green-600">{row.turnout}%</span>
            <span className="text-gray-500 hidden sm:inline">turnout</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 sm:h-2 rounded-full"
              style={{ width: `${row.turnout}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      header: 'Leading Candidate',
      render: (row) => {
        const leadingCandidate = [...row.candidates].sort((a, b) => b.votes - a.votes)[0]
        const margin = row.candidates.length > 1 ? 
          leadingCandidate.votes - [...row.candidates].sort((a, b) => b.votes - a.votes)[1].votes : 0
        
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
              <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{leadingCandidate.name}</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">{leadingCandidate.party}</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-semibold text-green-600">{leadingCandidate.percentage}%</span>
              {margin > 0 && (
                <span className="text-xs text-gray-500 hidden sm:inline">
                  (+{margin.toLocaleString()} votes)
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'completed',
      render: (row) => (
        <div className="flex flex-col items-center space-y-2">
          <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.completed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {row.completed ? (
              <>
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <ClockIcon className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">In Progress</span>
                <span className="sm:hidden">⏳</span>
              </>
            )}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedConstituency(row)}
            className="hover:bg-blue-50 hover:text-blue-600 text-xs min-h-[32px]"
            fullWidth
          >
            <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Export functionality */}}
            className="hover:bg-gray-50 text-xs min-h-[32px]"
            fullWidth
          >
            <DocumentArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">📥</span>
          </Button>
        </div>
      ),
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-xl text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">📊 Election Results Dashboard</h1>
            <p className="text-purple-100 text-sm sm:text-lg">
              Real-time election results and comprehensive analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant={viewMode === 'overview' ? 'primary' : 'outline'}
              onClick={() => setViewMode('overview')}
              className={viewMode === 'overview' 
                ? 'bg-white text-purple-600 hover:bg-gray-50' 
                : 'border-white text-white hover:bg-white/10'
              }
              responsive
              fullWidth
            >
              📈 Overview
            </Button>
            <Button
              variant={viewMode === 'live' ? 'primary' : 'outline'}
              onClick={() => setViewMode('live')}
              className={viewMode === 'live' 
                ? 'bg-white text-purple-600 hover:bg-gray-50' 
                : 'border-white text-white hover:bg-white/10'
              }
              responsive
              fullWidth
            >
              🔴 Live Results
            </Button>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Votes Cast</p>
                <p className="text-xl sm:text-2xl font-bold text-white truncate">{statistics.totalVotes?.toLocaleString()}</p>
                <p className="text-xs text-purple-200 truncate">of {statistics.totalRegistered?.toLocaleString()} registered</p>
              </div>
              <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200 flex-shrink-0 ml-2" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-pink-100 text-xs sm:text-sm font-medium">Voter Turnout</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{statistics.turnout}%</p>
                <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 mt-1">
                  <div
                    className="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${statistics.turnout}%` }}
                  ></div>
                </div>
              </div>
              <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-pink-200 flex-shrink-0 ml-2" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-red-100 text-xs sm:text-sm font-medium">Constituencies</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{statistics.constituencies}</p>
                <p className="text-xs text-red-200 truncate">All reporting complete</p>
              </div>
              <BuildingOfficeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-200 flex-shrink-0 ml-2" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-yellow-100 text-xs sm:text-sm font-medium">Polling Stations</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{statistics.completedStations}/{statistics.totalStations}</p>
                <p className="text-xs text-yellow-200 truncate">reporting complete</p>
              </div>
              <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-200 flex-shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Leading Party Highlight */}
        {statistics.leadingParty && (
          <div className="mt-4 sm:mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <TrophyIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-lg">Current Leading Party</p>
                  <p className="text-purple-100 text-sm sm:text-base truncate">{statistics.leadingParty}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-white font-semibold text-sm sm:text-base">Closest Race</p>
                <p className="text-purple-100 text-sm sm:text-base truncate">{statistics.closestRace}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Party-wise Vote Share</h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Data</span>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <Doughnut
              data={chartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
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
        
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Votes by Party</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Export chart */}}
              className="text-xs self-start sm:self-auto"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="h-64 sm:h-80">
            <Bar
              data={chartData}
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return value.toLocaleString()
                      },
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  },
                  y: {
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

      {/* Constituency Results Table */}
      <Card className="overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Constituency Results</h3>
              <p className="text-xs sm:text-sm text-gray-500">Detailed results for all constituencies</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {viewMode === 'live' && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-refreshing every 10s</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Export all results */}}
                className="text-xs sm:text-sm min-h-[36px]"
                responsive
              >
                <DocumentArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Export All
              </Button>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={results}
          isLoading={loading}
        />
      </Card>

      {/* Detailed Constituency Modal - Responsive */}
      {selectedConstituency && (
        <Modal
          isOpen={!!selectedConstituency}
          onClose={() => setSelectedConstituency(null)}
          title={
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                🗳️
              </div>
              <span className="text-sm sm:text-base font-medium truncate">{selectedConstituency.constituency} - Detailed Results</span>
            </div>
          }
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{selectedConstituency.totalVotes.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Turnout</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{selectedConstituency.turnout}%</p>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Candidate Results</h4>
              <div className="space-y-2 sm:space-y-3">
                {selectedConstituency.candidates
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{candidate.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-sm sm:text-base">{candidate.votes.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{candidate.percentage}%</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Results