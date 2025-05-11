import React, { useState, useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import api from '../../services/api'

const Results = () => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [statistics, setStatistics] = useState({
    totalVotes: 0,
    turnout: 0,
    constituencies: 0,
    completedStations: 0
  })
  
  useEffect(() => {
    fetchResults()
  }, [])
  
  const fetchResults = async () => {
    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setResults([
        {
          id: 1,
          constituency: 'Northern District',
          totalVotes: 3980,
          turnout: 79.6,
          completed: true,
          candidates: [
            { name: 'John Smith', party: 'Progressive Party', votes: 1245 },
            { name: 'Emma Johnson', party: 'Conservative Alliance', votes: 1102 },
            { name: 'Michael Brown', party: 'Liberty Union', votes: 897 },
            { name: 'Sarah Wilson', party: 'Green Future', votes: 736 }
          ]
        },
        {
          id: 2,
          constituency: 'Southern District',
          totalVotes: 4489,
          turnout: 82.3,
          completed: true,
          candidates: [
            { name: 'David Lee', party: 'Progressive Party', votes: 1523 },
            { name: 'Lisa Chen', party: 'Conservative Alliance', votes: 1211 },
            { name: 'Robert Garcia', party: 'Liberty Union', votes: 943 },
            { name: 'Jennifer Kim', party: 'Green Future', votes: 812 }
          ]
        },
        {
          id: 3,
          constituency: 'Eastern District',
          totalVotes: 2599,
          turnout: 65.2,
          completed: true,
          candidates: [
            { name: 'Thomas Parker', party: 'Progressive Party', votes: 1342 },
            { name: 'Maria Rodriguez', party: 'Conservative Alliance', votes: 1257 }
          ]
        },
        {
          id: 4,
          constituency: 'Western District',
          totalVotes: 3085,
          turnout: 68.7,
          completed: true,
          candidates: [
            { name: 'James Wilson', party: 'Progressive Party', votes: 1654 },
            { name: 'Elizabeth Taylor', party: 'Liberty Union', votes: 1431 }
          ]
        },
        {
          id: 5,
          constituency: 'Central District',
          totalVotes: 4762,
          turnout: 79.4,
          completed: true,
          candidates: [
            { name: 'Charles Martin', party: 'Conservative Alliance', votes: 1876 },
            { name: 'Patricia Adams', party: 'Progressive Party', votes: 1754 },
            { name: 'Daniel Wright', party: 'Green Future', votes: 1132 }
          ]
        }
      ])
      
      setStatistics({
        totalVotes: 18915,
        turnout: 75.66,
        constituencies: 5,
        completedStations: 25
      })
    } catch (error) {
      console.error('Error fetching results:', error)
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
    },
    {
      header: 'Total Votes',
      accessor: 'totalVotes',
      render: (row) => row.totalVotes.toLocaleString(),
    },
    {
      header: 'Turnout',
      accessor: 'turnout',
      render: (row) => `${row.turnout}%`,
    },
    {
      header: 'Status',
      accessor: 'completed',
      render: (row) => (
        <span className={`badge ${row.completed ? 'badge-success' : 'badge-warning'}`}>
          {row.completed ? 'Completed' : 'In Progress'}
        </span>
      ),
    },
    {
      header: 'Leading Candidate',
      render: (row) => {
        const leadingCandidate = [...row.candidates].sort((a, b) => b.votes - a.votes)[0]
        return (
          <div>
            <div className="font-medium">{leadingCandidate.name}</div>
            <div className="text-sm text-neutral-500">{leadingCandidate.party}</div>
          </div>
        )
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {/* View details */}}
        >
          View Details
        </Button>
      ),
    },
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Election Results</h2>
        <p className="mt-1 text-sm text-neutral-500">
          View and analyze election results across all constituencies
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Total Votes</p>
              <p className="text-2xl font-semibold text-primary-900">{statistics.totalVotes.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-secondary-50">
          <div className="flex items-center">
            <div className="rounded-full bg-secondary-100 p-3">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Turnout</p>
              <p className="text-2xl font-semibold text-secondary-900">{statistics.turnout}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-accent-50">
          <div className="flex items-center">
            <div className="rounded-full bg-accent-100 p-3">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-accent-600">Constituencies</p>
              <p className="text-2xl font-semibold text-accent-900">{statistics.constituencies}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-success-50">
          <div className="flex items-center">
            <div className="rounded-full bg-success-100 p-3">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-success-600">Completed Stations</p>
              <p className="text-2xl font-semibold text-success-900">{statistics.completedStations}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Party-wise Results">
          <div className="h-80">
            <Bar
              data={chartData}
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Total Votes by Party'
                  }
                }
              }}
            />
          </div>
        </Card>
        
        <Card title="Vote Distribution">
          <div className="h-80">
            <Doughnut
              data={chartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Vote Share by Party'
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>
      
      {/* Results table */}
      <Card title="Constituency Results">
        <Table
          columns={columns}
          data={results}
          isLoading={loading}
        />
      </Card>
    </div>
  )
}

export default Results