import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const Constituencies = () => {
  const [constituencies, setConstituencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConstituency, setEditingConstituency] = useState(null)
  
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
      alert('Error fetching constituencies: ' + error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const columns = [
    { 
      header: 'ID',
      accessor: 'id',
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
      } catch (error) {
        console.error('Error deleting constituency:', error)
        alert('Error deleting constituency: ' + error.message)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingConstituency) {
        await api.put(`/api/constituencies/${editingConstituency.id}`, data)
        const updatedConstituencies = constituencies.map(c => 
          c.id === editingConstituency.id ? { ...c, ...data } : c
        )
        setConstituencies(updatedConstituencies)
      } else {
        const response = await api.post('/api/constituencies', data)
        setConstituencies([...constituencies, response.data])
      }
      
      setIsModalOpen(false)
      setEditingConstituency(null)
      reset()
    } catch (error) {
      console.error('Error saving constituency:', error)
      alert('Error saving constituency: ' + error.message)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Constituencies</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage electoral constituencies and their boundaries
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingConstituency(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add Constituency
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={constituencies}
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
        title={editingConstituency ? 'Edit Constituency' : 'Add Constituency'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Constituency Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingConstituency(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingConstituency ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Constituencies
