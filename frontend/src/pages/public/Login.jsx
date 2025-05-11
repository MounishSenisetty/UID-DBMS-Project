import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import api from '../../services/api';

const Login = () => {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const demoAccounts = {
    admin: { id: 1, password: 'password123', role: 'admin' },
    officer: { id: 2, password: 'password123', role: 'polling_officer' },
    elector: { id: 3, password: 'password123', role: 'elector' }
  };

  const showDemoDetails = (role) => {
    const account = demoAccounts[role];
    alert(`Demo ${role.charAt(0).toUpperCase() + role.slice(1)}\nID: ${account.id}\nPassword: ${account.password}`);
  };

  const demoLogin = async (role) => {
    setLoading(true);
    const account = demoAccounts[role];
    const payload = { id: account.id, password: account.password };
    try {
      const response = await api.post('/user/login', payload);
      localStorage.setItem("userId", response.data.user.linkedId);
      const role = response.data.user.role;
      const officerRoles = [
        'returning_officer',
        'registration_officer',
        'polling_officer',
        'presiding_officer'
      ];
      if (role === 'admin') {
        window.location.href = '/admin';
      } else if (role === 'elector') {
        window.location.href = '/elector';
      } else if (officerRoles.includes(role)) {
        window.location.href = '/officer';
      } else {
        window.location.href = '/login';
      }
      localStorage.setItem("token", response.data.token);
    } catch (err) {
      alert('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      password: data.password, // Changed from passwordHash to password to match backend
      id: data.id
    };

    try {
      const response = await api.post('/user/login', payload);
      console.log('User found:', response.data);
      
      // Store the linkedId instead of the id
      localStorage.setItem("userId", response.data.user.linkedId);
      const role = response.data.user.role;
      const officerRoles = [
        'returning_officer',
        'registration_officer',
        'polling_officer',
        'presiding_officer'
      ];
      if (role === 'admin') {
        window.location.href = '/admin';
      } else if (role === 'elector') {
        window.location.href = '/elector';
      } else if (officerRoles.includes(role)) {
        window.location.href = '/officer';
      } else {
        window.location.href = '/login';
      }
      
      // If you want to store the token for later use (e.g., in localStorage or as a global state):
      localStorage.setItem("token", response.data.token);
      

    } catch (err) {
      console.error(err);
      alert('Error creating user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-13rem)] flex flex-col justify-center m-0 p-0">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <svg
          className="mx-auto h-16 w-16 text-primary-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 9H21M7 3V5M17 3V5M6 12H10V16H6V12ZM14 12H18V16H14V12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.07989 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h2 className="mt-4 text-center text-3xl font-bold text-neutral-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Access the Election Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="ID"
              type="number"
              id="id"
              autoComplete="username"
              {...register('id', { required: 'ID is required' })}
            />

            <Input
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />


            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                  Don&apos;t have an account? Sign up
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => demoLogin('admin')}
                >
                  Demo Admin Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => showDemoDetails('admin')}
                >
                  Show Demo Details
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => demoLogin('officer')}
                >
                  Demo Officer Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => showDemoDetails('officer')}
                >
                  Show Demo Details
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => demoLogin('elector')}
                >
                  Demo Elector Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => showDemoDetails('elector')}
                >
                  Show Demo Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
