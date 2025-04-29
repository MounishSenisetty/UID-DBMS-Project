
import axios from 'axios'

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    
    // Log request and response for debugging
    console.error('API request error:', {
      url: originalRequest.url,
      method: originalRequest.method,
      data: originalRequest.data,
      status: error.response?.status,
      responseData: error.response?.data,
    });
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// API function to get current elector profile
export const getElectorProfile = async () => {
  const response = await api.get('/electors/me')
  return response.data
}

// API function to update elector profile
export const updateElectorProfile = async (profileData) => {
  const response = await api.put('/electors/' + profileData.id, profileData)
  return response.data
}

// API function to get electors assigned to officer's polling station
export const getAssignedElectors = async () => {
  const response = await api.get('/electors/assigned')
  return response.data
}

// API function to verify an elector
export const verifyElector = async (electorId) => {
  const response = await api.post(`/electors/${electorId}/verify`)
  return response.data
}

// API function to record a vote for an elector
export const voteForElector = async (electorId, candidateId) => {
  const response = await api.post(`/electors/${electorId}/vote`, { candidateId })
  return response.data
}

// API function to get polling stations assigned to officer
export const getAssignedPollingStations = async () => {
  const response = await api.get('/pollingStations/assigned')
  return response.data
}

export default api
