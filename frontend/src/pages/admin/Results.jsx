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
  const [constituencyId, setConstituencyId] = useState('')
  const [ward, setWard] = useState('')
  const [constituencies, setConstituencies] = useState([])

  useEffect(() => {
    fetchConstituencies()
  }, [])

  useEffect(() => {
    if (constituencyId) {
      fetchResults()
    }
  }, [constituencyId, ward])

  const fetchConstituencies = async () => {
    try {
      const response = await api.get('/api/constituencies')
      setConstituencies(response.data)
    } catch (error) {
      console.error('Error fetching constituencies:', error)
    }
  }

  const fetchResults = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (constituencyId) params.append('constituencyId', constituencyId)
      if (ward) params.append('ward', ward)

      const response = await api.get(`/api/results?${params.toString()}`)
      const { partyVotes, totalVotes } = response.data

      // Transform partyVotes object to array for charts and table
      const resultsArray = Object.entries(partyVotes).map(([party, votes]) => ({
        party,
        votes,
      }))

      setResults(resultsArray)
      setStatistics(prev => ({ ...prev, totalVotes }))
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const partyColors = {
    'Progressive Party': '#3366CC',
    'Conservative Alliance': '#DC3912',
    'Liberty Union': '#FF9900',
    'Green Future': '#109618'
  }

  const chartData = {
    labels: results.map(r => r.party),
    datasets: [
      {
        data: results.map(r => r.votes),
        backgroundColor: results.map(r => partyColors[r.party] || '#888'),
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
      header: 'Party',
      accessor: 'party',
    },
    {
      header: 'Votes',
      accessor: 'votes',
      render: (row) => row.votes.toLocaleString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Election Results</h2>
        <p className="mt-1 text-sm text-neutral-500">
          View and analyze election results across constituencies and wards
        </p>
      </div>

      <div className="flex space-x-4 mb-4">
        <select
          value={constituencyId}
          onChange={(e) => setConstituencyId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select Constituency</option>
          {constituencies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter Ward"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
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
