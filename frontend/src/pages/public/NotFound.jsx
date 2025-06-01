import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col justify-center items-center px-4 py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Enhanced 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Main 404 SVG */}
            <svg 
              className="h-48 w-48 mx-auto text-purple-500 mb-4 animate-bounce-slow" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none"
                className="animate-pulse"
              />
              
              {/* 404 Text */}
              <text 
                x="100" 
                y="110" 
                textAnchor="middle" 
                className="text-4xl font-bold fill-current"
              >
                404
              </text>
              
              {/* Sad Face */}
              <circle cx="80" cy="80" r="3" fill="currentColor" />
              <circle cx="120" cy="80" r="3" fill="currentColor" />
              <path 
                d="M80 130 Q100 110 120 130" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Floating Question Marks */}
            <div className="absolute -top-4 -left-4 text-2xl animate-float">❓</div>
            <div className="absolute -top-8 -right-2 text-xl animate-float animation-delay-1000">❓</div>
            <div className="absolute -bottom-2 left-0 text-lg animate-float animation-delay-2000">❓</div>
          </div>
        </div>
        
        {/* Enhanced Typography */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Oops! Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            It looks like you&apos;ve wandered into uncharted territory! The page you&apos;re looking for might have been 
            <span className="font-semibold text-purple-600"> moved</span>, 
            <span className="font-semibold text-pink-600"> renamed</span>, or 
            <span className="font-semibold text-blue-600"> temporarily unavailable</span>.
          </p>
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <Button 
            variant="primary"
            onClick={() => window.history.back()}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 px-8 py-3"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
          </Button>
          
          <Link to="/">
            <Button 
              variant="outline"
              className="group relative overflow-hidden border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transform hover:scale-105 transition-all duration-200 px-8 py-3"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </span>
            </Button>
          </Link>
        </div>
        
        {/* Quick Navigation */}
        <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🧭 Quick Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link 
              to="/login" 
              className="flex items-center p-3 rounded-lg bg-white/80 hover:bg-white/90 border border-gray-200 transition-all group"
            >
              <span className="text-2xl mr-3">🔐</span>
              <div>
                <div className="font-medium text-gray-800 group-hover:text-purple-600">Login</div>
                <div className="text-sm text-gray-600">Access your account</div>
              </div>
            </Link>
            
            <Link 
              to="/signup" 
              className="flex items-center p-3 rounded-lg bg-white/80 hover:bg-white/90 border border-gray-200 transition-all group"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <div className="font-medium text-gray-800 group-hover:text-purple-600">Sign Up</div>
                <div className="text-sm text-gray-600">Create new account</div>
              </div>
            </Link>
            
            <Link 
              to="/results" 
              className="flex items-center p-3 rounded-lg bg-white/80 hover:bg-white/90 border border-gray-200 transition-all group"
            >
              <span className="text-2xl mr-3">📊</span>
              <div>
                <div className="font-medium text-gray-800 group-hover:text-purple-600">Results</div>
                <div className="text-sm text-gray-600">View live results</div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Fun Error Messages */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Error Code: 404 | This page is taking a vacation 🏖️</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound