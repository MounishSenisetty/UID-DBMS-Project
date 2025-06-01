import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import api from '../../services/api'

const Officers = () => {
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStation, setFilterStation] = useState('all')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchOfficers()
  }, [])
  
  const fetchOfficers = async () => {
    setLoading(true)
    try {
      // Try API call first, fallback to mock data
      let officersData
      try {
        const response = await api.get('/officers')
        officersData = response.data
      } catch (error) {
        console.log('API unavailable, using mock data')
        officersData = [
          {
            id: 1,
            name: 'James Wilson',
            email: 'james.wilson@example.com',
            phone: '+1 (555) 123-4567',
            station: 'Central Community Center',
            role: 'Station Manager',
            status: 'active',
            joinDate: '2023-01-15',
            experience: '5 years'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1 (555) 234-5678',
            station: 'Northern Public School',
            role: 'Verification Officer',
            status: 'active',
            joinDate: '2023-02-20',
            experience: '3 years'
          },
          {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            phone: '+1 (555) 345-6789',
            station: 'Southern Town Hall',
            role: 'Station Manager',
            status: 'active',
            joinDate: '2023-01-10',
            experience: '7 years'
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '+1 (555) 456-7890',
            station: 'Eastern Community Hall',
            role: 'Verification Officer',
            status: 'active',
            joinDate: '2023-03-05',
            experience: '2 years'
          },
          {
            id: 5,
            name: 'David Martinez',
            email: 'david.martinez@example.com',
            phone: '+1 (555) 567-8901',
            station: 'Western Civic Center',
            role: 'Station Manager',
            status: 'active',
            joinDate: '2023-01-25',
            experience: '4 years'
          },
          {
            id: 6,
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            phone: '+1 (555) 678-9012',
            station: 'Central Community Center',
            role: 'Verification Officer',
            status: 'inactive',
            joinDate: '2023-04-12',
            experience: '1 year'
          },
        ]
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setOfficers(officersData)
    } catch (error) {
      console.error('Error fetching officers:', error)
      toast.error('Failed to load officers data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: officers.length,
    active: officers.filter(o => o.status === 'active').length,
    stationManagers: officers.filter(o => o.role === 'Station Manager').length,
    verificationOfficers: officers.filter(o => o.role === 'Verification Officer').length,
    stations: [...new Set(officers.map(o => o.station))].length
  }

  // Filter officers based on search and filters
  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.station.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || officer.role === filterRole
    const matchesStation = filterStation === 'all' || officer.station === filterStation
    
    return matchesSearch && matchesRole && matchesStation
  })

  // Get unique stations for filter
  const uniqueStations = [...new Set(officers.map(o => o.station))]
  
  const columns = [
    {
      header: 'Officer',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone',
      render: (row) => (
        <div className="text-sm">
          <div className="text-gray-900">{row.phone}</div>
          <div className="text-gray-500">📧 {row.email.split('@')[0]}</div>
        </div>
      ),
    },
    {
      header: 'Station Assignment',
      accessor: 'station',
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.station}</div>
          <div className="text-gray-500">🏢 Station Assignment</div>
        </div>
      ),
    },
    {
      header: 'Role & Experience',
      accessor: 'role',
      render: (row) => (
        <div className="text-sm">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === 'Station Manager' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {row.role === 'Station Manager' ? '👨‍💼' : '✅'} {row.role}
          </span>
          <div className="text-gray-500 mt-1">📈 {row.experience}</div>
        </div>
      ),
    },
    {
      header: 'Status & Join Date',
      accessor: 'status',
      render: (row) => (
        <div className="text-sm">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {row.status === 'active' ? '🟢' : '🔴'} {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
          <div className="text-gray-500 mt-1">📅 {new Date(row.joinDate).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            ✏️ Edit
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            🗑️ Delete
          </Button>
        </div>
      ),
    },
  ]
  
  const handleEdit = (officer) => {
    setEditingOfficer(officer)
    reset(officer)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this officer?')) {
      try {
        // API call would go here
        setOfficers(officers.filter(o => o.id !== id))
        toast.success('Officer deleted successfully')
      } catch (error) {
        console.error('Error deleting officer:', error)
        toast.error('Failed to delete officer')
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingOfficer) {
        // Update existing officer
        const updatedOfficers = officers.map(o => 
          o.id === editingOfficer.id ? { ...o, ...data } : o
        )
        setOfficers(updatedOfficers)
        toast.success('Officer updated successfully')
      } else {
        // Add new officer
        const newOfficer = {
          id: officers.length + 1,
          ...data,
          status: 'active',
          joinDate: new Date().toISOString(),
          experience: '0 years'
        }
        setOfficers([...officers, newOfficer])
        toast.success('Officer added successfully')
      }
      
      setIsModalOpen(false)
      setEditingOfficer(null)
      reset()
    } catch (error) {
      console.error('Error saving officer:', error)
      toast.error('Failed to save officer')
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Officers Management</h2>
            <p className="mt-2 text-blue-100">
              Manage polling station officers and their assignments
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                👥 {stats.total} Total Officers
              </span>
              <span className="flex items-center">
                🟢 {stats.active} Active
              </span>
              <span className="flex items-center">
                🏢 {stats.stations} Stations
              </span>
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => {
              setEditingOfficer(null)
              reset()
              setIsModalOpen(true)
            }}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            ➕ Add New Officer
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Officers</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-600">
              Managing {stats.stations} polling stations
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Officers</p>
                <p className="text-3xl font-bold text-green-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600">
              {((stats.active / stats.total) * 100).toFixed(1)}% active rate
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Station Managers</p>
                <p className="text-3xl font-bold text-purple-900">{stats.stationManagers}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <span className="text-2xl">👨‍💼</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-purple-600">
              Leadership roles filled
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Verification Officers</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.verificationOfficers}</p>
              </div>
              <div className="p-3 bg-indigo-500 rounded-full">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-indigo-600">
              Verification specialists
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search officers by name, email, or station..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="Station Manager">Station Managers</option>
                <option value="Verification Officer">Verification Officers</option>
              </select>
              
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stations</option>
                {uniqueStations.map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || filterRole !== 'all' || filterStation !== 'all') && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredOfficers.length} of {officers.length} officers
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterRole('all')
                  setFilterStation('all')
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        <Table
          columns={columns}
          data={filteredOfficers}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingOfficer(null)
          reset()
        }}
        title={
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{editingOfficer ? '✏️' : '➕'}</span>
            <span>{editingOfficer ? 'Edit Officer' : 'Add New Officer'}</span>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="👤 Full Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
            
            <Input
              label="📧 Email Address"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email'
                }
              })}
              error={errors.email?.message}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="📱 Phone Number"
              {...register('phone', { required: 'Phone is required' })}
              error={errors.phone?.message}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏢 Station Assignment
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('station', { required: 'Station is required' })}
              >
                <option value="">Select a station...</option>
                <option value="Central Community Center">Central Community Center</option>
                <option value="Northern Public School">Northern Public School</option>
                <option value="Southern Town Hall">Southern Town Hall</option>
                <option value="Eastern Community Hall">Eastern Community Hall</option>
                <option value="Western Civic Center">Western Civic Center</option>
              </select>
              {errors.station && (
                <p className="mt-1 text-sm text-red-500">{errors.station.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👔 Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('role', { required: 'Role is required' })}
              >
                <option value="">Select a role...</option>
                <option value="Station Manager">👨‍💼 Station Manager</option>
                <option value="Verification Officer">🔍 Verification Officer</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="📈 Experience"
              placeholder="e.g., 3 years"
              {...register('experience')}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingOfficer(null)
                reset()
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {editingOfficer ? '💾 Update Officer' : '➕ Create Officer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Officers