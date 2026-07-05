import React from 'react'
import { Table } from '../../../components/ui/Table'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { Button } from '../../../components/ui/Button'
import type { Agence } from '../types'

interface AgenceTableProps {
  data: Agence[]
  isLoading: boolean
  onEdit: (agence: Agence) => void
  onDelete: (id: number) => void
}

export const AgenceTable: React.FC<AgenceTableProps> = ({ data, isLoading, onEdit, onDelete }) => {
  console.log('📊 AgenceTable data:', data)

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: Agence) => (
        <span className="font-mono text-sm font-bold text-primary">{item.code}</span>
      ),
    },
    {
      key: 'nom',
      header: 'Nom',
      render: (item: Agence) => <span className="font-medium text-gray-900">{item.nom}</span>,
    },
    {
      key: 'responsable',
      header: 'Responsable',
      render: (item: Agence) => <span className="text-gray-700">{item.responsable || '-'}</span>,
    },
    {
      key: 'telephone',
      header: 'Téléphone',
      render: (item: Agence) => <span className="text-gray-700">{item.telephone || '-'}</span>,
    },
    {
      key: 'solde_cache',
      header: 'Solde',
      render: (item: Agence) => (
        <span className="font-bold text-success">
          {item.solde_cache?.toLocaleString('fr-FR') || 0} GNF
        </span>
      ),
      align: 'right' as const,
    },
    {
      key: 'actif',
      header: 'Statut',
      render: (item: Agence) => (
        <StatusBadge status={item.actif ? 'Actif' : 'Inactif'} variant={item.actif ? 'success' : 'danger'} />
      ),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Agence) => (
        <div className="flex gap-2 justify-center">
          <Button variant="primary" size="sm" onClick={() => onEdit(item)}>
            Modifier
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>
            Supprimer
          </Button>
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
      emptyMessage="Aucune agence trouvée"
    />
  )
}

export default AgenceTable
