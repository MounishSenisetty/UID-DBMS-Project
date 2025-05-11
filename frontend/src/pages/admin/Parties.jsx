import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
//import api from '../../services/api'

const Parties = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingParty, setEditingParty] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchParties()
  }, [])
  
  const fetchParties = async () => {
    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setParties([
        {
          id: 1,
          name: 'Progressive Party',
          code: 'PP',
          leader: 'John Smith',
          founded: '1985',
          candidates: 12,
          color: '#3366CC',
          status: 'active'
        },
        {
          id: 2,
          name: 'Conservative Alliance',
          code: 'CA',
          leader: 'Emma Johnson',
          founded: '1992',
          candidates: 15,
          color: '#DC3912',
          status: 'active'
        },
        {
          id: 3,
          name: 'Liberty Union',
          code: 'LU',
          leader: 'Michael Brown',
          founded: '1998',
          candidates: 10,
          color: '#FF9900',
          status: 'active'
        },
        {
          id: 4,
          name: 'Green Future',
          code: 'GF',
          leader: 'Sarah Wilson',
          founded: '2005',
          candidates: 8,
          color: '#109618',
          status: 'active'
        },
      ])
    } catch (error) {
      console.error('Error fetching parties:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: row.color }}
          ></div>
          {row.name}
        </div>
      ),
    },
    {
      header: 'Code',
      accessor: 'code',
    },
    {
      header: 'Leader',
      accessor: 'leader',
    },
    {
      header: 'Founded',
      accessor: 'founded',
    },
    {
      header: 'Candidates',
      accessor: 'candidates',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : 'badge-error'}`}>
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
      } catch (error) {
        console.error('Error deleting party:', error)
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
      } else {
        // Add new party
        const newParty = {
          id: parties.length + 1,
          ...data,
          candidates: 0,
          status: 'active'
        }
        setParties([...parties, newParty])
      }
      
      setIsModalOpen(false)
      setEditingParty(null)
      reset()
    } catch (error) {
      console.error('Error saving party:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Political Parties</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage political parties and their details
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingParty(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add Party
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={parties}
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
        title={editingParty ? 'Edit Party' : 'Add Party'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Party Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <Input
            label="Party Code"
            {...register('code', { required: 'Code is required' })}
            error={errors.code?.message}
          />
          
          <Input
            label="Party Leader"
            {...register('leader', { required: 'Leader is required' })}
            error={errors.leader?.message}
          />
          
          <Input
            label="Founded Year"
            {...register('founded', { required: 'Founded year is required' })}
            error={errors.founded?.message}
          />
          
          <Input
            label="Party Color"
            type="color"
            {...register('color', { required: 'Color is required' })}
            error={errors.color?.message}
          />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingParty(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingParty ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Parties