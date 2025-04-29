import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const Candidates = () => {
  const [candidates, setCandidates] = useState([])
  const [parties, setParties] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchCandidates()
    fetchParties()
    fetchConstituencies()
  }, [])
  
  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/candidates')
      setCandidates(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
      alert('Error fetching candidates: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchParties = async () => {
    try {
      const response = await api.get('/api/parties')
      setParties(response.data)
    } catch (error) {
      console.error('Error fetching parties:', error)
    }
  }

  const fetchConstituencies = async () => {
    try {
      const response = await api.get('/api/constituencies')
      setConstituencies(response.data)
    } catch (error) {
      console.error('Error fetching constituencies:', error)
    }
  }
  
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Party',
      accessor: 'partyName',
      render: (row) => row.partyName || '',
    },
    {
      header: 'Constituency',
      accessor: 'constituencyName',
      render: (row) => row.constituencyName || '',
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
            Edit
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Delete
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
      } catch (error) {
        console.error('Error deleting candidate:', error)
        alert('Error deleting candidate: ' + error.message)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingCandidate) {
        await api.put(`/api/candidates/${editingCandidate.id}`, data)
        const updatedCandidates = candidates.map(c => 
          c.id === editingCandidate.id ? { ...c, ...data } : c
        )
        setCandidates(updatedCandidates)
      } else {
        const response = await api.post('/api/candidates', data)
        setCandidates([...candidates, response.data])
      }
      
      setIsModalOpen(false)
      setEditingCandidate(null)
      reset()
    } catch (error) {
      console.error('Error saving candidate:', error)
      alert('Error saving candidate: ' + error.message)
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
        <Table
          columns={columns}
          data={candidates}
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
          
          <label className="block mb-2 font-medium text-gray-700">Party</label>
          <select
            {...register('partyId', { required: 'Party is required' })}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select a party</option>
            {parties.map((party) => (
              <option key={party.id} value={party.id}>
                {party.name}
              </option>
            ))}
          </select>
          {errors.partyId && <p className="text-red-600 text-sm mt-1">{errors.partyId.message}</p>}

          <label className="block mb-2 font-medium text-gray-700">Constituency</label>
          <select
            {...register('constituencyId', { required: 'Constituency is required' })}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select a constituency</option>
            {constituencies.map((constituency) => (
              <option key={constituency.id} value={constituency.id}>
                {constituency.name}
              </option>
            ))}
          </select>
          {errors.constituencyId && <p className="text-red-600 text-sm mt-1">{errors.constituencyId.message}</p>}
          
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
