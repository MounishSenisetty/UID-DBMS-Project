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
  ...props
}) => {
  return (
    <div
      className={`card ${hover ? 'hover:shadow-card-hover' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`mb-4 ${headerClassName}`}>
          {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
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