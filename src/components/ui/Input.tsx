import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 placeholder:text-text-secondary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
        error: 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20',
        success: 'border-success focus:border-success focus:ring-2 focus:ring-success/20',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      size,
      label,
      error,
      icon,
      iconPosition = 'left',
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputVariant = error ? 'error' : variant

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={inputVariants({
              variant: inputVariant,
              size,
              className: `
                ${icon && iconPosition === 'left' ? 'pl-10' : ''}
                ${icon && iconPosition === 'right' ? 'pr-10' : ''}
                ${className}
              `,
            })}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
