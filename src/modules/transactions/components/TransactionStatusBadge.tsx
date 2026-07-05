import React from 'react'
import { StatusBadge } from '../../../components/ui/StatusBadge'

interface TransactionStatusBadgeProps {
  status: 'EN_ATTENTE' | 'ENVOYE' | 'RETIRE' | 'ANNULE' | 'EXPIRE'
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  const statusMap: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'info' | 'default' }> = {
    EN_ATTENTE: { label: 'En attente', variant: 'warning' },
    ENVOYE: { label: 'Envoyé', variant: 'info' },
    RETIRE: { label: 'Retiré', variant: 'success' },
    ANNULE: { label: 'Annulé', variant: 'danger' },
    EXPIRE: { label: 'Expiré', variant: 'default' },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: 'default' }
  return <StatusBadge status={label} variant={variant} />
}

export default TransactionStatusBadge
