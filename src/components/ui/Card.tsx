import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'bg-white rounded-lg border border-border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'hover:border-primary/30',
        dashboard: 'hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg cursor-pointer',
        compact: 'p-4',
        elevated: 'shadow-md hover:shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={cardVariants({ variant, className })} {...props}>
      {children}
    </div>
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`border-b border-border px-5 py-4 font-semibold text-gray-800 ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`border-t border-border px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'success' | 'danger' | 'warning'
}

const colorVariants = {
  primary: 'border-primary/20 text-primary',
  success: 'border-success/20 text-success',
  danger: 'border-danger/20 text-danger',
  warning: 'border-warning/20 text-warning',
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  color = 'primary',
}) => {
  return (
    <Card variant="dashboard" className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>}
          {trend && (
            <p className={`mt-2 text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${colorVariants[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
