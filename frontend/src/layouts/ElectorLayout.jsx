import React, { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ElectorLayout = () => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/elector', icon: 'home' },
    { name: 'My Profile', href: '/elector/profile', icon: 'user' },
    { name: 'Vote', href: '/elector/vote', icon: 'vote' },
    { name: 'Results', href: '/elector/results', icon: 'chart' },
  ]
  
  const renderIcon = (icon) => {
    switch (icon) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        )
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        )
      case 'vote':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        )
      default:
        return null
    }
  }
  
  // Function to get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/elector') return 'Elector Dashboard'
    
    const navItem = navigation.find(item => item.href === path)
    return navItem ? navItem.name : 'Elector Portal'
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity ease-linear duration-300`}>
        <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-accent-700 transform transition ease-in-out duration-300 translate-x-0">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button 
              type="button" 
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-4">
            <Link to="/elector" className="flex items-center">
              <svg 
                className="h-8 w-8 text-white" 
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
              <span className="ml-2 text-xl font-bold text-white">ElectManager</span>
            </Link>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive 
                      ? 'bg-accent-800 text-white' 
                      : 'text-accent-100 hover:bg-accent-600 hover:text-white'
                  }`}
                  end={item.href === '/elector'}
                >
                  <span className="mr-4">{renderIcon(item.icon)}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-accent-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent-600 text-white">
                    {user?.name?.[0] || 'E'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user?.name || 'Elector User'}</p>
                  <p className="text-sm text-accent-300">{user?.constituencyName || 'Constituency'}</p>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-accent-200 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-accent-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/elector" className="flex items-center">
                <svg 
                  className="h-8 w-8 text-white" 
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
                <span className="ml-2 text-xl font-bold text-white">ElectManager</span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-accent-800 text-white' 
                      : 'text-accent-100 hover:bg-accent-600 hover:text-white'
                  }`}
                  end={item.href === '/elector'}
                >
                  <span className="mr-3">{renderIcon(item.icon)}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-accent-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-accent-600 text-white">
                    {user?.name?.[0] || 'E'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'Elector User'}</p>
                  <p className="text-xs text-accent-300">{user?.constituencyName || 'Constituency'}</p>
                  <button
                    onClick={logout}
                    className="text-xs font-medium text-accent-200 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="md:pl-64 flex flex-col">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <header className="bg-white shadow">
          <div className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-neutral-900">{getPageTitle()}</h1>
            {user?.hasVoted ? (
              <div className="text-sm text-neutral-500">
                <span className="bg-success-100 text-success-800 px-2 py-1 rounded-full inline-flex items-center">
                  <span className="h-2 w-2 bg-success-500 rounded-full mr-2"></span>
                  Vote Completed
                </span>
              </div>
            ) : (
              <div className="text-sm text-neutral-500">
                <span className="bg-warning-100 text-warning-800 px-2 py-1 rounded-full inline-flex items-center">
                  <span className="h-2 w-2 bg-warning-500 rounded-full mr-2"></span>
                  Not Voted Yet
                </span>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1">
          <div className="w-full py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ElectorLayout