import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
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
      // Try API call first, fallback to mock data
      let stationsData
      try {
        const response = await api.get('/polling-stations')
        stationsData = response.data
      } catch {
        console.log('API unavailable, using mock data')
        stationsData = [
          {
            id: 1,
            name: 'Central Community Center',
            code: 'CCC-001',
            constituency: 'Central District',
            address: '123 Main St, Central City',
            capacity: 1200,
            assignedOfficers: 4,
            status: 'active',
            facilities: ['Wheelchair Access', 'Parking', 'Security'],
            established: '2020'
          },
          {
            id: 2,
            name: 'Northern Public School',
            code: 'NPS-001',
            constituency: 'Northern District',
            address: '456 North Ave, Northern City',
            capacity: 800,
            assignedOfficers: 3,
            status: 'active',
            facilities: ['Wheelchair Access', 'Cafeteria'],
            established: '2019'
          },
          {
            id: 3,
            name: 'Southern Town Hall',
            code: 'STH-001',
            constituency: 'Southern District',
            address: '789 South St, Southern City',
            capacity: 1500,
            assignedOfficers: 5,
            status: 'active',
            facilities: ['Wheelchair Access', 'Parking', 'Security', 'Generator'],
            established: '2018'
          },
          {
            id: 4,
            name: 'Eastern Community Hall',
            code: 'ECH-001',
            constituency: 'Eastern District',
            address: '321 East Rd, Eastern City',
            capacity: 1000,
            assignedOfficers: 4,
            status: 'active',
            facilities: ['Wheelchair Access', 'Parking'],
            established: '2021'
          },
          {
            id: 5,
            name: 'Western Civic Center',
            code: 'WCC-001',
            constituency: 'Western District',
            address: '654 West Blvd, Western City',
            capacity: 900,
            assignedOfficers: 3,
            status: 'active',
            facilities: ['Parking', 'Security'],
            established: '2020'
          },
          {
            id: 6,
            name: 'Riverside Elementary',
            code: 'RE-001',
            constituency: 'Riverside District',
            address: '987 River St, Riverside',
            capacity: 600,
            assignedOfficers: 2,
            status: 'inactive',
            facilities: ['Wheelchair Access'],
            established: '2022'
          },
        ]
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))
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
    totalCapacity: stations.reduce((sum, s) => sum + s.capacity, 0),
    totalOfficers: stations.reduce((sum, s) => sum + s.assignedOfficers, 0),
    avgCapacity: Math.round(stations.reduce((sum, s) => sum + s.capacity, 0) / stations.length || 0),
    constituencies: [...new Set(stations.map(s => s.constituency))].length
  }

  // Filter stations
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesConstituency = filterConstituency === 'all' || station.constituency === filterConstituency
    
    return matchesSearch && matchesConstituency
  })

  // Get unique constituencies for filter
  const uniqueConstituencies = [...new Set(stations.map(s => s.constituency))]
  
  const columns = [
    {
      header: 'Station Info',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            🏢
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">📍 {row.code}</div>
            <div className="text-xs text-gray-400 mt-1">Est. {row.established}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Location & Constituency',
      accessor: 'constituency',
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900 mb-1">
            🗳️ {row.constituency}
          </div>
          <div className="text-gray-500 text-xs leading-relaxed">
            📮 {row.address}
          </div>
        </div>
      ),
    },
    {
      header: 'Capacity & Staffing',
      accessor: 'capacity',
      render: (row) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">{row.capacity.toLocaleString()}</span>
            <span className="text-gray-500">voters</span>
          </div>
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-700">{row.assignedOfficers}</span>
            <span className="text-gray-500">officers</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Facilities & Status',
      accessor: 'status',
      render: (row) => (
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {row.status === 'active' ? <CheckCircleIcon className="w-3 h-3 mr-1" /> : <ExclamationTriangleIcon className="w-3 h-3 mr-1" />}
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
          <div className="flex flex-wrap gap-1">
            {row.facilities.slice(0, 2).map((facility, index) => (
              <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                {facility.includes('Wheelchair') ? '♿' : 
                 facility.includes('Parking') ? '🅿️' : 
                 facility.includes('Security') ? '🔒' : 
                 facility.includes('Generator') ? '⚡' : '📶'} 
                {facility.split(' ')[0]}
              </span>
            ))}
            {row.facilities.length > 2 && (
              <span className="text-xs text-gray-500">+{row.facilities.length - 2}</span>
            )}
          </div>
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
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Delete
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
    if (window.confirm('Are you sure you want to delete this polling station? This action cannot be undone.')) {
      try {
        // API call would go here
        setStations(stations.filter(s => s.id !== id))
        toast.success('Polling station deleted successfully')
      } catch (error) {
        console.error('Error deleting polling station:', error)
        toast.error('Failed to delete polling station')
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingStation) {
        // Update existing station
        const updatedStations = stations.map(s => 
          s.id === editingStation.id ? { ...s, ...data } : s
        )
        setStations(updatedStations)
        toast.success('Polling station updated successfully')
      } else {
        // Add new station
        const newStation = {
          id: stations.length + 1,
          ...data,
          assignedOfficers: 0,
          status: 'active',
          facilities: ['Wheelchair Access', 'Parking'],
          established: new Date().getFullYear().toString()
        }
        setStations([...stations, newStation])
        toast.success('Polling station created successfully')
      }
      
      setIsModalOpen(false)
      setEditingStation(null)
      reset()
    } catch (error) {
      console.error('Error saving polling station:', error)
      toast.error('Failed to save polling station')
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏢 Polling Stations Management</h1>
            <p className="text-blue-100 text-lg">
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
            className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Station
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Stations</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Stations</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Capacity</p>
                <p className="text-2xl font-bold text-white">{stats.totalCapacity.toLocaleString()}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Staff Assigned</p>
                <p className="text-2xl font-bold text-white">{stats.totalOfficers}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Avg Capacity</p>
                <p className="text-2xl font-bold text-white">{stats.avgCapacity.toLocaleString()}</p>
              </div>
              <MapPinIcon className="w-8 h-8 text-indigo-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Constituencies</p>
                <p className="text-2xl font-bold text-white">{stats.constituencies}</p>
              </div>
              <MapPinIcon className="w-8 h-8 text-pink-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stations, codes, or addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterConstituency}
              onChange={(e) => setFilterConstituency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Constituencies</option>
              {uniqueConstituencies.map(constituency => (
                <option key={constituency} value={constituency}>{constituency}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredStations.length}</span> of <span className="font-semibold text-gray-900">{stats.total}</span> stations
          </div>
          <div className="text-sm text-gray-600">
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingStation(null)
                reset()
              }}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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