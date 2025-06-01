import React from 'react'

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hover = false,
  padding = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  return (
    <div
      className={`card ${hover ? 'hover:shadow-card-hover' : ''} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`mb-4 ${headerClassName}`}>
          {title && <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={`${bodyClassName}`}>{children}</div>
      
      {footer && (
        <div className={`mt-4 pt-4 border-t border-neutral-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card