import { forwardRef } from 'react'
import PropTypes from 'prop-types'

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  error,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = id || name
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-neutral-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? 'border-error-500 focus:ring-error-500' : ''} ${inputClassName}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-neutral-500">{helpText}</p>}
    </div>
  )
})

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
}

export default Input