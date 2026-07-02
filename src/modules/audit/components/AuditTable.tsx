import React from 'react';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import type { AuditLog } from '../services/auditService';

interface AuditTableProps {
  data: AuditLog[];
  isLoading: boolean;
  onView?: (log: AuditLog) => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({ data, isLoading, onView }) => {
  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionVariant = (action: string) => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      login: 'success',
      logout: 'info',
      transfert_creation: 'warning',
      transfert_retrait: 'success',
      transfert_annulation: 'danger',
      client_creation: 'info',
      client_modification: 'warning',
      user_creation: 'info',
      user_modification: 'warning',
      user_deletion: 'danger',
    };
    return map[action] || 'info';
  };

  const getActionLabel = (action: string) => {
    const map: Record<string, string> = {
      login: 'Connexion',
      logout: 'Déconnexion',
      transfert_creation: 'Création transfert',
      transfert_retrait: 'Retrait transfert',
      transfert_annulation: 'Annulation transfert',
      client_creation: 'Création client',
      client_modification: 'Modification client',
      client_deletion: 'Suppression client',
      user_creation: 'Création utilisateur',
      user_modification: 'Modification utilisateur',
      user_deletion: 'Suppression utilisateur',
    };
    return map[action] || action;
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: AuditLog) => <span className="text-sm">{item.id}</span>,
      align: 'center' as const,
    },
    {
      key: 'user_name',
      header: 'Utilisateur',
      render: (item: AuditLog) => <span className="font-medium">{item.user_name}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (item: AuditLog) => (
        <StatusBadge status={getActionLabel(item.action)} variant={getActionVariant(item.action)} />
      ),
      align: 'center' as const,
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: AuditLog) => <span className="text-sm">{item.description}</span>,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (item: AuditLog) => formatDate(item.created_at),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: AuditLog) => (
        <div className="flex gap-2 justify-center">
          <Button variant="info" size="sm" onClick={() => onView?.(item)}>
            Détails
          </Button>
        </div>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <Table columns={columns} data={data} isLoading={isLoading} emptyMessage="Aucun log d'audit trouvé" />
  );
};
