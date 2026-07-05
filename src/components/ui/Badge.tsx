import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-success/15 text-success',
        danger: 'bg-danger/15 text-danger',
        warning: 'bg-warning/15 text-warning',
        primary: 'bg-primary/15 text-primary',
        secondary: 'bg-secondary/15 text-secondary',
        info: 'bg-blue-100 text-blue-700',
        default: 'bg-gray-100 text-gray-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      dot: {
        true: 'pl-2',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      dot: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  size,
  dot = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <span className={badgeVariants({ variant, size, dot, className })} {...props}>
      {dot && (
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          variant === 'success' ? 'bg-success' :
          variant === 'danger' ? 'bg-danger' :
          variant === 'warning' ? 'bg-warning' :
          variant === 'primary' ? 'bg-primary' :
          variant === 'info' ? 'bg-blue-700' : 'bg-gray-700'
        }`} />
      )}
      {children}
    </span>
  )
}

export interface StatusBadgeProps {
  status: string
  statusMap?: Record<string, { label: string; variant: BadgeProps['variant'] }>
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusMap,
  className = '',
}) => {
  const defaultStatusMap: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    ACTIF: { label: 'Actif', variant: 'success' },
    INACTIF: { label: 'Inactif', variant: 'danger' },
    EN_ATTENTE: { label: 'En attente', variant: 'warning' },
    ENVOYE: { label: 'Envoyé', variant: 'primary' },
    RETIRE: { label: 'Retiré', variant: 'success' },
    ANNULE: { label: 'Annulé', variant: 'danger' },
    EXPIRE: { label: 'Expiré', variant: 'secondary' },
    SUCCES: { label: 'Succès', variant: 'success' },
    ECHEC: { label: 'Échec', variant: 'danger' },
    Oui: { label: 'Actif', variant: 'success' },
    Non: { label: 'Inactif', variant: 'danger' },
  }

  const map = statusMap || defaultStatusMap
  const config = map[status] || { label: status, variant: 'default' }

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  )
}

export default Badge
