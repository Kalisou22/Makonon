import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary-light',
        secondary: 'bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary',
        success: 'bg-success hover:bg-success-dark text-white focus:ring-success',
        danger: 'bg-danger hover:bg-danger-dark text-white focus:ring-danger',
        warning: 'bg-warning hover:bg-warning-dark text-white focus:ring-warning',
        info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        ghost: 'bg-transparent text-primary hover:bg-filter-bg focus:ring-primary',
      },
      size: {
        sm: 'px-4 py-1.5 text-xs',
        md: 'px-5 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'w-9 h-9 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Chargement...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
