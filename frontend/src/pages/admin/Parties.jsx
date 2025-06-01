import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
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
      // Try API call first, fallback to mock data
      let partiesData
      try {
        const response = await api.get('/parties')
        partiesData = response.data
      } catch {
        console.log('API unavailable, using mock data')
        partiesData = [
          {
            id: 1,
            name: 'Progressive Party',
            code: 'PP',
            leader: 'John Smith',
            founded: '1985',
            candidates: 12,
            color: '#3366CC',
            status: 'active',
            description: 'Progressive policies for modern governance',
            headquarters: 'Downtown Capitol Building'
          },
          {
            id: 2,
            name: 'Conservative Alliance',
            code: 'CA',
            leader: 'Emma Johnson',
            founded: '1992',
            candidates: 15,
            color: '#DC3912',
            status: 'active',
            description: 'Traditional values and fiscal responsibility',
            headquarters: 'Heritage Plaza'
          },
          {
            id: 3,
            name: 'Liberty Union',
            code: 'LU',
            leader: 'Michael Brown',
            founded: '1998',
            candidates: 10,
            color: '#FF9900',
            status: 'active',
            description: 'Individual freedom and limited government',
            headquarters: 'Freedom Square'
          },
          {
            id: 4,
            name: 'Green Future',
            code: 'GF',
            leader: 'Sarah Wilson',
            founded: '2005',
            candidates: 8,
            color: '#109618',
            status: 'active',
            description: 'Environmental sustainability and clean energy',
            headquarters: 'Eco Center'
          },
          {
            id: 5,
            name: 'People\'s Democratic Party',
            code: 'PDP',
            leader: 'David Martinez',
            founded: '2010',
            candidates: 6,
            color: '#9900FF',
            status: 'active',
            description: 'Social democracy and workers\' rights',
            headquarters: 'Unity Hall'
          },
          {
            id: 6,
            name: 'Independent Movement',
            code: 'IM',
            leader: 'Lisa Anderson',
            founded: '2018',
            candidates: 3,
            color: '#666666',
            status: 'inactive',
            description: 'Non-partisan independent candidates',
            headquarters: 'Civic Center'
          },
        ]
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setParties(partiesData)
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
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: row.color }}
          >
            {row.code}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">🏛️ {row.code} • Founded {row.founded}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Leadership',
      accessor: 'leader',
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">👤 {row.leader}</div>
          <div className="text-gray-500">📍 {row.headquarters}</div>
        </div>
      ),
    },
    {
      header: 'Candidates & Activity',
      accessor: 'candidates',
      render: (row) => (
        <div className="text-sm">
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
        <div className="text-sm text-gray-600 max-w-xs">
          {row.description}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
  
  const handleEdit = (party) => {
    setEditingParty(party)
    reset(party)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this party?')) {
      try {
        // API call would go here
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
        const updatedParties = parties.map(p => 
          p.id === editingParty.id ? { ...p, ...data } : p
        )
        setParties(updatedParties)
        toast.success('Party updated successfully')
      } else {
        // Add new party
        const newParty = {
          id: parties.length + 1,
          ...data,
          candidates: 0,
          status: 'active',
          headquarters: data.headquarters || 'TBD'
        }
        setParties([...parties, newParty])
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Political Parties Management</h2>
            <p className="mt-2 text-purple-100">
              Manage political parties and their organizational details
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
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
            className="bg-white text-purple-600 hover:bg-purple-50"
          >
            ➕ Add New Party
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Parties</p>
                <p className="text-3xl font-bold text-purple-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <span className="text-2xl">🏛️</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-purple-600">
              {stats.active} active organizations
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">Total Candidates</p>
                <p className="text-3xl font-bold text-pink-900">{stats.totalCandidates}</p>
              </div>
              <div className="p-3 bg-pink-500 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-pink-600">
              Across all parties
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Avg. Candidates</p>
                <p className="text-3xl font-bold text-red-900">{stats.avgCandidatesPerParty}</p>
              </div>
              <div className="p-3 bg-red-500 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600">
              Per party average
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Oldest Party</p>
                <p className="text-2xl font-bold text-indigo-900">{stats.oldestParty?.founded}</p>
              </div>
              <div className="p-3 bg-indigo-500 rounded-full">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-indigo-600">
              {stats.oldestParty?.name}
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search parties by name, code, leader, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            {searchTerm && (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredParties.length} of {parties.length} parties
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-purple-600 hover:text-purple-800"
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="🏛️ Party Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              className="focus:ring-purple-500 focus:border-purple-500"
            />
            
            <Input
              label="🏷️ Party Code"
              placeholder="e.g., PP, CA, LU"
              {...register('code', { required: 'Code is required' })}
              error={errors.code?.message}
              className="focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="👤 Party Leader"
              {...register('leader', { required: 'Leader is required' })}
              error={errors.leader?.message}
              className="focus:ring-purple-500 focus:border-purple-500"
            />
            
            <Input
              label="📅 Founded Year"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              {...register('founded', { required: 'Founded year is required' })}
              error={errors.founded?.message}
              className="focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="📍 Headquarters"
              placeholder="e.g., Downtown Capitol Building"
              {...register('headquarters')}
              className="focus:ring-purple-500 focus:border-purple-500"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎨 Party Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  {...register('color', { required: 'Color is required' })}
                />
                <input
                  type="text"
                  placeholder="#3366CC"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              {...register('description')}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingParty(null)
                reset()
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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