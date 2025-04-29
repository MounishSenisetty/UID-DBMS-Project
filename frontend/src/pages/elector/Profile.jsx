import { useState, useEffect } from 'react'
import { getElectorProfile, updateElectorProfile } from '../../services/api'
import useFetchData from '../../hooks/useFetchData'

const ElectorProfile = () => {
  const { data: profile, loading, error } = useFetchData(getElectorProfile)
  const [formData, setFormData] = useState({
    id: '',
    serialNumber: '',
    name: '',
    pollingStationId: '',
    pollingStationName: '',
    pollingStationWard: '',
    constituencyName: '',
    email: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id || '',
        serialNumber: profile.serialNumber || '',
        name: profile.name || '',
        pollingStationId: profile.pollingStationId || '',
        pollingStationName: profile.PollingStation?.name || '',
        pollingStationWard: profile.PollingStation?.ward || '',
        constituencyName: profile.PollingStation?.Constituency?.name || '',
        email: profile.User?.email || ''
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(false)
    try {
      await updateElectorProfile(formData)
      setUpdateSuccess(true)
      setIsEditing(false)
    } catch (err) {
      setUpdateError(err.message || 'Failed to update profile')
    }
  }

  if (loading) return <p>Loading profile...</p>
  if (error) return <p>Error loading profile: {error.message}</p>

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      {updateError && <p className="text-red-600 mb-2">{updateError}</p>}
      {updateSuccess && <p className="text-green-600 mb-2">Profile updated successfully.</p>}
      {!isEditing ? (
        <div>
          <p><strong>Serial Number:</strong> {formData.serialNumber}</p>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
          <p><strong>Polling Station:</strong> {formData.pollingStationName || 'N/A'}</p>
          <p><strong>Constituency:</strong> {formData.constituencyName || 'N/A'}</p>
          <p><strong>Ward:</strong> {formData.pollingStationWard || 'N/A'}</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="serialNumber" className="block font-medium">Serial Number</label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="pollingStationId" className="block font-medium">Polling Station ID</label>
            <input
              type="text"
              id="pollingStationId"
              name="pollingStationId"
              value={formData.pollingStationId}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="btn btn-primary">Save</button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  id: profile.id || '',
                  serialNumber: profile.serialNumber || '',
                  name: profile.name || '',
                  pollingStationId: profile.pollingStationId || ''
                })
                setUpdateError(null)
                setUpdateSuccess(false)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ElectorProfile
