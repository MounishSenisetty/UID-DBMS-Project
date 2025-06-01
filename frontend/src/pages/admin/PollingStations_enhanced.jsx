// filepath: c:\Users\MOUNISH\Desktop\All\Academics\SEM 4\UID-DBMS-Project\frontend\src\pages\admin\PollingStations.jsx
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
  WifiIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon
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
        const response = await api.get('/api/polling-stations')
        stationsData = response.data
        toast.success('Polling stations data loaded successfully')
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
            established: '2020',
            contactPerson: 'John Smith',
            contactPhone: '555-0123',
            votersCount: 950
          },
          {
            id: 2,
            name: 'Northern Public School',
            code: 'NPS-001',
            constituency: 'Northern District',
            address: '456 Oak Ave, Northside',
            capacity: 800,
            assignedOfficers: 3,
            status: 'active',
            facilities: ['Wheelchair Access', 'Security'],
            established: '2018',
            contactPerson: 'Sarah Johnson',
            contactPhone: '555-0456',
            votersCount: 720
          },
          {
            id: 3,
            name: 'Southern Town Hall',
            code: 'STH-001',
            constituency: 'Southern District',
            address: '789 Pine Rd, Southtown',
            capacity: 1000,
            assignedOfficers: 3,
            status: 'active',
            facilities: ['Wheelchair Access', 'Parking', 'Public Transport'],
            established: '2019',
            contactPerson: 'Mike Davis',
            contactPhone: '555-0789',
            votersCount: 880
          },
          {
            id: 4,
            name: 'Eastern Library',
            code: 'EL-001',
            constituency: 'Eastern District',
            address: '321 Elm St, Eastside',
            capacity: 600,
            assignedOfficers: 2,
            status: 'inactive',
            facilities: ['Wheelchair Access'],
            established: '2021',
            contactPerson: 'Lisa Wilson',
            contactPhone: '555-0321',
            votersCount: 420
          },
          {
            id: 5,
            name: 'Western Community Hall',
            code: 'WCH-001',
            constituency: 'Western District',
            address: '987 River St, Riverside',
            capacity: 900,
            assignedOfficers: 3,
            status: 'active',
            facilities: ['Wheelchair Access', 'Parking'],
            established: '2022',
            contactPerson: 'David Brown',
            contactPhone: '555-0987',
            votersCount: 780
          },
          {
            id: 6,
            name: 'Hillside Elementary',
            code: 'HE-001',
            constituency: 'Hill District',
            address: '147 Hill Road, Hillside',
            capacity: 700,
            assignedOfficers: 2,
            status: 'active',
            facilities: ['Wheelchair Access', 'Cafeteria'],
            established: '2023',
            contactPerson: 'Emily Clark',
            contactPhone: '555-0147',
            votersCount: 580
          }
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
    inactive: stations.filter(s => s.status === 'inactive').length,
    totalCapacity: stations.reduce((sum, s) => sum + s.capacity, 0),
    totalOfficers: stations.reduce((sum, s) => sum + s.assignedOfficers, 0),
    totalVoters: stations.reduce((sum, s) => sum + (s.votersCount || 0), 0),
    avgCapacity: Math.round(stations.reduce((sum, s) => sum + s.capacity, 0) / stations.length || 0),
    constituencies: [...new Set(stations.map(s => s.constituency))].length,
    utilizationRate: stations.length > 0 ? Math.round((stations.reduce((sum, s) => sum + (s.votersCount || 0), 0) / stations.reduce((sum, s) => sum + s.capacity, 0)) * 100) : 0
  }

  // Filter stations
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.constituency.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesConstituency = filterConstituency === 'all' || station.constituency === filterConstituency
    const matchesStatus = filterStatus === 'all' || station.status === filterStatus
    
    return matchesSearch && matchesConstituency && matchesStatus
  })

  // Get unique constituencies for filter
  const uniqueConstituencies = [...new Set(stations.map(s => s.constituency))]
  
  const columns = [
    {
      header: 'Station Details',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-neutral-900">{row.name}</div>
            <div className="text-sm text-neutral-500">{row.code}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Constituency',
      accessor: 'constituency',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <MapPinIcon className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium">{row.constituency}</span>
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: 'address',
      render: (row) => (
        <div className="text-sm text-neutral-600 max-w-xs truncate" title={row.address}>
          {row.address}
        </div>
      ),
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      render: (row) => (
        <div className="text-center">
          <div className="font-medium">{row.capacity.toLocaleString()}</div>
          <div className="text-xs text-neutral-500">
            {row.votersCount ? `${row.votersCount} voters` : 'No data'}
          </div>
        </div>
      ),
    },
    {
      header: 'Officers',
      accessor: 'assignedOfficers',
      render: (row) => (
        <div className="flex items-center justify-center space-x-1">
          <UsersIcon className="w-4 h-4 text-neutral-400" />
          <span className="font-medium">{row.assignedOfficers}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'active' ? (
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          ) : (
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        </div>
      ),
    },
    {
      header: 'Facilities',
      accessor: 'facilities',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.facilities.slice(0, 2).map((facility, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {facility}
            </span>
          ))}
          {row.facilities.length > 2 && (
            <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">
              +{row.facilities.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row)}
            className="flex items-center space-x-1"
          >
            <PencilIcon className="w-3 h-3" />
            <span>Edit</span>
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="flex items-center space-x-1"
          >
            <TrashIcon className="w-3 h-3" />
            <span>Delete</span>
          </Button>
        </div>
      ),
    },
  ]
  
  const handleEdit = (station) => {
    setEditingStation(station)
    reset({
      ...station,
      facilities: station.facilities.join(', ')
    })
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this polling station?')) {
      try {
        // API call would go here
        // await api.delete(`/polling-stations/${id}`)
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
      const stationData = {
        ...data,
        capacity: parseInt(data.capacity),
        facilities: data.facilities.split(',').map(f => f.trim()).filter(f => f),
        votersCount: parseInt(data.votersCount) || 0
      }

      if (editingStation) {
        // Update existing station
        // await api.put(`/polling-stations/${editingStation.id}`, stationData)
        const updatedStations = stations.map(s => 
          s.id === editingStation.id ? { ...s, ...stationData } : s
        )
        setStations(updatedStations)
        toast.success('Polling station updated successfully')
      } else {
        // Add new station
        // const response = await api.post('/polling-stations', stationData)
        const newStation = {
          id: Math.max(...stations.map(s => s.id), 0) + 1,
          ...stationData,
          assignedOfficers: 0,
          status: 'active',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl">
        <div className="px-6 py-8">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">Polling Stations Management</h1>
              <p className="text-blue-100 text-lg">
                Manage polling stations, facilities, and capacity across all constituencies
              </p>
            </div>
            <div className="text-right text-white">
              <div className="text-sm text-blue-100">System Status</div>
              <div className="flex items-center space-x-2 mt-1">
                <WifiIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Stations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {stats.constituencies} constituencies
                </p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Stations</p>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-green-100 text-xs mt-1">
                  {stats.inactive} inactive
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Capacity</p>
                <p className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
                <p className="text-purple-100 text-xs mt-1">
                  Avg: {stats.avgCapacity}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Utilization</p>
                <p className="text-2xl font-bold">{stats.utilizationRate}%</p>
                <p className="text-indigo-100 text-xs mt-1">
                  {stats.totalVoters.toLocaleString()} registered
                </p>
              </div>
              <MapPinIcon className="w-8 h-8 text-indigo-200" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stations by name, code, address, or constituency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <select
                  value={filterConstituency}
                  onChange={(e) => setFilterConstituency(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Constituencies</option>
                  {uniqueConstituencies.map(constituency => (
                    <option key={constituency} value={constituency}>
                      {constituency}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button
                variant="primary"
                onClick={() => {
                  setEditingStation(null)
                  reset()
                  setIsModalOpen(true)
                }}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Station</span>
              </Button>
            </div>
          </div>

          <div className="mb-4 text-sm text-neutral-600">
            Showing {filteredStations.length} of {stats.total} polling stations
          </div>

          <Table
            columns={columns}
            data={filteredStations}
            isLoading={loading}
          />
        </Card>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStation(null)
          reset()
        }}
        title={editingStation ? 'Edit Polling Station' : 'Add Polling Station'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Station Name"
              {...register('name', { required: 'Station name is required' })}
              error={errors.name?.message}
              placeholder="Enter station name"
            />
            
            <Input
              label="Station Code"
              {...register('code', { required: 'Station code is required' })}
              error={errors.code?.message}
              placeholder="e.g., CCC-001"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Constituency"
              {...register('constituency', { required: 'Constituency is required' })}
              error={errors.constituency?.message}
              placeholder="Enter constituency name"
            />
            
            <Input
              label="Capacity"
              type="number"
              {...register('capacity', { 
                required: 'Capacity is required',
                min: { value: 100, message: 'Capacity must be at least 100' }
              })}
              error={errors.capacity?.message}
              placeholder="Enter voter capacity"
            />
          </div>

          <Input
            label="Address"
            {...register('address', { required: 'Address is required' })}
            error={errors.address?.message}
            placeholder="Enter complete address"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              {...register('contactPerson')}
              error={errors.contactPerson?.message}
              placeholder="Enter contact person name"
            />
            
            <Input
              label="Contact Phone"
              {...register('contactPhone')}
              error={errors.contactPhone?.message}
              placeholder="Enter contact phone number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Registered Voters"
              type="number"
              {...register('votersCount')}
              error={errors.votersCount?.message}
              placeholder="Number of registered voters"
            />
            
            <Input
              label="Established Year"
              {...register('established')}
              error={errors.established?.message}
              placeholder="e.g., 2020"
            />
          </div>

          <Input
            label="Facilities (comma-separated)"
            {...register('facilities')}
            error={errors.facilities?.message}
            placeholder="e.g., Wheelchair Access, Parking, Security"
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingStation(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingStation ? 'Update Station' : 'Create Station'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PollingStations
