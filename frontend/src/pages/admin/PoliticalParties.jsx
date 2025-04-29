import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const PoliticalParties = () => {
  const [politicalParties, setPoliticalParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingParty, setEditingParty] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchPoliticalParties()
  }, [])
  
  const fetchPoliticalParties = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/politicalParties')
      setPoliticalParties(response.data)
    } catch (error) {
      console.error('Error fetching political parties:', error)
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
      header: 'Abbreviation',
      accessor: 'abbreviation',
    },
    {
      header: 'Founded Year',
      accessor: 'foundedYear',
    },
    {
      header: 'Ideology',
      accessor: 'ideology',
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
    if (window.confirm('Are you sure you want to delete this political party?')) {
      try {
        await api.delete(`/api/politicalParties/${id}`)
        setPoliticalParties(politicalParties.filter(p => p.id !== id))
      } catch (error) {
        console.error('Error deleting political party:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingParty) {
        await api.put(`/api/politicalParties/${editingParty.id}`, data)
        const updatedParties = politicalParties.map(p => 
          p.id === editingParty.id ? { ...p, ...data } : p
        )
        setPoliticalParties(updatedParties)
      } else {
        const response = await api.post('/api/politicalParties', data)
        setPoliticalParties([...politicalParties, response.data])
      }
      
      setIsModalOpen(false)
      setEditingParty(null)
      reset()
    } catch (error) {
      console.error('Error saving political party:', error)
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
          Add Political Party
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={politicalParties}
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
        title={editingParty ? 'Edit Political Party' : 'Add Political Party'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Abbreviation"
            {...register('abbreviation')}
            error={errors.abbreviation?.message}
          />
          <Input
            label="Founded Year"
            type="number"
            {...register('foundedYear')}
            error={errors.foundedYear?.message}
          />
          <Input
            label="Ideology"
            {...register('ideology')}
            error={errors.ideology?.message}
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

export default PoliticalParties
