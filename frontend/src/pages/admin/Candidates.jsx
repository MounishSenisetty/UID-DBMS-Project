import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
// import api from '../../services/api'

const Candidates = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchCandidates()
  }, [])
  
  const fetchCandidates = async () => {
    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCandidates([
        {
          id: 1,
          name: 'John Smith',
          party: 'Progressive Party',
          constituency: 'Northern District',
          position: 'Member of Parliament',
          votes: 1245,
          status: 'approved'
        },
        {
          id: 2,
          name: 'Emma Johnson',
          party: 'Conservative Alliance',
          constituency: 'Southern District',
          position: 'Member of Parliament',
          votes: 1102,
          status: 'approved'
        },
        {
          id: 3,
          name: 'Michael Brown',
          party: 'Liberty Union',
          constituency: 'Eastern District',
          position: 'Member of Parliament',
          votes: 897,
          status: 'approved'
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          party: 'Green Future',
          constituency: 'Western District',
          position: 'Member of Parliament',
          votes: 736,
          status: 'approved'
        },
        {
          id: 5,
          name: 'David Lee',
          party: 'Progressive Party',
          constituency: 'Central District',
          position: 'Member of Parliament',
          votes: 1523,
          status: 'approved'
        },
      ])
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Party',
      accessor: 'party',
    },
    {
      header: 'Constituency',
      accessor: 'constituency',
    },
    {
      header: 'Position',
      accessor: 'position',
    },
    {
      header: 'Votes',
      accessor: 'votes',
      render: (row) => row.votes.toLocaleString(),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${row.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
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