import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    constituencies: 0,
    pollingStations: 0,
    registeredElectors: 0,
    registeredCandidates: 0,
    turnoutRate: 0,
    votesProcessed: 0,
  })
  
  const [recentActivity, setRecentActivity] = useState([])
  
  useEffect(() => {
    // Simulated fetch of dashboard data
    // This would be replaced with actual API calls
    const fetchDashboardData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setStats({
        constituencies: 5,
        pollingStations: 25,
        registeredElectors: 25000,
        registeredCandidates: 45,
        turnoutRate: 75.49,
        votesProcessed: 18873,
      })
      
      setRecentActivity([
        { id: 1, action: 'New officer registered', timestamp: '2 minutes ago', user: 'Admin', target: 'James Wilson' },
        { id: 2, action: 'Constituency boundary updated', timestamp: '1 hour ago', user: 'Admin', target: 'Northern District' },
        { id: 3, action: 'New polling station added', timestamp: '2 hours ago', user: 'Admin', target: 'Central Community Center' },
        { id: 4, action: 'System maintenance completed', timestamp: '5 hours ago', user: 'System', target: 'Database' },
        { id: 5, action: 'New candidate registered', timestamp: '1 day ago', user: 'Admin', target: 'Sarah Johnson' },
      ])
    }
    
    fetchDashboardData()
  }, [])
  
  // Turnout chart data
  const turnoutData = {
    labels: ['Voted', 'Not Voted'],
    datasets: [
      {
        data: [stats.votesProcessed, stats.registeredElectors - stats.votesProcessed],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        borderWidth: 0,
      },
    ],
  }
  
  const turnoutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
  }
  
  // Party performance chart data (mock data)
  const partyPerformanceData = {
    labels: ['Progressive Party', 'Conservative Alliance', 'Liberty Union', 'Green Future'],
    datasets: [
      {
        label: 'Votes',
        data: [8750, 6530, 2240, 1353],
        backgroundColor: ['#3366CC', '#DC3912', '#FF9900', '#109618'],
        borderWidth: 0,
      },
    ],
  }
  
  const partyPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }
  
  return (
    <div className="animate-fade-in">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <Card className="bg-primary-50 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Constituencies</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.constituencies}</p>
            </div>
            <div className="rounded-full bg-primary-100 p-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="bg-secondary-50 border-l-4 border-secondary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Polling Stations</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.pollingStations}</p>
            </div>
            <div className="rounded-full bg-secondary-100 p-3">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="bg-accent-50 border-l-4 border-accent-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-600">Registered Electors</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.registeredElectors.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-accent-100 p-3">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="bg-success-50 border-l-4 border-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-600">Candidates</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.registeredCandidates}</p>
            </div>
            <div className="rounded-full bg-success-100 p-3">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="bg-warning-50 border-l-4 border-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning-600">Turnout Rate</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.turnoutRate}%</p>
            </div>
            <div className="rounded-full bg-warning-100 p-3">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="bg-error-50 border-l-4 border-error-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-error-600">Votes Processed</p>
              <p className="text-2xl font-semibold text-neutral-900">{stats.votesProcessed.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-error-100 p-3">
              <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Voter turnout chart */}
        <Card title="Voter Turnout" className="lg:col-span-1">
          <div className="h-64">
            <Doughnut data={turnoutData} options={turnoutOptions} />
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-neutral-500">Total Registered Electors: {stats.registeredElectors.toLocaleString()}</p>
            <p className="text-sm text-neutral-500">
              <span className="text-success-600 font-medium">{stats.votesProcessed.toLocaleString()}</span> votes processed 
              (<span className="font-medium">{stats.turnoutRate}%</span> turnout)
            </p>
          </div>
        </Card>
        
        {/* Party performance chart */}
        <Card title="Party Performance" className="lg:col-span-2">
          <div className="h-64">
            <Bar data={partyPerformanceData} options={partyPerformanceOptions} />
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {partyPerformanceData.labels.map((party, index) => (
              <div key={party} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: partyPerformanceData.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-xs">{party}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Quick actions and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="space-y-3">
            <Link to="/admin/constituencies">
              <Button variant="primary" className="w-full justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Manage Constituencies
              </Button>
            </Link>
            
            <Link to="/admin/polling-stations">
              <Button variant="secondary" className="w-full justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Manage Stations
              </Button>
            </Link>
            
            <Link to="/admin/officers">
              <Button variant="accent" className="w-full justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Manage Officers
              </Button>
            </Link>
            
            <Link to="/admin/results">
              <Button variant="success" className="w-full justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                View Results
              </Button>
            </Link>
          </div>
        </Card>
        
        {/* Recent activity */}
        <Card title="Recent Activity" className="lg:col-span-2">
          <div className="overflow-hidden">
            <ul className="divide-y divide-neutral-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-neutral-900">
                        {activity.action}
                        <span className="text-accent-700"> {activity.target}</span>
                      </div>
                      <div className="mt-1 text-sm text-neutral-500 flex justify-between">
                        <span>By {activity.user}</span>
                        <time>{activity.timestamp}</time>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard