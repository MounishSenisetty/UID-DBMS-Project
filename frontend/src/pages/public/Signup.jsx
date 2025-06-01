import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import { 
  UserPlusIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const roles = [
    { value: 'admin', label: 'System Administrator', icon: '👨‍💼', description: 'Full system access and management' },
    { value: 'returning_officer', label: 'Returning Officer', icon: '📋', description: 'Election oversight and coordination' },
    { value: 'registration_officer', label: 'Registration Officer', icon: '📝', description: 'Voter registration management' },
    { value: 'polling_officer', label: 'Polling Officer', icon: '🗳️', description: 'Polling station operations' },
    { value: 'presiding_officer', label: 'Presiding Officer', icon: '⚖️', description: 'Station supervision and compliance' },
    { value: 'elector', label: 'Voter/Elector', icon: '👥', description: 'Vote and view results' },
  ];

const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role,
      linkedId: data.linkedId ? parseInt(data.linkedId) : null,
      email: data.email
    };

    try {
      const response = await api.post('/user/signup', payload);
      console.log('User created:', response.data);
      localStorage.setItem("userId", response.data.userID);
      
      const role = response.data.user?.role || data.role;
      toast.success(`Account created successfully! Welcome ${data.username}!`);
        // Redirect based on role
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'elector') {
          navigate('/elector');
        } else if (role) {
          navigate('/officer');
        } else {
          navigate('/login');
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlusIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Join the Election Management System
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-2xl sm:rounded-2xl border border-gray-100">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                required
                error={errors.username?.message}
                className="min-h-[44px]"
                {...register('username', { 
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
                error={errors.email?.message}
                className="min-h-[44px]"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email'
                  }
                })}
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                required
                error={errors.password?.message}
                className="min-h-[44px] pr-12"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex cursor-pointer rounded-lg border p-3 sm:p-4 focus:outline-none transition-all ${
                      selectedRole === role.value
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={role.value}
                      className="sr-only"
                      {...register('role', { required: 'Please select a role' })}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                      <div className="text-xl sm:text-2xl flex-shrink-0">{role.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{role.label}</div>
                        <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">{role.description}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        selectedRole === role.value
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === role.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Linked ID (Optional)"
              type="number"
              placeholder="Enter linked ID if applicable"
              error={errors.linkedId?.message}
              className="min-h-[44px]"
              {...register('linkedId', {
                min: { value: 1, message: 'ID must be a positive number' }
              })}
            />

            <Button 
              type="submit" 
              variant="primary"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[48px]" 
              loading={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm sm:text-base">Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Create Account</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 min-h-[44px]"
                onClick={() => window.location.href = '/login'}
              >
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Sign In Instead</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
