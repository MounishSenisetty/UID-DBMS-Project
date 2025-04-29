import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const Electors = () => {
  const [electors, setElectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingElector, setEditingElector] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchElectors()
  }, [])
  
  const fetchElectors = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/electors')
      setElectors(response.data)
    } catch (error) {
      console.error('Error fetching electors:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const columns = [
    { 
      header: 'Serial Number', 
      accessor: 'serialNumber',
    },
    { 
      header: 'Name', 
      accessor: 'name',
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
  
  const handleEdit = (elector) => {
    setEditingElector(elector)
    reset(elector)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this elector?')) {
      try {
        await api.delete(`/api/electors/${id}`)
        setElectors(electors.filter(e => e.id !== id))
      } catch (error) {
        console.error('Error deleting elector:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingElector) {
        await api.put(`/api/electors/${editingElector.id}`, data)
        const updatedElectors = electors.map(e => 
          e.id === editingElector.id ? { ...e, ...data } : e
        )
        setElectors(updatedElectors)
      } else {
        const response = await api.post('/api/electors', data)
        setElectors([...electors, response.data])
      }
      
      setIsModalOpen(false)
      setEditingElector(null)
      reset()
    } catch (error) {
      console.error('Error saving elector:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Electors</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage electors and their details
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingElector(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add Elector
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={electors}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingElector(null)
          reset()
        }}
        title={editingElector ? 'Edit Elector' : 'Add Elector'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Serial Number"
            {...register('serialNumber', { required: 'Serial Number is required' })}
            error={errors.serialNumber?.message}
          />
          <Input
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingElector(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingElector ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Electors
