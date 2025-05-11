import React, { useState, useEffect } from 'react'
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
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConstituencies([
        { 
          id: 1, 
          name: 'Northern District', 
          code: 'ND-001',
          registeredVoters: 5234,
          pollingStations: 8,
          status: 'active'
        },
        { 
          id: 2, 
          name: 'Southern District', 
          code: 'SD-001',
          registeredVoters: 4876,
          pollingStations: 7,
          status: 'active'
        },
        { 
          id: 3, 
          name: 'Eastern District', 
          code: 'ED-001',
          registeredVoters: 3987,
          pollingStations: 5,
          status: 'active'
        },
        { 
          id: 4, 
          name: 'Western District', 
          code: 'WD-001',
          registeredVoters: 4532,
          pollingStations: 6,
          status: 'active'
        },
        { 
          id: 5, 
          name: 'Central District', 
          code: 'CD-001',
          registeredVoters: 6244,
          pollingStations: 9,
          status: 'active'
        },
      ])
    } catch (error) {
      console.error('Error fetching constituencies:', error)
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
      header: 'Code', 
      accessor: 'code',
    },
    { 
      header: 'Registered Voters', 
      accessor: 'registeredVoters',
      render: (row) => row.registeredVoters.toLocaleString(),
    },
    { 
      header: 'Polling Stations', 
      accessor: 'pollingStations',
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
  
  const handleEdit = (constituency) => {
    setEditingConstituency(constituency)
    reset(constituency)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this constituency?')) {
      try {
        // API call would go here
        setConstituencies(constituencies.filter(c => c.id !== id))
      } catch (error) {
        console.error('Error deleting constituency:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingConstituency) {
        // Update existing constituency
        const updatedConstituencies = constituencies.map(c => 
          c.id === editingConstituency.id ? { ...c, ...data } : c
        )
        setConstituencies(updatedConstituencies)
      } else {
        // Add new constituency
        const newConstituency = {
          id: constituencies.length + 1,
          ...data,
          registeredVoters: 0,
          pollingStations: 0,
          status: 'active'
        }
        setConstituencies([...constituencies, newConstituency])
      }
      
      setIsModalOpen(false)
      setEditingConstituency(null)
      reset()
    } catch (error) {
      console.error('Error saving constituency:', error)
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
          
          <Input
            label="Constituency Code"
            {...register('code', { required: 'Code is required' })}
            error={errors.code?.message}
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