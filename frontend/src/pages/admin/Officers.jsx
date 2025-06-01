import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../services/api'

const Officers = () => {
  const [officers, setOfficers] = useState([])
  const [pollingStations, setPollingStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStation, setFilterStation] = useState('all')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchOfficers()
    fetchPollingStations()
  }, [])
  
  const fetchOfficers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/officers')
      // Normalize data: ensure `pollingStation` key matches server response
      const normalized = response.data.map(o => ({
        ...o,
        pollingStation: o.PollingStation
      }))
      setOfficers(normalized)
    } catch (error) {
      console.error('Error fetching officers:', error)
      toast.error('Failed to load officers data')
    } finally {
      setLoading(false)
    }
  }

  const fetchPollingStations = async () => {
    try {
      const response = await api.get('/api/polling-stations')
      setPollingStations(response.data)
    } catch (error) {
      console.error('Error fetching polling stations:', error)
      toast.error('Failed to load polling stations data')
    }
  }

  // Calculate statistics (adapted for database format)
  const stats = {
    total: officers.length,
    active: officers.filter(o => o.role).length, // All officers with roles are active
    returningOfficers: officers.filter(o => o.role === 'returning_officer').length,
    registrationOfficers: officers.filter(o => o.role === 'registration_officer').length,
    pollingOfficers: officers.filter(o => o.role === 'polling_officer').length,
    presidingOfficers: officers.filter(o => o.role === 'presiding_officer').length,
    stations: [...new Set(officers.map(o => o.pollingStation?.name).filter(Boolean))].length
  }

  // Filter officers based on search and filters
  const filteredOfficers = officers.filter(officer => {
    const officerName = officer.name?.toLowerCase() || ''
    const stationName = (officer.pollingStation?.name || '').toLowerCase()
    
    const matchesSearch = officerName.includes(searchTerm.toLowerCase()) ||
                         stationName.includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || officer.role === filterRole
    const matchesStation = filterStation === 'all' || (officer.pollingStation?.name) === filterStation
    
    return matchesSearch && matchesRole && matchesStation
  })

  // Get unique stations for filter
  const uniqueStations = [...new Set(officers.map(o => o.pollingStation?.name).filter(Boolean))]
  
  const columns = [
    {
      header: 'Officer',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {row.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{row.name}</div>
            <div className="text-xs sm:text-sm text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Station Assignment',
      accessor: 'pollingStation',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium text-gray-900 truncate">
            {row.pollingStation?.name || 'Not assigned'}
          </div>
          <div className="text-gray-500">
            🏢 {row.pollingStation ? 'Station Assignment' : 'No Assignment'}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === 'returning_officer' 
              ? 'bg-purple-100 text-purple-800' 
              : row.role === 'registration_officer'
              ? 'bg-blue-100 text-blue-800'
              : row.role === 'polling_officer'
              ? 'bg-green-100 text-green-800'
              : 'bg-indigo-100 text-indigo-800'
          }`}>
            <span className="hidden sm:inline">
              {row.role === 'returning_officer' ? '👨‍💼 Returning Officer' : 
               row.role === 'registration_officer' ? '📝 Registration Officer' :
               row.role === 'polling_officer' ? '🗳️ Polling Officer' :
               row.role === 'presiding_officer' ? '⚖️ Presiding Officer' :
               '👤 Officer'}
            </span>
            <span className="sm:hidden">
              {row.role === 'returning_officer' ? '👨‍💼' : 
               row.role === 'registration_officer' ? '📝' :
               row.role === 'polling_officer' ? '🗳️' :
               row.role === 'presiding_officer' ? '⚖️' :
               '👤'}
            </span>
          </span>
        </div>
      ),
    },
    {
      header: 'Station Details',
      accessor: 'pollingStationDetails',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          {row.pollingStation ? (
            <>
              <div className="text-gray-900 truncate">📍 {row.pollingStation.area}</div>
              <div className="text-gray-500 mt-1 truncate">Ward: {row.pollingStation.ward}</div>
            </>
          ) : (
            <div className="text-gray-500">No station assigned</div>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row)}
            className="hover:bg-blue-50 hover:text-blue-600"
            responsive
          >
            <span className="sm:hidden">✏️</span>
            <span className="hidden sm:inline">✏️ Edit</span>
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="hover:bg-red-50 hover:text-red-600"
            responsive
          >
            <span className="sm:hidden">🗑️</span>
            <span className="hidden sm:inline">🗑️ Delete</span>
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
        await api.delete(`/api/officers/${id}`)
        await fetchOfficers() // Refresh data from server
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
        await api.put(`/api/officers/${editingOfficer.id}`, data)
        await fetchOfficers() // Refresh data from server
        toast.success('Officer updated successfully')
      } else {
        // Add new officer
        await api.post('/api/officers', data)
        await fetchOfficers() // Refresh data from server
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Officers Management</h2>
            <p className="mt-2 text-blue-100 text-sm sm:text-base">
              Manage polling station officers and their assignments
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
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
            className="bg-white text-blue-600 hover:bg-blue-50 self-start sm:self-auto text-sm sm:text-base"
          >
            <span className="sm:hidden">➕ Add</span>
            <span className="hidden sm:inline">➕ Add New Officer</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">Total Officers</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500 rounded-full">
                <span className="text-lg sm:text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-600">
              Managing {stats.stations} polling stations
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600">Active Officers</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.active}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500 rounded-full">
                <span className="text-lg sm:text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-green-600">
              {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total officers
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">Returning Officers</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.returningOfficers}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-500 rounded-full">
                <span className="text-lg sm:text-2xl">👨‍💼</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-purple-600">
              Senior leadership roles
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-indigo-600">Polling Officers</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-900">{stats.pollingOfficers}</p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-500 rounded-full">
                <span className="text-lg sm:text-2xl">🗳️</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-indigo-600">
              Field operation staff
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search officers by name, email, or station..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
              >
                <option value="all">All Roles</option>
                <option value="returning_officer">Returning Officers</option>
                <option value="registration_officer">Registration Officers</option>
                <option value="polling_officer">Polling Officers</option>
                <option value="presiding_officer">Presiding Officers</option>
              </select>
              
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
              >
                <option value="all">All Stations</option>
                {uniqueStations.map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || filterRole !== 'all' || filterStation !== 'all') && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <p className="text-sm text-gray-600">
                Showing {filteredOfficers.length} of {officers.length} officers
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterRole('all')
                  setFilterStation('all')
                }}
                className="text-sm text-blue-600 hover:text-blue-800 self-start sm:self-auto"
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <Input
            label="👤 Full Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            className="focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👔 Role
              </label>
              <select
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                {...register('role', { required: 'Role is required' })}
              >
                <option value="">Select a role...</option>
                <option value="returning_officer">👨‍💼 Returning Officer</option>
                <option value="registration_officer">📝 Registration Officer</option>
                <option value="polling_officer">🗳️ Polling Officer</option>
                <option value="presiding_officer">⚖️ Presiding Officer</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏢 Station Assignment
              </label>
              <select
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                {...register('pollingStationId', { required: 'Station is required' })}
              >
                <option value="">Select a station...</option>
                {pollingStations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name} - {station.area} ({station.ward})
                  </option>
                ))}
              </select>
              {errors.pollingStationId && (
                <p className="mt-1 text-sm text-red-500">{errors.pollingStationId.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingOfficer(null)
                reset()
              }}
              className="px-6"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              fullWidth
            >
              <span className="sm:hidden">{editingOfficer ? '💾 Update' : '➕ Create'}</span>
              <span className="hidden sm:inline">{editingOfficer ? '💾 Update Officer' : '➕ Create Officer'}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Officers