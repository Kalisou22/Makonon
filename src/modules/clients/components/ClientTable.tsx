import React from 'react'
import { Table } from '../../../components/ui/Table'
import { Button } from '../../../components/ui/Button'
import type { Client } from '../types'

interface ClientTableProps {
  data: Client[]
  isLoading: boolean
  onEdit: (client: Client) => void
  onDelete: (id: number) => void
}

export const ClientTable: React.FC<ClientTableProps> = ({ data, isLoading, onEdit, onDelete }) => {
  console.log('📊 ClientTable data:', data)

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const columns = [
    {
      key: 'nom',
      header: 'Nom',
      render: (item: Client) => <span className="font-medium text-gray-900">{item.nom}</span>,
    },
    {
      key: 'telephone',
      header: 'Téléphone',
      render: (item: Client) => <span className="font-mono text-sm text-gray-700">{item.telephone}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: Client) => <span className="text-gray-700">{item.email || '-'}</span>,
    },
    {
      key: 'piece_identite',
      header: 'Pièce',
      render: (item: Client) => <span className="text-gray-700">{item.piece_identite || '-'}</span>,
    },
    {
      key: 'numero_piece',
      header: 'N° Pièce',
      render: (item: Client) => <span className="text-gray-700">{item.numero_piece || '-'}</span>,
    },
    {
      key: 'created_at',
      header: 'Création',
      render: (item: Client) => <span className="text-gray-700">{formatDate(item.created_at)}</span>,
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Client) => (
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
      emptyMessage="Aucun client trouvé"
    />
  )
}

export default ClientTable
