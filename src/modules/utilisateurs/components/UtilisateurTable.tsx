import React from 'react'
import { Table } from '../../../components/ui/Table'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { Button } from '../../../components/ui/Button'
import type { Utilisateur } from '../types'

interface UtilisateurTableProps {
  data: Utilisateur[]
  isLoading: boolean
  onEdit: (utilisateur: Utilisateur) => void
  onDelete: (id: number) => void
}

export const UtilisateurTable: React.FC<UtilisateurTableProps> = ({ data, isLoading, onEdit, onDelete }) => {
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      SUPERADMIN: 'Super Admin',
      ADMIN: 'Admin',
      RESPONSABLE: 'Responsable',
      AGENT: 'Agent',
    }
    return roles[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPERADMIN: 'bg-purple-100 text-purple-700',
      ADMIN: 'bg-blue-100 text-blue-700',
      RESPONSABLE: 'bg-orange-100 text-orange-700',
      AGENT: 'bg-green-100 text-green-700',
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  const columns = [
    {
      key: 'nom',
      header: 'Nom',
      render: (item: Utilisateur) => <span className="font-medium text-gray-900">{item.nom}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: Utilisateur) => <span className="text-gray-700">{item.email}</span>,
    },
    {
      key: 'telephone',
      header: 'Téléphone',
      render: (item: Utilisateur) => <span className="text-gray-700">{item.telephone || '-'}</span>,
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (item: Utilisateur) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(item.role)}`}>
          {getRoleLabel(item.role)}
        </span>
      ),
      align: 'center' as const,
    },
    {
      key: 'agence',
      header: 'Agence',
      render: (item: Utilisateur) => <span className="text-gray-700">{item.agence?.nom || '-'}</span>,
    },
    {
      key: 'actif',
      header: 'Statut',
      render: (item: Utilisateur) => (
        <StatusBadge status={item.actif ? 'Actif' : 'Inactif'} variant={item.actif ? 'success' : 'danger'} />
      ),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Utilisateur) => (
        <div className="flex gap-2 justify-center">
          <Button variant="primary" size="sm" onClick={() => onEdit(item)}>
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(item.id)}
            disabled={item.role === 'SUPERADMIN'}
          >
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
      emptyMessage="Aucun utilisateur trouvé"
    />
  )
}

export default UtilisateurTable
