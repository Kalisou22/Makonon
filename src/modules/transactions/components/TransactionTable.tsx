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
  userAgenceId?: number | null
  userRole?: string
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  isLoading,
  onWithdraw,
  onCancel,
  onView,
  userAgenceId,
  userRole,
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

  // ✅ Vérifier si l'utilisateur peut retirer ce transfert
  const canWithdraw = (item: Transaction) => {
    // ✅ SUPERADMIN peut tout retirer
    if (userRole === 'SUPERADMIN') return true
    
    // ✅ L'utilisateur doit appartenir à l'agence de retrait
    // ✅ Le statut doit être ENVOYE (disponible pour retrait)
    // ✅ Le transfert ne doit pas déjà être retiré ou annulé
    return userAgenceId === item.agence_retrait_id && 
           item.statut === 'ENVOYE'
  }

  // ✅ Vérifier si l'utilisateur peut annuler ce transfert
  const canCancel = (item: Transaction) => {
    // ✅ SUPERADMIN peut tout annuler
    if (userRole === 'SUPERADMIN') return true
    
    // ✅ L'utilisateur doit appartenir à l'agence d'envoi
    // ✅ Le statut doit être ENVOYE (pas encore retiré)
    // ✅ Le transfert ne doit pas déjà être retiré ou annulé
    return userAgenceId === item.agence_envoi_id && 
           item.statut === 'ENVOYE'
  }

  // ✅ Déterminer le statut affiché en fonction de l'agence
  const getDisplayStatus = (item: Transaction) => {
    // ✅ Pour l'agence de destination, ENVOYE s'affiche comme EN ATTENTE
    if (userAgenceId === item.agence_retrait_id && item.statut === 'ENVOYE') {
      return { label: 'En attente', variant: 'warning' as const }
    }
    // ✅ Pour l'agence d'envoi, ENVOYE s'affiche comme ENVOYÉ
    if (userAgenceId === item.agence_envoi_id && item.statut === 'ENVOYE') {
      return { label: 'Envoyé', variant: 'info' as const }
    }
    // ✅ Pour les autres statuts
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
      EN_ATTENTE: { label: 'En attente', variant: 'warning' },
      ENVOYE: { label: 'Envoyé', variant: 'info' },
      RETIRE: { label: 'Retiré', variant: 'success' },
      ANNULE: { label: 'Annulé', variant: 'danger' },
      EXPIRE: { label: 'Expiré', variant: 'default' },
    }
    return statusMap[item.statut] || { label: item.statut, variant: 'default' }
  }

  console.log('📊 TransactionTable data:', data)
  console.log('📊 userAgenceId:', userAgenceId)
  console.log('📊 userRole:', userRole)

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
      render: (item: Transaction) => {
        const display = getDisplayStatus(item)
        return <StatusBadge status={display.label} variant={display.variant} />
      },
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
      render: (item: Transaction) => {
        const showWithdraw = canWithdraw(item)
        const showCancel = canCancel(item)

        console.log('Actions pour transfert:', {
          code: item.code,
          statut: item.statut,
          userAgenceId,
          agence_retrait_id: item.agence_retrait_id,
          agence_envoi_id: item.agence_envoi_id,
          showWithdraw,
          showCancel
        })

        return (
          <div className="flex gap-2 justify-center flex-wrap">
            {showWithdraw && (
              <Button variant="success" size="sm" onClick={() => onWithdraw?.(item.code)}>
                Retirer
              </Button>
            )}
            {showCancel && (
              <Button variant="danger" size="sm" onClick={() => onCancel?.(item.code)}>
                Annuler
              </Button>
            )}
            {onView && (
              <Button variant="info" size="sm" onClick={() => onView(item)}>
                Détails
              </Button>
            )}
          </div>
        )
      },
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
