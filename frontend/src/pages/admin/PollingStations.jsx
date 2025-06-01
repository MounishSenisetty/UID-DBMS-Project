import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const PollingStations = () => {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStation, setEditingStation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterConstituency, setFilterConstituency] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchStations()
  }, [])
  
  const fetchStations = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/polling-stations')
      // Transform backend model to UI shape
      const stationsData = response.data.map(ps => ({
        id: ps.id,
        name: ps.name,
        code: ps.ward,                 // use ward as code
        address: ps.area,              // area as address
        constituency: ps.Constituency?.name || '',
        established: new Date(ps.createdAt).getFullYear(),
        capacity: ps.capacity || 0,
        assignedOfficers: ps.assignedOfficers || 0
      }))
      setStations(stationsData)
    } catch (error) {
      console.error('Error fetching polling stations:', error)
      toast.error('Failed to load polling stations data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: stations.length,
    active: stations.filter(s => s.status === 'active').length,
    totalCapacity: stations.reduce((sum, s) => sum + (s.capacity || 0), 0),
    totalOfficers: stations.reduce((sum, s) => sum + (s.assignedOfficers || 0), 0),
    avgCapacity: Math.round(stations.reduce((sum, s) => sum + (s.capacity || 0), 0) / stations.length || 0),
    constituencies: [...new Set(stations.map(s => s.Constituency?.name || s.constituency).filter(Boolean))].length
  }

  // Filter stations
  const filteredStations = stations.filter(station => {
    const stationName = station.name?.toLowerCase() || ''
    const stationCode = station.code?.toLowerCase() || ''
    const stationAddress = station.address?.toLowerCase() || ''
    const constituencyName = station.Constituency?.name || station.constituency || ''
    
    const matchesSearch = stationName.includes(searchTerm.toLowerCase()) ||
                         stationCode.includes(searchTerm.toLowerCase()) ||
                         stationAddress.includes(searchTerm.toLowerCase())
    const matchesConstituency = filterConstituency === 'all' || constituencyName === filterConstituency
    
    return matchesSearch && matchesConstituency
  })

  // Get unique constituencies for filter
  const uniqueConstituencies = [...new Set(stations.map(s => s.Constituency?.name || s.constituency).filter(Boolean))]
  
  const columns = [
    {
      header: 'Station Info',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg">
            🏢
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{row.name}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">📍 {row.code}</div>
            <div className="text-xs text-gray-400 mt-1">Est. {row.established}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Location & Constituency',
      accessor: 'constituency',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium text-gray-900 mb-1 truncate">
            🗳️ {row.constituency}
          </div>
          <div className="text-gray-500 text-xs leading-relaxed truncate">
            📮 {row.address}
          </div>
        </div>
      ),
    },
    {
      header: 'Capacity & Staffing',
      accessor: 'capacity',
      render: (row) => (
        <div className="text-xs sm:text-sm space-y-1">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium text-gray-900">{row.capacity.toLocaleString()}</span>
            <span className="text-gray-500 text-xs">voters</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <BuildingOfficeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{row.assignedOfficers}</span>
            <span className="text-gray-500 text-xs">officers</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Facilities & Status',
      accessor: 'status',
      render: (row) => {
        const statusText = row.status
          ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
          : 'Unknown';
        const facilities = row.facilities || [];
        return (
          <div className="space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {row.status === 'active'
                ? <CheckCircleIcon className="w-3 h-3 mr-1" />
                : <ExclamationTriangleIcon className="w-3 h-3 mr-1" />}
              {statusText}
            </span>
            <div className="flex flex-wrap gap-1">
              {facilities.slice(0, 2).map((facility, index) => (
                <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                  {facility.includes('Wheelchair') ? '♿' :
                   facility.includes('Parking') ? '🅿️' :
                   facility.includes('Security') ? '🔒' :
                   facility.includes('Generator') ? '⚡' : '📶'}
                  {facility.split(' ')[0]}
                </span>
              ))}
              {facilities.length > 2 && (
                <span className="text-xs text-gray-500">+{facilities.length - 2}</span>
              )}
            </div>
          </div>
        )
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row)}
            responsive
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">Edit</span>
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            responsive
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">Delete</span>
          </Button>
        </div>
      ),
    },
  ]
  
  const handleEdit = (station) => {
    setEditingStation(station)
    reset(station)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/polling-stations/${id}`)
      toast.success('Polling station deleted successfully')
      fetchStations()
    } catch (error) {
      console.error('Error deleting polling station:', error)
      toast.error('Failed to delete polling station')
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingStation) {
        // Update existing station
        await api.put(`/api/polling-stations/${editingStation.id}`, data)
        toast.success('Polling station updated successfully')
      } else {
        // Add new station
        await api.post('/api/polling-stations', data)
        toast.success('Polling station created successfully')
      }
      fetchStations()
      setIsModalOpen(false)
      reset()
    } catch (error) {
      console.error('Error saving polling station:', error)
      toast.error('Failed to save polling station')
    }
  }
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-xl text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">🏢 Polling Stations Management</h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Monitor and manage all polling stations across constituencies
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingStation(null)
              reset()
              setIsModalOpen(true)
            }}
            responsive
            className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Add New Station</span>
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Stations</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <BuildingOfficeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Active Stations</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Capacity</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalCapacity.toLocaleString()}</p>
              </div>
              <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs sm:text-sm font-medium">Staff Assigned</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalOfficers}</p>
              </div>
              <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs sm:text-sm font-medium">Avg Capacity</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.avgCapacity.toLocaleString()}</p>
              </div>
              <MapPinIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-xs sm:text-sm font-medium">Constituencies</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.constituencies}</p>
              </div>
              <MapPinIcon className="w-6 h-6 sm:w-8 sm:h-8 text-pink-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card padding="sm" className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stations, codes, or addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 w-full text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={filterConstituency}
              onChange={(e) => setFilterConstituency(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Constituencies</option>
              {uniqueConstituencies.map(constituency => (
                <option key={constituency} value={constituency}>{constituency}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-200 gap-2 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredStations.length}</span> of <span className="font-semibold text-gray-900">{stats.total}</span> stations
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-semibold text-green-600">{stats.active}</span> active • 
            <span className="font-semibold text-gray-600 ml-1">{stats.total - stats.active}</span> inactive
          </div>
        </div>
      </Card>

      {/* Enhanced Table */}
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={filteredStations}
          isLoading={loading}
        />
      </Card>

      {/* Enhanced Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStation(null)
          reset()
        }}
        title={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {editingStation ? <PencilIcon className="w-5 h-5 text-white" /> : <PlusIcon className="w-5 h-5 text-white" />}
            </div>
            <span>{editingStation ? 'Edit Polling Station' : 'Add New Polling Station'}</span>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Station Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              placeholder="Enter station name"
            />
            
            <Input
              label="Station Code"
              {...register('code', { required: 'Code is required' })}
              error={errors.code?.message}
              placeholder="e.g., CCC-001"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Constituency"
              {...register('constituency', { required: 'Constituency is required' })}
              error={errors.constituency?.message}
              placeholder="Select constituency"
            />
            
            <Input
              label="Voter Capacity"
              type="number"
              {...register('capacity', { 
                required: 'Capacity is required',
                min: { value: 100, message: 'Capacity must be at least 100' }
              })}
              error={errors.capacity?.message}
              placeholder="Maximum voters"
            />
          </div>
          
          <Input
            label="Address"
            {...register('address', { required: 'Address is required' })}
            error={errors.address?.message}
            placeholder="Full address of the polling station"
          />
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingStation(null)
                reset()
              }}
              responsive
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              responsive
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:order-2"
            >
              {editingStation ? '✏️ Update Station' : '➕ Create Station'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PollingStations