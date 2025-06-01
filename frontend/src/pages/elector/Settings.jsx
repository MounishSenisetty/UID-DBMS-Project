import { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'

const ElectorSettings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '1990-01-15',
    gender: 'male'
  })
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    electionUpdates: true,
    candidateInfo: true,
    resultNotifications: true
  })
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  })
  
  const [preferences, setPreferences] = useState({
    language: 'english',
    theme: 'light',
    fontSize: 'medium',
    constituency: 'North District'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSaveMessage('Profile updated successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 1000)
  }

  const handleNotificationUpdate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSaveMessage('Notification preferences updated!')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 500)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (security.newPassword !== security.confirmPassword) {
      setSaveMessage('Passwords do not match!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSaveMessage('Password updated successfully!')
      setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSaveMessage(''), 3000)
    }, 1000)
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white self-start">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your account and preferences</p>
          </div>
        </div>
      </div>      {/* Success/Error Message */}
      {saveMessage && (
        <div className={`mb-4 sm:mb-6 p-4 rounded-lg border animate-slide-in-up ${
          saveMessage.includes('successfully') || saveMessage.includes('updated')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {saveMessage.includes('successfully') || saveMessage.includes('updated') ? '✅' : '❌'}
            </span>
            <span className="text-sm sm:text-base">{saveMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            {/* Mobile Tab Toggle */}
            <div className="lg:hidden mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.icon} {tab.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Desktop Tab Navigation */}
            <div className="hidden lg:block space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all touch-manipulation ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-xl sm:text-2xl">👤</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Profile Information</h2>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <Input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[88px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    responsive
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </Card>
          )}          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-xl sm:text-2xl">🔔</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Notification Preferences</h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 capitalize text-sm sm:text-base">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'smsNotifications' && 'Receive notifications via SMS'}
                        {key === 'electionUpdates' && 'Get updates about upcoming elections'}
                        {key === 'candidateInfo' && 'Receive information about candidates'}
                        {key === 'resultNotifications' && 'Get notified about election results'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer self-start sm:self-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          setNotifications({ ...notifications, [key]: e.target.checked })
                          handleNotificationUpdate()
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-xl sm:text-2xl">🔒</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Security Settings</h2>
              </div>
              
              <div className="space-y-6 sm:space-y-8">
                {/* Password Change */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <Input
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <Input
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <Input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex justify-start">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        responsive
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </div>
                
                {/* Two-Factor Authentication */}
                <div className="border-t pt-6 sm:pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">Two-Factor Authentication</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer self-start sm:self-center">
                      <input
                        type="checkbox"
                        checked={security.twoFactorEnabled}
                        onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-xl sm:text-2xl">⚙️</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">General Preferences</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="regional">Regional Language</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                    <select
                      value={preferences.fontSize}
                      onChange={(e) => setPreferences({ ...preferences, fontSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Constituency</label>
                    <select
                      value={preferences.constituency}
                      onChange={(e) => setPreferences({ ...preferences, constituency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    >
                      <option value="North District">North District</option>
                      <option value="South District">South District</option>
                      <option value="East District">East District</option>
                      <option value="West District">West District</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setIsLoading(true)
                      setTimeout(() => {
                        setIsLoading(false)
                        setSaveMessage('Preferences updated successfully!')
                        setTimeout(() => setSaveMessage(''), 3000)
                      }, 500)
                    }}
                    variant="primary"
                    disabled={isLoading}
                    responsive
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ElectorSettings
