import React from 'react'
import { Table } from '../../../components/ui/Table'
import { Button } from '../../../components/ui/Button'
import type { FraisConfiguration } from '../types'

interface FraisTableProps {
  data: FraisConfiguration[]
  isLoading: boolean
  onEdit: (item: FraisConfiguration) => void
  onDelete: (id: number) => void
  onDesactiver: (id: number) => void
}

export const FraisTable: React.FC<FraisTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onDesactiver,
}) => {
  const columns = [
    { key: 'id', header: 'ID', render: (item: FraisConfiguration) => <span className="font-mono text-sm">{item.id}</span>, align: 'center' as const },
    { key: 'nom', header: 'Nom', render: (item: FraisConfiguration) => <span className="font-medium">{item.nom}</span> },
    { key: 'type', header: 'Type', render: (item: FraisConfiguration) => <span>{item.type}</span>, align: 'center' as const },
    { key: 'valeur', header: 'Valeur', render: (item: FraisConfiguration) => <span className="font-bold">{item.type === 'POURCENTAGE' ? `${item.valeur}%` : `${item.valeur.toLocaleString()} GNF`}</span>, align: 'right' as const },
    { key: 'actif', header: 'Statut', render: (item: FraisConfiguration) => <span className={item.actif ? 'text-green-600' : 'text-red-600'}>{item.actif ? 'Actif' : 'Inactif'}</span>, align: 'center' as const },
    { key: 'actions', header: 'Actions', render: (item: FraisConfiguration) => (
      <div className="flex gap-2 justify-center flex-wrap">
        <Button variant="primary" size="sm" onClick={() => onEdit(item)}>Modifier</Button>
        {item.actif && <Button variant="warning" size="sm" onClick={() => onDesactiver(item.id)}>Désactiver</Button>}
        <Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>Supprimer</Button>
      </div>
    ), align: 'center' as const },
  ]

  return <Table columns={columns} data={data} isLoading={isLoading} emptyMessage="Aucune configuration de frais" />
}

export default FraisTable
