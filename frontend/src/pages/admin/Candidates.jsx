import { useState, useEffect, useCallback } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../services/api'

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
  const [partiesList, setPartiesList] = useState([])
  const [constituenciesList, setConstituenciesList] = useState([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/candidates')
      setCandidates(response.data)
      calculateStats(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
      toast.error('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCandidates()
    fetchPartiesList()
    fetchConstituenciesList()
  }, [fetchCandidates])

  const fetchPartiesList = async () => {
    try {
      const res = await api.get('/api/parties')
      setPartiesList(res.data)
    } catch (err) {
      console.error('Error fetching parties list', err)
    }
  }
  const fetchConstituenciesList = async () => {
    try {
      const res = await api.get('/api/constituencies')
      setConstituenciesList(res.data)
    } catch (err) {
      console.error('Error fetching constituencies list', err)
    }
  }

  const calculateStats = (candidateData) => {
    const byParty = {}
    const byConstituency = {}

    candidateData.forEach(candidate => {
      const partyName = candidate.Party?.name || candidate.party || 'Unknown'
      const constituencyName = candidate.Constituency?.name || candidate.constituency || 'Unknown'

      byParty[partyName] = (byParty[partyName] || 0) + 1
      byConstituency[constituencyName] = (byConstituency[constituencyName] || 0) + 1
    })

    setStats({
      total: candidateData.length,
      byParty,
      byConstituency
    })
  }

  const filteredCandidates = candidates.filter(candidate => {
    const candidateName = candidate.name?.toLowerCase() || ''
    const partyName = (candidate.Party?.name || candidate.party || '').toLowerCase()
    const constituencyName = (candidate.Constituency?.name || candidate.constituency || '').toLowerCase()

    const matchesSearch = candidateName.includes(searchTerm.toLowerCase()) ||
                         partyName.includes(searchTerm.toLowerCase()) ||
                         constituencyName.includes(searchTerm.toLowerCase())
    const matchesParty = filterParty === 'all' || (candidate.Party?.name || candidate.party) === filterParty
    const matchesConstituency = filterConstituency === 'all' || (candidate.Constituency?.name || candidate.constituency) === filterConstituency

    return matchesSearch && matchesParty && matchesConstituency
  })

  const columns = [
    {
      header: 'Candidate',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 text-sm sm:text-base">
            {row.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{row.name}</div>
            <div className="text-xs sm:text-sm text-gray-500">Age: {row.age || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Party',
      accessor: 'party',
      render: (row) => (
        <div>
          <div className="font-medium text-sm sm:text-base truncate">{row.Party?.name || row.party || 'Independent'}</div>
          <div className="text-xs sm:text-sm text-gray-500 truncate">{row.qualification || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Constituency',
      accessor: 'constituency',
      render: (row) => (
        <div className="font-medium text-sm sm:text-base truncate">{row.Constituency?.name || row.constituency || 'N/A'}</div>
      ),
    },
    {
      header: 'Votes',
      accessor: 'votes',
      render: (row) => (
        <div className="text-center">
          <div className="text-base sm:text-lg font-bold text-gray-900">{(row.votes || 0).toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-gray-500">votes</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
          row.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : 'Unknown'
          }
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
            responsive
          >
            <span className="sm:hidden">✏️</span>
            <span className="hidden sm:inline">✏️ Edit</span>
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
            responsive
          >
            <span className="sm:hidden">🗑️</span>
            <span className="hidden sm:inline">🗑️ Delete</span>
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
        await api.delete(`/api/candidates/${id}`)
        setCandidates(candidates.filter(c => c.id !== id))
        toast.success('Candidate deleted successfully')
      } catch (error) {
        console.error('Error deleting candidate:', error)
        toast.error('Failed to delete candidate')
      }
    }
  }

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      partyId: data.partyId,
      constituencyId: data.constituencyId
    }
    try {
      if (editingCandidate) {
        // Update existing candidate
        await api.put(`/api/candidates/${editingCandidate.id}`, payload)
        toast.success('Candidate updated successfully')
      } else {
        // Add new candidate
        await api.post('/api/candidates', payload)
        toast.success('Candidate added successfully')
      }
      await fetchCandidates()
      setIsModalOpen(false)
      reset()
    } catch (error) {
      console.error('Error saving candidate:', error)
      toast.error('Failed to save candidate')
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Candidates</h2>
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
          className="self-start sm:self-auto"
        >
          Add Candidate
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <select
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Constituencies</option>
              <option value="Northern District">Northern District</option>
              <option value="Southern District">Southern District</option>
              <option value="Eastern District">Eastern District</option>
              <option value="Western District">Western District</option>
              <option value="Central District">Central District</option>
            </select>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Candidates</div>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {Object.keys(stats.byParty).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Parties</div>
          </div>
          <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {Object.keys(stats.byConstituency).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Constituencies</div>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Candidate Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party</label>
              <select
                {...register('partyId', { required: 'Party is required' })}
                className="w-full border border-gray-300 rounded p-3 text-sm min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Party</option>
                {partiesList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.partyId && <p className="text-red-500 text-sm mt-1">{errors.partyId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Constituency</label>
              <select
                {...register('constituencyId', { required: 'Constituency is required' })}
                className="w-full border border-gray-300 rounded p-3 text-sm min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Constituency</option>
                {constituenciesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.constituencyId && <p className="text-red-500 text-sm mt-1">{errors.constituencyId.message}</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => { setIsModalOpen(false); reset(); }}
              fullWidth
              className="sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              fullWidth
              className="sm:w-auto"
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