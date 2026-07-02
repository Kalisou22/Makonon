import React from 'react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import type { AuditLog } from '../../../types';

interface AuditTableProps {
  data: AuditLog[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onRowClick?: (log: AuditLog) => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({ data, isLoading, onDelete, onRowClick }) => {
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'text-green-700 bg-green-100',
      LOGOUT: 'text-gray-700 bg-gray-100',
      CREATE: 'text-blue-700 bg-blue-100',
      UPDATE: 'text-orange-700 bg-orange-100',
      DELETE: 'text-red-700 bg-red-100',
      TRANSFERT: 'text-purple-700 bg-purple-100',
      RETRAIT: 'text-teal-700 bg-teal-100',
      ANNULATION: 'text-red-700 bg-red-100',
    };
    return colors[action] || 'text-gray-700 bg-gray-100';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      LOGIN: 'Connexion',
      LOGOUT: 'Déconnexion',
      CREATE: 'Création',
      UPDATE: 'Modification',
      DELETE: 'Suppression',
      TRANSFERT: 'Transfert',
      RETRAIT: 'Retrait',
      ANNULATION: 'Annulation',
    };
    return labels[action] || action;
  };

  const formatDate = (date: string) => new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const columns = [
    { key: 'id', header: '#', render: (item: AuditLog) => <span className="text-xs text-gray-400">#{item.id}</span> },
    { key: 'utilisateurNom', header: 'Utilisateur', render: (item: AuditLog) => <span className="font-medium">{item.utilisateurNom || 'Système'}</span> },
    { key: 'action', header: 'Action', render: (item: AuditLog) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(item.action)}`}>{getActionLabel(item.action)}</span>, align: 'center' as const },
    { key: 'entite', header: 'Entité', render: (item: AuditLog) => <span className="text-sm">{item.entite} {item.entiteId && `#${item.entiteId}`}</span> },
    { key: 'description', header: 'Description', render: (item: AuditLog) => <span className="text-sm text-gray-600 max-w-xs truncate block">{item.description || '-'}</span> },
    { key: 'created_at', header: 'Date', render: (item: AuditLog) => <span className="text-sm">{formatDate(item.created_at)}</span>, align: 'center' as const },
    { key: 'actions', header: '', render: (item: AuditLog) => <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>Supprimer</Button>, align: 'center' as const },
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} emptyMessage="Aucun journal d'audit trouvé" onRowClick={onRowClick} />;
};
