import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  
  useEffect(() => {
    fetchUsers()
  }, [])
  
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Linked ID', accessor: 'linkedId' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
          <Button variant="error" size="sm" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      ),
    },
  ]
  
  const handleEdit = (user) => {
    setEditingUser(user)
    reset(user)
    setIsModalOpen(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${id}`)
        setUsers(users.filter(u => u.id !== id))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }
  
  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await api.put(`/api/users/${editingUser.id}`, data)
        const updatedUsers = users.map(u => 
          u.id === editingUser.id ? { ...u, ...data } : u
        )
        setUsers(updatedUsers)
      } else {
        const response = await api.post('/api/users', data)
        setUsers([...users, response.data])
      }
      
      setIsModalOpen(false)
      setEditingUser(null)
      reset()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Users</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Manage system users and their roles
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setEditingUser(null)
            reset()
            setIsModalOpen(true)
          }}
        >
          Add User
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={users}
          isLoading={loading}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
          reset()
        }}
        title={editingUser ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            {...register('username', { required: 'Username is required' })}
            error={errors.username?.message}
          />
          <Input
            label="Email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password', { required: editingUser ? false : 'Password is required' })}
            error={errors.password?.message}
          />
          <Input
            label="Role"
            {...register('role', { required: 'Role is required' })}
            error={errors.role?.message}
          />
          <Input
            label="Linked ID"
            type="number"
            {...register('linkedId')}
            error={errors.linkedId?.message}
          />
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingUser(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Users
