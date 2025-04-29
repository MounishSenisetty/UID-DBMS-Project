import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api'; // Adjust the path based on your project structure

const Signup = () => {
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const roles = [
    'admin',
    'returning_officer',
    'registration_officer',
    'polling_officer',
    'presiding_officer',
    'elector',
  ];

  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password, // Changed from passwordHash to password to match backend
      role: data.role,
      linkedId: data.linkedId ? parseInt(data.linkedId) : null,
      email: data.email
    };

    try {
      const response = await api.post('/user/signup', payload);
      console.log('User created:', response.data);
      const user = {
        userID: response.data.userID,
        role: response.data.role,
        username: data.username,
        email: data.email,
      };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      alert('User created successfully!');

      // Check role and redirect accordingly
      const role = response.data.role ? response.data.role.toLowerCase() : null;
      let redirectPath = '/login'; // default fallback
      if (role === 'elector') {
        redirectPath = '/elector/dashboard';
      } else if (role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (role) {
        redirectPath = '/officer/verification';
      }
      window.location.href = redirectPath;
    } catch (err) {
      console.error(err);
      alert('Error creating user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-13rem)] flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-md">
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
          Sign up to your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Access the Election Management System
        </p>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Username"
              type="text"
              id="username"
              required
              error={errors.username?.message}
              {...register('username', { required: 'Username is required' })}
            />
            <Input
              label="Email"
              type="text"
              id="email"
              required
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              id="password"
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

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                Role
              </label>
              <select
                id="role"
                {...register('role', { required: 'Role is required' })}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Linked ID (optional)"
              type="number"
              id="linkedId"
              error={errors.linkedId?.message}
              {...register('linkedId')}
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Sign up
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

            {/* <div className="mt-6 grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => login({ email: 'admin@example.com', password: 'password123' })}
              >
                Demo Admin Login
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => login({ email: 'officer@example.com', password: 'password123' })}
              >
                Demo Officer Login
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => login({ email: 'elector@example.com', password: 'password123' })}
              >
                Demo Elector Login
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
