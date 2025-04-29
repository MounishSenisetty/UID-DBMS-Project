import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const PollingStations = () => {
  const [stations, setStations] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStation, setEditingStation] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchStations()
    fetchConstituencies()
  }, [])
  
    const fetchStations = async () => {
      setLoading(true)
      try {
        const response = await api.get('/api/polling-stations')
        setStations(response.data)
      } catch (error) {
        console.error('Error fetching polling stations:', error)
      } finally {
        setLoading(false)
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
      header: 'Area',
      accessor: 'area',
    },
    {
      header: 'Ward',
      accessor: 'ward',
    },
    {
      header: 'Constituency',
      accessor: 'Constituency.name',
      render: (row) => row.Constituency?.name || '',
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
        await api.delete(`/api/polling-stations/${id}`)
        setStations(stations.filter(s => s.id !== id))
      } catch (error) {
        console.error('Error deleting polling station:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
        if (editingStation) {
          await api.put(`/api/polling-stations/${editingStation.id}`, data)
          const updatedStations = stations.map(s => 
            s.id === editingStation.id ? { ...s, ...data } : s
          )
          setStations(updatedStations)
        } else {
          const response = await api.post('/api/polling-stations', data)
          setStations([...stations, response.data])
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
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          
          <Input
            label="Area"
            {...register('area', { required: 'Area is required' })}
            error={errors.area?.message}
          />
          
          <Input
            label="Ward"
            {...register('ward', { required: 'Ward is required' })}
            error={errors.ward?.message}
          />
          
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
