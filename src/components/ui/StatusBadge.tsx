import React from 'react'
import { StatusBadge as StatusBadgeComponent } from './Badge'

interface StatusBadgeProps {
  status: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  className = '',
}) => {
  const variantMap: Record<string, 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'info' | 'default'> = {
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info',
    default: 'default',
  }

  return (
    <StatusBadgeComponent
      status={status}
      className={className}
      statusMap={{
        [status]: {
          label: status,
          variant: variantMap[variant] || 'default',
        },
      }}
    />
  )
}

export default StatusBadge
