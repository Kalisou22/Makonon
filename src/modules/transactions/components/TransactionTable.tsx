import React from 'react'
import { Table } from '../../../components/ui/Table'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { Button } from '../../../components/ui/Button'
import type { Transaction } from '../types'

interface TransactionTableProps {
  data: Transaction[]
  isLoading: boolean
  onWithdraw?: (code: string) => void
  onCancel?: (code: string) => void
  onView?: (transaction: Transaction) => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  isLoading,
  onWithdraw,
  onCancel,
  onView,
}) => {
  const formatMontant = (montant: number) => {
    return montant?.toLocaleString('fr-FR') + ' GNF' || '0 GNF'
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusVariant = (statut: string) => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      EN_ATTENTE: 'warning',
      ENVOYE: 'info',
      RETIRE: 'success',
      ANNULE: 'danger',
      EXPIRE: 'default',
    }
    return map[statut] || 'info'
  }

  console.log('📊 TransactionTable data:', data)

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: Transaction) => (
        <span className="font-mono text-sm font-bold text-primary">{item.code}</span>
      ),
    },
    {
      key: 'montant',
      header: 'Montant',
      render: (item: Transaction) => (
        <span className="font-bold text-gray-900">{formatMontant(item.montant)}</span>
      ),
      align: 'right' as const,
    },
    {
      key: 'frais',
      header: 'Frais',
      render: (item: Transaction) => <span className="text-gray-700">{formatMontant(item.frais)}</span>,
      align: 'right' as const,
    },
    {
      key: 'expediteur',
      header: 'Expéditeur',
      render: (item: Transaction) => (
        <span className="text-gray-900">{item.expediteur?.nom || '-'}</span>
      ),
    },
    {
      key: 'beneficiaire',
      header: 'Bénéficiaire',
      render: (item: Transaction) => (
        <span className="text-gray-900">{item.beneficiaire?.nom || '-'}</span>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (item: Transaction) => (
        <StatusBadge status={item.statut} variant={getStatusVariant(item.statut)} />
      ),
      align: 'center' as const,
    },
    {
      key: 'date_envoi',
      header: 'Date envoi',
      render: (item: Transaction) => <span className="text-gray-700">{formatDate(item.date_envoi)}</span>,
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Transaction) => (
        <div className="flex gap-2 justify-center flex-wrap">
          {item.statut === 'ENVOYE' && (
            <>
              <Button variant="success" size="sm" onClick={() => onWithdraw?.(item.code)}>
                Retirer
              </Button>
              <Button variant="danger" size="sm" onClick={() => onCancel?.(item.code)}>
                Annuler
              </Button>
            </>
          )}
          {onView && (
            <Button variant="info" size="sm" onClick={() => onView(item)}>
              Détails
            </Button>
          )}
        </div>
      ),
      align: 'center' as const,
    },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Aucune transaction trouvée"
    />
  )
}

export default TransactionTable
