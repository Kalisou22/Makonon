import React from 'react';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import type { Utilisateur } from '../../../types';

interface UtilisateurTableProps {
  data: Utilisateur[];
  isLoading: boolean;
  onEdit: (utilisateur: Utilisateur) => void;
  onDelete: (id: number) => void;
}

export const UtilisateurTable: React.FC<UtilisateurTableProps> = ({ data, isLoading, onEdit, onDelete }) => {
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      SUPERADMIN: 'Super Admin',
      ADMIN: 'Admin',
      RESPONSABLE: 'Responsable',
      AGENT: 'Agent',
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPERADMIN: 'text-purple-700 bg-purple-100',
      ADMIN: 'text-blue-700 bg-blue-100',
      RESPONSABLE: 'text-orange-700 bg-orange-100',
      AGENT: 'text-green-700 bg-green-100',
    };
    return colors[role] || 'text-gray-700 bg-gray-100';
  };

  const columns = [
    { key: 'nom', header: 'Nom', render: (item: Utilisateur) => <span className="font-medium">{item.nom}</span> },
    { key: 'email', header: 'Email', render: (item: Utilisateur) => item.email },
    { key: 'telephone', header: 'Téléphone', render: (item: Utilisateur) => item.telephone || '-' },
    { key: 'role', header: 'Rôle', render: (item: Utilisateur) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(item.role)}`}>{getRoleLabel(item.role)}</span>, align: 'center' as const },
    { key: 'agence', header: 'Agence', render: (item: Utilisateur) => item.agence?.nom || '-' },
    { key: 'actif', header: 'Statut', render: (item: Utilisateur) => <StatusBadge status={item.actif ? 'SUCCES' : 'ECHEC'} />, align: 'center' as const },
    { key: 'actions', header: 'Actions', render: (item: Utilisateur) => <div className="flex gap-2"><Button variant="primary" size="sm" onClick={() => onEdit(item)}>Modifier</Button><Button variant="danger" size="sm" onClick={() => onDelete(item.id)} disabled={item.role === 'SUPERADMIN'}>Supprimer</Button></div>, align: 'center' as const },
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} emptyMessage="Aucun utilisateur trouvé" />;
};
