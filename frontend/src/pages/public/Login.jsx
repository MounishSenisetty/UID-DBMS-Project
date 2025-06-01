import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { toast } from 'react-toastify'
import api from '../../services/api'
import useAuth from '../../contexts/useAuth'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const navigate = useNavigate()
  const { setCurrentUser, setUserRole, setUserName } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const demoAccounts = {
    admin: { id: 1, password: 'password123', role: 'admin', name: 'Admin User' },
    officer: { id: 2, password: 'password123', role: 'polling_officer', name: 'Polling Officer' },
    elector: { id: 3, password: 'password123', role: 'elector', name: 'Voter' }
  }

  const demoLogin = async (role) => {
    setLoading(true)
    
    try {
      // Use actual demo credentials for backend API
      const demoCredentials = {
        admin: { id: 1, password: 'password123' },
        officer: { id: 2, password: 'password123' },
        elector: { id: 3, password: 'password123' }
      }
      
      const credentials = demoCredentials[role]
      const response = await api.post('/user/login', credentials)
      
      localStorage.setItem("userId", response.data.user.linkedId.toString())
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userRole", response.data.user.role)
      localStorage.setItem("userName", response.data.user.name || `Demo ${role}`)
      setCurrentUser(response.data.user.linkedId.toString())
      setUserRole(response.data.user.role)
      setUserName(response.data.user.name)

      const userRole = response.data.user.role
      const officerRoles = [
        'returning_officer',
        'registration_officer', 
        'polling_officer',
        'presiding_officer'
      ]
      
      if (userRole === 'admin') {
        navigate('/admin')
      } else if (userRole === 'elector') {
        navigate('/elector')
      } else if (officerRoles.includes(userRole)) {
        navigate('/officer')
      } else {
        navigate('/login')
      }
      
      toast.success(`Welcome! Login successful.`)
    } catch (error) {
      console.error('Demo login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    const payload = {
      password: data.password,
      id: parseInt(data.id)
    }

    try {
      const response = await api.post('/user/login', payload)
      
      localStorage.setItem("userId", response.data.user.linkedId.toString())
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userRole", response.data.user.role)
      localStorage.setItem("userName", response.data.user.name || 'User')
      setCurrentUser(response.data.user.linkedId.toString())
      setUserRole(response.data.user.role)
      setUserName(response.data.user.name)

      const userRole = response.data.user.role
      const officerRoles = [
        'returning_officer',
        'registration_officer', 
        'polling_officer',
        'presiding_officer'
      ]
      
      if (userRole === 'admin') {
        navigate('/admin')
      } else if (userRole === 'elector') {
        navigate('/elector')
      } else if (officerRoles.includes(userRole)) {
        navigate('/officer')
      } else {
        navigate('/login')
      }
      
      toast.success('Login successful!')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg
            className="h-8 w-8 sm:h-10 sm:w-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Election Management System
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-xl rounded-lg border border-gray-100">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="User ID"
              type="number"
              id="id"
              placeholder="Enter your user ID"
              autoComplete="username"
              error={errors.id?.message}
              className="min-h-[44px]"
              {...register('id', { required: 'User ID is required' })}
            />

            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              className="min-h-[44px]"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Create account
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full min-h-[44px]"
              loading={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Demo Access</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Admin Demo</h4>
                    <span className="text-xl sm:text-2xl">👨‍💼</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700 mb-3">Full system administration access</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 min-h-[40px] text-sm"
                      onClick={() => demoLogin('admin')}
                      loading={loading}
                    >
                      Login as Admin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50 min-h-[40px]"
                      onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    >
                      {showDemoAccounts ? '🙈 Hide' : '👁️ Show'} Credentials
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border-2 border-green-200 hover:border-green-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-900 text-sm sm:text-base">Officer Demo</h4>
                    <span className="text-xl sm:text-2xl">👮</span>
                  </div>
                  <p className="text-xs sm:text-sm text-green-700 mb-3">Polling station management</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white min-h-[40px] text-sm"
                      onClick={() => demoLogin('officer')}
                      loading={loading}
                    >
                      Login as Officer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto border-green-300 text-green-600 hover:bg-green-50 min-h-[40px]"
                      onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    >
                      {showDemoAccounts ? '🙈 Hide' : '👁️ Show'} Credentials
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-900 text-sm sm:text-base">Voter Demo</h4>
                    <span className="text-xl sm:text-2xl">🗳️</span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-700 mb-3">Voter dashboard and voting</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="accent"
                      size="sm"
                      className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white min-h-[40px] text-sm"
                      onClick={() => demoLogin('elector')}
                      loading={loading}
                    >
                      Login as Voter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto border-purple-300 text-purple-600 hover:bg-purple-50 min-h-[40px]"
                      onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    >
                      {showDemoAccounts ? '🙈 Hide' : '👁️ Show'} Credentials
                    </Button>
                  </div>
                </div>

                {showDemoAccounts && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 rounded-lg border-2 border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                      <span className="mr-2">🔑</span>
                      Demo Credentials
                    </h4>
                    <div className="space-y-2 text-sm bg-white p-3 rounded border border-gray-200">
                      {Object.entries(demoAccounts).map(([role, account]) => (
                        <div key={role} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 space-y-1 sm:space-y-0">
                          <span className="font-medium text-gray-700 text-xs sm:text-sm">{account.name}:</span>
                          <span className="text-gray-600 font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                            ID: {account.id} | Pass: {account.password}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Secure • Transparent • Democratic
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
