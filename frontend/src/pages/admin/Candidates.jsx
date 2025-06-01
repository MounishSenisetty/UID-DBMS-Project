import { useState, useEffect, useCallback } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
// import api from '../../services/api'

const Candidates = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterParty, setFilterParty] = useState('all')
  const [filterConstituency, setFilterConstituency] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    byParty: {},
    byConstituency: {}
  })
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])
  
  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      // Try to fetch from API first
      const response = await fetch('/api/candidates')
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
        calculateStats(data)
      } else {
        // Fallback to mock data
        const mockData = [
          {
            id: 1,
            name: 'John Smith',
            party: 'Progressive Party',
            constituency: 'Northern District',
            position: 'Member of Parliament',
            votes: 1245,
            status: 'approved',
            age: 45,
            qualification: 'MBA, Harvard'
          },
          {
            id: 2,
            name: 'Emma Johnson',
            party: 'Conservative Alliance',
            constituency: 'Southern District',
            position: 'Member of Parliament',
            votes: 1102,
            status: 'approved',
            age: 38,
            qualification: 'LLB, Oxford'
          },
          {
            id: 3,
            name: 'Michael Brown',
            party: 'Liberty Union',
            constituency: 'Eastern District',
            position: 'Member of Parliament',
            votes: 897,
            status: 'approved',
            age: 52,
            qualification: 'PhD Economics'
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            party: 'Green Future',
            constituency: 'Western District',
            position: 'Member of Parliament',
            votes: 736,
            status: 'pending',
            age: 41,
            qualification: 'MSc Environmental Science'
          },
          {
            id: 5,
            name: 'David Lee',
            party: 'Progressive Party',
            constituency: 'Central District',
            position: 'Member of Parliament',
            votes: 1523,
            status: 'approved',
            age: 49,
            qualification: 'MBA Finance'
          },
        ]
        setCandidates(mockData)
        calculateStats(mockData)
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
      toast.error('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }, [])
  
  const calculateStats = (candidateData) => {
    const byParty = {}
    const byConstituency = {}
    
    candidateData.forEach(candidate => {
      byParty[candidate.party] = (byParty[candidate.party] || 0) + 1
      byConstituency[candidate.constituency] = (byConstituency[candidate.constituency] || 0) + 1
    })
    
    setStats({
      total: candidateData.length,
      byParty,
      byConstituency
    })
  }
  
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.constituency.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesParty = filterParty === 'all' || candidate.party === filterParty
    const matchesConstituency = filterConstituency === 'all' || candidate.constituency === filterConstituency
    
    return matchesSearch && matchesParty && matchesConstituency
  })
  
  const columns = [
    {
      header: 'Candidate',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">Age: {row.age}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Party',
      accessor: 'party',
      render: (row) => (
        <div>
          <div className="font-medium">{row.party}</div>
          <div className="text-sm text-gray-500">{row.qualification}</div>
        </div>
      ),
    },
    {
      header: 'Constituency',
      accessor: 'constituency',
    },
    {
      header: 'Votes',
      accessor: 'votes',
      render: (row) => (
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{row.votes.toLocaleString()}</div>
          <div className="text-sm text-gray-500">votes</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
          row.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
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
          >
            ✏️ Edit
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            🗑️ Delete
          </Button>
        </div>
      ),
    },
  ]
  
  const handleEdit = (candidate) => {
    setEditingCandidate(candidate)
    reset(candidate)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        // API call would go here
        setCandidates(candidates.filter(c => c.id !== id))
      } catch (error) {
        console.error('Error deleting candidate:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingCandidate) {
        // Update existing candidate
        const updatedCandidates = candidates.map(c => 
          c.id === editingCandidate.id ? { ...c, ...data } : c
        )
        setCandidates(updatedCandidates)
      } else {
        // Add new candidate
        const newCandidate = {
          id: candidates.length + 1,
          ...data,
          votes: 0,
          status: 'pending'
        }
        setCandidates([...candidates, newCandidate])
      }
      
      setIsModalOpen(false)
      setEditingCandidate(null)
      reset()
    } catch (error) {
      console.error('Error saving candidate:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Candidates</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage election candidates and their details
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingCandidate(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add Candidate
        </Button>
      </div>
      
      <Card>
        <div className="mb-4 flex space-x-4">
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterParty}
            onChange={(e) => setFilterParty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Parties</option>
            <option value="Progressive Party">Progressive Party</option>
            <option value="Conservative Alliance">Conservative Alliance</option>
            <option value="Liberty Union">Liberty Union</option>
            <option value="Green Future">Green Future</option>
          </select>
          <select
            value={filterConstituency}
            onChange={(e) => setFilterConstituency(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Constituencies</option>
            <option value="Northern District">Northern District</option>
            <option value="Southern District">Southern District</option>
            <option value="Eastern District">Eastern District</option>
            <option value="Western District">Western District</option>
            <option value="Central District">Central District</option>
          </select>
        </div>
        
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Candidates</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(stats.byParty).length}
            </div>
            <div className="text-sm text-gray-600">Parties</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(stats.byConstituency).length}
            </div>
            <div className="text-sm text-gray-600">Constituencies</div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredCandidates}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCandidate(null)
          reset()
        }}
        title={editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Candidate Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <Input
            label="Party"
            {...register('party', { required: 'Party is required' })}
            error={errors.party?.message}
          />
          
          <Input
            label="Constituency"
            {...register('constituency', { required: 'Constituency is required' })}
            error={errors.constituency?.message}
          />
          
          <Input
            label="Position"
            {...register('position', { required: 'Position is required' })}
            error={errors.position?.message}
          />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingCandidate(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingCandidate ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Candidates