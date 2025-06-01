import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../services/api'

const Constituencies = () => {
  const [constituencies, setConstituencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConstituency, setEditingConstituency] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchConstituencies()
  }, [])
  
  const fetchConstituencies = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/constituencies')
      setConstituencies(response.data)
    } catch (error) {
      console.error('Error fetching constituencies:', error)
      toast.error('Failed to load constituencies data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: constituencies.length,
    active: constituencies.filter(c => c.status === 'active').length,
    totalVoters: constituencies.reduce((sum, c) => sum + c.registeredVoters, 0),
    totalStations: constituencies.reduce((sum, c) => sum + c.pollingStations, 0),
    avgVotersPerConstituency: Math.round(constituencies.reduce((sum, c) => sum + c.registeredVoters, 0) / constituencies.length || 0)
  }

  // Filter constituencies based on search
  const filteredConstituencies = constituencies.filter(constituency => 
    constituency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    constituency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    constituency.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const columns = [
    { 
      header: 'Constituency',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {row.code.split('-')[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{row.name}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">🏛️ {row.code}</div>
          </div>
        </div>
      ),
    },
    { 
      header: 'Voter Information',
      accessor: 'registeredVoters',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium text-gray-900">
            👥 {row.registeredVoters.toLocaleString()} Voters
          </div>
          <div className="text-gray-500 truncate">
            📍 {row.area}
          </div>
        </div>
      ),
    },
    { 
      header: 'Infrastructure',
      accessor: 'pollingStations',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium text-gray-900">
            🏢 {row.pollingStations} Stations
          </div>
          <div className="text-gray-500">
            📊 {Math.round(row.registeredVoters / row.pollingStations)} voters/station
          </div>
        </div>
      ),
    },
    { 
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <div className="text-xs sm:text-sm text-gray-600 max-w-xs truncate">
          {row.description}
        </div>
      ),
    },
    { 
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status === 'active' ? '🟢' : '🔴'} {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
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
            className="hover:bg-blue-50 hover:text-blue-600 text-xs sm:text-sm min-h-[36px]"
            fullWidth
          >
            ✏️ Edit
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="hover:bg-red-50 hover:text-red-600 text-xs sm:text-sm min-h-[36px]"
            fullWidth
          >
            🗑️ Delete
          </Button>
        </div>
      ),
    },
  ]
  
  const handleEdit = (constituency) => {
    setEditingConstituency(constituency)
    reset(constituency)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this constituency?')) {
      try {
        await api.delete(`/api/constituencies/${id}`)
        setConstituencies(constituencies.filter(c => c.id !== id))
        toast.success('Constituency deleted successfully')
      } catch (error) {
        console.error('Error deleting constituency:', error)
        toast.error('Failed to delete constituency')
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingConstituency) {
        // Update existing constituency
        await api.put(`/api/constituencies/${editingConstituency.id}`, data)
        await fetchConstituencies() // Refresh data from server
        toast.success('Constituency updated successfully')
      } else {
        // Add new constituency
        await api.post('/api/constituencies', data)
        await fetchConstituencies() // Refresh data from server
        toast.success('Constituency added successfully')
      }
      
      setIsModalOpen(false)
      setEditingConstituency(null)
      reset()
    } catch (error) {
      console.error('Error saving constituency:', error)
      toast.error('Failed to save constituency')
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold">Constituencies Management</h2>
            <p className="mt-2 text-green-100 text-sm sm:text-base">
              Manage electoral constituencies and their boundaries
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center">
                🏛️ {stats.total} Total Constituencies
              </span>
              <span className="flex items-center">
                👥 {stats.totalVoters.toLocaleString()} Voters
              </span>
              <span className="flex items-center">
                🏢 {stats.totalStations} Stations
              </span>
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => {
              setEditingConstituency(null)
              reset()
              setIsModalOpen(true)
            }}
            className="bg-white text-green-600 hover:bg-green-50 w-full sm:w-auto"
            responsive
          >
            ➕ Add Constituency
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600">Total Constituencies</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.total}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500 rounded-full">
                <span className="text-lg sm:text-2xl">🏛️</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-green-600">
              {stats.active} active districts
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">Total Voters</p>
                <p className="text-xl sm:text-3xl font-bold text-blue-900">{stats.totalVoters.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500 rounded-full">
                <span className="text-lg sm:text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-600">
              Registered across all districts
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">Polling Stations</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.totalStations}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-500 rounded-full">
                <span className="text-lg sm:text-2xl">🏢</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-purple-600">
              Infrastructure deployed
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-indigo-600">Avg. Voters/District</p>
                <p className="text-lg sm:text-3xl font-bold text-indigo-900">{stats.avgVotersPerConstituency.toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-500 rounded-full">
                <span className="text-lg sm:text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-indigo-600 truncate">
              Distribution analysis
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search constituencies by name, code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[44px]"
                />
              </div>
            </div>
            
            {searchTerm && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredConstituencies.length} of {constituencies.length} constituencies
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-green-600 hover:text-green-800 text-left sm:text-center"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredConstituencies}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingConstituency(null)
          reset()
        }}
        title={
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{editingConstituency ? '✏️' : '➕'}</span>
            <span>{editingConstituency ? 'Edit Constituency' : 'Add New Constituency'}</span>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="🏛️ Constituency Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              className="focus:ring-green-500 focus:border-green-500 min-h-[44px]"
            />
            
            <Input
              label="🏷️ Constituency Code"
              placeholder="e.g., ND-001"
              {...register('code', { required: 'Code is required' })}
              error={errors.code?.message}
              className="focus:ring-green-500 focus:border-green-500 min-h-[44px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="📏 Area (sq km)"
              type="number"
              placeholder="e.g., 245"
              {...register('area')}
              className="focus:ring-green-500 focus:border-green-500 min-h-[44px]"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📊 Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[44px]"
                {...register('status', { required: 'Status is required' })}
              >
                <option value="active">🟢 Active</option>
                <option value="inactive">🔴 Inactive</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📝 Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the constituency boundaries and key areas..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[88px]"
              {...register('description')}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingConstituency(null)
                reset()
              }}
              className="px-6 min-h-[44px]"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 min-h-[44px]"
              fullWidth
            >
              {editingConstituency ? '💾 Update Constituency' : '➕ Create Constituency'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Constituencies