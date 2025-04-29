import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import SearchInput from '../../components/common/SearchInput'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import useFetchData from '../../hooks/useFetchData'

const Electors = () => {
  const { data: electors, loading, error, refetch } = useFetchData(() => api.get('/api/electors').then(res => res.data), [])
  const { data: pollingStations, loading: loadingStations } = useFetchData(() => api.get('/api/pollingStations').then(res => res.data), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingElector, setEditingElector] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filteredElectors = electors?.filter(elector =>
    elector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    elector.serialNumber.toString().includes(searchTerm)
  ) || []

  const columns = [
    { header: 'Serial Number', accessor: 'serialNumber' },
    { header: 'Name', accessor: 'name' },
    { header: 'Constituency', accessor: (row) => row.PollingStation?.Constituency?.name || '' },
    { header: 'Ward', accessor: (row) => row.PollingStation?.ward || '' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
          <Button variant="error" size="sm" onClick={() => handleDelete(row.serialNumber)}>Delete</Button>
        </div>
      ),
    },
  ]

  const handleEdit = (elector) => {
    setEditingElector(elector)
    reset({
      serialNumber: elector.serialNumber,
      name: elector.name,
      pollingStationId: elector.PollingStation?.id || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this elector?')) {
      try {
        await api.delete(`/api/electors/${id}`)
        refetch()
      } catch (error) {
        console.error('Error deleting elector:', error)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingElector) {
        await api.put(`/api/electors/${editingElector.id}`, data)
      } else {
        await api.post('/api/electors', data)
      }
      setIsModalOpen(false)
      setEditingElector(null)
      reset()
      refetch()
    } catch (error) {
      console.error('Error saving elector:', error)
    }
  }

  if (loading || loadingStations) return <p>Loading electors...</p>
  if (error) return <p className="text-red-600">Failed to load electors.</p>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Electors</h2>
          <p className="mt-1 text-sm text-neutral-500">Manage electors and their details</p>
        </div>

        <Button variant="primary" onClick={() => { setEditingElector(null); reset(); setIsModalOpen(true) }}>
          Add Elector
        </Button>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search electors by name or serial number"
        className="mb-4 max-w-sm"
      />

      <Card>
        <Table columns={columns} data={filteredElectors} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingElector(null); reset() }}
        title={editingElector ? 'Edit Elector' : 'Add Elector'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Serial Number"
            {...register('serialNumber', { required: 'Serial Number is required' })}
            error={errors.serialNumber?.message}
            disabled={!!editingElector}
          />
          <Input
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <label className="block">
            <span className="text-gray-700">Polling Station</span>
            <select
              {...register('pollingStationId', { required: 'Polling Station is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue=""
            >
              <option value="" disabled>Select a polling station</option>
              {pollingStations?.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.Constituency?.name || ''}
                </option>
              ))}
            </select>
            {errors.pollingStationId && <p className="text-red-600 text-sm">{errors.pollingStationId.message}</p>}
          </label>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingElector(null); reset() }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingElector ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Electors
