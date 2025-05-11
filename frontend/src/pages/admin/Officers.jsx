import React, { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const Officers = () => {
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchOfficers()
  }, [])
  
  const fetchOfficers = async () => {
    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOfficers([
        {
          id: 1,
          name: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '+1 (555) 123-4567',
          station: 'Central Community Center',
          role: 'Station Manager',
          status: 'active'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1 (555) 234-5678',
          station: 'Northern Public School',
          role: 'Verification Officer',
          status: 'active'
        },
        {
          id: 3,
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          phone: '+1 (555) 345-6789',
          station: 'Southern Town Hall',
          role: 'Station Manager',
          status: 'active'
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '+1 (555) 456-7890',
          station: 'Eastern Community Hall',
          role: 'Verification Officer',
          status: 'active'
        },
        {
          id: 5,
          name: 'David Martinez',
          email: 'david.martinez@example.com',
          phone: '+1 (555) 567-8901',
          station: 'Western Civic Center',
          role: 'Station Manager',
          status: 'active'
        },
      ])
    } catch (error) {
      console.error('Error fetching officers:', error)
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
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Station',
      accessor: 'station',
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className={`badge ${row.role === 'Station Manager' ? 'badge-primary' : 'badge-secondary'}`}>
          {row.role}
        </span>
      ),
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
  
  const handleEdit = (officer) => {
    setEditingOfficer(officer)
    reset(officer)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this officer?')) {
      try {
        // API call would go here
        setOfficers(officers.filter(o => o.id !== id))
      } catch (error) {
        console.error('Error deleting officer:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingOfficer) {
        // Update existing officer
        const updatedOfficers = officers.map(o => 
          o.id === editingOfficer.id ? { ...o, ...data } : o
        )
        setOfficers(updatedOfficers)
      } else {
        // Add new officer
        const newOfficer = {
          id: officers.length + 1,
          ...data,
          status: 'active'
        }
        setOfficers([...officers, newOfficer])
      }
      
      setIsModalOpen(false)
      setEditingOfficer(null)
      reset()
    } catch (error) {
      console.error('Error saving officer:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Officers</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage polling station officers and their assignments
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingOfficer(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add Officer
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={officers}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingOfficer(null)
          reset()
        }}
        title={editingOfficer ? 'Edit Officer' : 'Add Officer'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <Input
            label="Email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email'
              }
            })}
            error={errors.email?.message}
          />
          
          <Input
            label="Phone"
            {...register('phone', { required: 'Phone is required' })}
            error={errors.phone?.message}
          />
          
          <Input
            label="Station"
            {...register('station', { required: 'Station is required' })}
            error={errors.station?.message}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Role
            </label>
            <select
              className="input"
              {...register('role', { required: 'Role is required' })}
            >
              <option value="Station Manager">Station Manager</option>
              <option value="Verification Officer">Verification Officer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-error-500">{errors.role.message}</p>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingOfficer(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingOfficer ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Officers