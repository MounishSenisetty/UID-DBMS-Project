import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const PublicLayout = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <svg 
                    className="h-8 w-8 text-primary-500" 
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
                      d="M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.07989 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-primary-500">ElectManager</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/results" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/results' 
                      ? 'border-primary-500 text-neutral-900' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  Live Results
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link 
                to="/login" 
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  location.pathname === '/login'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-primary-500 border-primary-500 hover:bg-primary-50'
                }`}
              >
                Login
              </Link>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile menu, show/hide based on menuOpen state */}
          {menuOpen && (
            <div className="sm:hidden mt-2">
              <Link 
                to="/results" 
                className={`block px-4 py-2 text-base font-medium ${
                  location.pathname === '/results' 
                    ? 'text-primary-600 font-semibold' 
                    : 'text-neutral-700 hover:text-primary-600'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Live Results
              </Link>
              <Link 
                to="/login" 
                className={`block px-4 py-2 text-base font-medium ${
                  location.pathname === '/login'
                    ? 'text-primary-600 font-semibold'
                    : 'text-neutral-700 hover:text-primary-600'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-neutral-200">
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} ElectManager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout