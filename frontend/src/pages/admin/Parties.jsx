import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../services/api'

const Parties = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingParty, setEditingParty] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchParties()
  }, [])
  
  const fetchParties = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/parties')
      // Enrich with placeholder fields for display
      const enriched = response.data.map(p => ({
        id: p.id,
        name: p.name,
        code: p.symbol || p.name.slice(0,3).toUpperCase(),
        symbol: p.symbol || '',
        founded: new Date().getFullYear().toString(),
        leader: '',
        headquarters: '',
        description: '',
        status: 'active',
        color: '#ccc',
        candidates: 0
      }))
      setParties(enriched)
    } catch (error) {
      console.error('Error fetching parties:', error)
      toast.error('Failed to load parties data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: parties.length,
    active: parties.filter(p => p.status === 'active').length,
    totalCandidates: parties.reduce((sum, p) => sum + p.candidates, 0),
    avgCandidatesPerParty: Math.round(parties.reduce((sum, p) => sum + p.candidates, 0) / parties.length || 0),
    oldestParty: parties.reduce((oldest, party) => 
      (!oldest || party.founded < oldest.founded) ? party : oldest, null
    )
  }

  // Filter parties based on search
  const filteredParties = parties.filter(party => 
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const columns = [
    {
      header: 'Party Information',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm"
            style={{ backgroundColor: row.color }}
          >
            {row.code}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{row.name}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">🏛️ {row.code} • Founded {row.founded}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Leadership',
      accessor: 'leader',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium text-gray-900 truncate">👤 {row.leader}</div>
          <div className="text-gray-500 truncate">📍 {row.headquarters}</div>
        </div>
      ),
    },
    {
      header: 'Candidates & Activity',
      accessor: 'candidates',
      render: (row) => (
        <div className="text-xs sm:text-sm">
          <div className="font-medium text-gray-900">
            👥 {row.candidates} Candidates
          </div>
          <div className="text-gray-500">
            📅 {new Date().getFullYear() - parseInt(row.founded)} years active
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
  
  const handleEdit = (party) => {
    setEditingParty(party)
    reset(party)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this party?')) {
      try {
        await api.delete(`/api/parties/${id}`)
        setParties(parties.filter(p => p.id !== id))
        toast.success('Party deleted successfully')
      } catch (error) {
        console.error('Error deleting party:', error)
        toast.error('Failed to delete party')
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingParty) {
        // Update existing party
        await api.put(`/api/parties/${editingParty.id}`, data)
        await fetchParties() // Refresh data from server
        toast.success('Party updated successfully')
      } else {
        // Add new party
        await api.post('/api/parties', data)
        await fetchParties() // Refresh data from server
        toast.success('Party added successfully')
      }
      
      setIsModalOpen(false)
      setEditingParty(null)
      reset()
    } catch (error) {
      console.error('Error saving party:', error)
      toast.error('Failed to save party')
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold">Political Parties Management</h2>
            <p className="mt-2 text-purple-100 text-sm sm:text-base">
              Manage political parties and their organizational details
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center">
                🏛️ {stats.total} Total Parties
              </span>
              <span className="flex items-center">
                👥 {stats.totalCandidates} Candidates
              </span>
              <span className="flex items-center">
                📅 Since {stats.oldestParty?.founded}
              </span>
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => {
              setEditingParty(null)
              reset()
              setIsModalOpen(true)
            }}
            className="bg-white text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
            responsive
          >
            ➕ Add New Party
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">Total Parties</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.total}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-500 rounded-full">
                <span className="text-lg sm:text-2xl">🏛️</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-purple-600">
              {stats.active} active organizations
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-pink-600">Total Candidates</p>
                <p className="text-2xl sm:text-3xl font-bold text-pink-900">{stats.totalCandidates}</p>
              </div>
              <div className="p-2 sm:p-3 bg-pink-500 rounded-full">
                <span className="text-lg sm:text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-pink-600">
              Across all parties
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-red-600">Avg. Candidates</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-900">{stats.avgCandidatesPerParty}</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-500 rounded-full">
                <span className="text-lg sm:text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-600">
              Per party average
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-indigo-600">Oldest Party</p>
                <p className="text-lg sm:text-2xl font-bold text-indigo-900">{stats.oldestParty?.founded}</p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-500 rounded-full">
                <span className="text-lg sm:text-2xl">🏆</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-indigo-600 truncate">
              {stats.oldestParty?.name}
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
                  placeholder="Search parties by name, code, leader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
                />
              </div>
            </div>
            
            {searchTerm && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredParties.length} of {parties.length} parties
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-purple-600 hover:text-purple-800 text-left sm:text-center"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredParties}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingParty(null)
          reset()
        }}
        title={
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{editingParty ? '✏️' : '➕'}</span>
            <span>{editingParty ? 'Edit Party' : 'Add New Party'}</span>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="🏛️ Party Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              className="focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
            />
            
            <Input
              label="🏷️ Party Code"
              placeholder="e.g., PP, CA, LU"
              {...register('code', { required: 'Code is required' })}
              error={errors.code?.message}
              className="focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="👤 Party Leader"
              {...register('leader', { required: 'Leader is required' })}
              error={errors.leader?.message}
              className="focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
            />
            
            <Input
              label="📅 Founded Year"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              {...register('founded', { required: 'Founded year is required' })}
              error={errors.founded?.message}
              className="focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="📍 Headquarters"
              placeholder="e.g., Downtown Capitol Building"
              {...register('headquarters')}
              className="focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎨 Party Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  className="w-12 h-10 sm:h-12 border border-gray-300 rounded-md cursor-pointer"
                  {...register('color', { required: 'Color is required' })}
                />
                <input
                  type="text"
                  placeholder="#3366CC"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[44px]"
                  {...register('color', { required: 'Color is required' })}
                />
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-red-500">{errors.color.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📝 Party Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the party's ideology and key policies..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[88px]"
              {...register('description')}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingParty(null)
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
              className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-h-[44px]"
              fullWidth
            >
              {editingParty ? '💾 Update Party' : '➕ Create Party'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Parties