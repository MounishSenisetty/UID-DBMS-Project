import React from 'react'

const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-neutral-300 rounded ${className}`}>
      &nbsp;
    </div>
  )
}

export default SkeletonLoader
