import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-13rem)] flex flex-col justify-center items-center px-4 py-16">
      <svg 
        className="h-32 w-32 text-primary-500 mb-8" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 8L12 12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      
      <h1 className="text-4xl font-bold text-neutral-900 mb-4 text-center">
        404 - Page Not Found
      </h1>
      
      <p className="text-lg text-neutral-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex space-x-4">
        <Button 
          variant="primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        
        <Link to="/">
          <Button variant="outline">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound