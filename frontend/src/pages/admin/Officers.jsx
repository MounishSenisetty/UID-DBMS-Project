import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import api from '../../services/api';

const Officers = () => {
  const [officers, setOfficers] = useState([]);
  const [pollingStations, setPollingStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchOfficers();
    fetchPollingStations();
  }, []);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/officers');
      setOfficers(response.data);
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPollingStations = async () => {
    try {
      const response = await api.get('/api/polling-stations');
      setPollingStations(response.data);
    } catch (error) {
      console.error('Error fetching polling stations:', error);
    }
  };
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
          <Button variant="error" size="sm" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      ),
    },
  ];
  
  const handleEdit = (officer) => {
    setEditingOfficer(officer);
    reset(officer);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this officer?')) {
      try {
        await api.delete(`/api/officers/${id}`);
        setOfficers(officers.filter(o => o.id !== id));
      } catch (error) {
        console.error('Error deleting officer:', error);
      }
    }
  };
  
  const onSubmit = async (data) => {
    try {
      if (editingOfficer) {
        await api.put(`/api/officers/${editingOfficer.id}`, data);
        const updatedOfficers = officers.map(o => o.id === editingOfficer.id ? { ...o, ...data } : o);
        setOfficers(updatedOfficers);
      } else {
        const response = await api.post('/api/officers', data);
        setOfficers([...officers, response.data]);
      }
      
      setIsModalOpen(false);
      setEditingOfficer(null);
      reset();
    } catch (error) {
      console.error('Error saving officer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Officers</h2>
          <p className="mt-1 text-sm text-neutral-500">Manage election officers and their assignments</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingOfficer(null); reset(); setIsModalOpen(true); }}>
          Add Officer
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={officers} isLoading={loading} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingOfficer(null); reset(); }}
        title={editingOfficer ? 'Edit Officer' : 'Add Officer'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
          <label className="block mb-2 font-medium text-gray-700">Role</label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select a role</option>
            <option value="returning">Returning Officer</option>
            <option value="registration">Registration Officer</option>
            <option value="polling">Polling Officer</option>
            <option value="presiding">Presiding Officer</option>
          </select>
          {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}

          <label className="block mb-2 font-medium text-gray-700">Polling Station</label>
          <select
            {...register('pollingStationId', { required: 'Polling Station is required' })}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select a polling station</option>
            {pollingStations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
          {errors.pollingStationId && <p className="text-red-600 text-sm mt-1">{errors.pollingStationId.message}</p>}

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingOfficer(null); reset(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingOfficer ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Officers;
