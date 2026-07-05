import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options?: Array<{ value: string; label: string }>
  error?: string
  children?: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <select
        className={`
          w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}
          ${className}
        `}
        {...props}
      >
        {options && options.length > 0 ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}

export default Select
