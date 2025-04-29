import React from 'react'

const Loader = ({ fullScreen, size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }
  
  const spinnerSize = sizeClasses[size] || sizeClasses.medium
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className={`${spinnerSize} border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin`}></div>
          <p className="text-neutral-600 font-medium">{text}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${spinnerSize} border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin`}></div>
      {text && <p className="ml-3 text-neutral-600">{text}</p>}
    </div>
  )
}

export default Loader