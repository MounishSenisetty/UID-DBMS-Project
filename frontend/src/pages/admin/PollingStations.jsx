import React, { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const PollingStations = () => {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStation, setEditingStation] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchStations()
  }, [])
  
  const fetchStations = async () => {
    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStations([
        {
          id: 1,
          name: 'Central Community Center',
          code: 'CCC-001',
          constituency: 'Central District',
          address: '123 Main St, Central City',
          capacity: 1200,
          assignedOfficers: 4,
          status: 'active'
        },
        {
          id: 2,
          name: 'Northern Public School',
          code: 'NPS-001',
          constituency: 'Northern District',
          address: '456 North Ave, Northern City',
          capacity: 800,
          assignedOfficers: 3,
          status: 'active'
        },
        {
          id: 3,
          name: 'Southern Town Hall',
          code: 'STH-001',
          constituency: 'Southern District',
          address: '789 South St, Southern City',
          capacity: 1500,
          assignedOfficers: 5,
          status: 'active'
        },
        {
          id: 4,
          name: 'Eastern Community Hall',
          code: 'ECH-001',
          constituency: 'Eastern District',
          address: '321 East Rd, Eastern City',
          capacity: 1000,
          assignedOfficers: 4,
          status: 'active'
        },
        {
          id: 5,
          name: 'Western Civic Center',
          code: 'WCC-001',
          constituency: 'Western District',
          address: '654 West Blvd, Western City',
          capacity: 900,
          assignedOfficers: 3,
          status: 'active'
        },
      ])
    } catch (error) {
      console.error('Error fetching polling stations:', error)
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
      header: 'Constituency',
      accessor: 'constituency',
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      render: (row) => row.capacity.toLocaleString(),
    },
    {
      header: 'Officers',
      accessor: 'assignedOfficers',
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
  
  const handleEdit = (station) => {
    setEditingStation(station)
    reset(station)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this polling station?')) {
      try {
        // API call would go here
        setStations(stations.filter(s => s.id !== id))
      } catch (error) {
        console.error('Error deleting polling station:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingStation) {
        // Update existing station
        const updatedStations = stations.map(s => 
          s.id === editingStation.id ? { ...s, ...data } : s
        )
        setStations(updatedStations)
      } else {
        // Add new station
        const newStation = {
          id: stations.length + 1,
          ...data,
          assignedOfficers: 0,
          status: 'active'
        }
        setStations([...stations, newStation])
      }
      
      setIsModalOpen(false)
      setEditingStation(null)
      reset()
    } catch (error) {
      console.error('Error saving polling station:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Polling Stations</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage polling stations and their details
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingStation(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add Polling Station
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={stations}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStation(null)
          reset()
        }}
        title={editingStation ? 'Edit Polling Station' : 'Add Polling Station'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Station Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <Input
            label="Station Code"
            {...register('code', { required: 'Code is required' })}
            error={errors.code?.message}
          />
          
          <Input
            label="Constituency"
            {...register('constituency', { required: 'Constituency is required' })}
            error={errors.constituency?.message}
          />
          
          <Input
            label="Address"
            {...register('address', { required: 'Address is required' })}
            error={errors.address?.message}
          />
          
          <Input
            label="Capacity"
            type="number"
            {...register('capacity', { 
              required: 'Capacity is required',
              min: { value: 100, message: 'Capacity must be at least 100' }
            })}
            error={errors.capacity?.message}
          />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingStation(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingStation ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PollingStations