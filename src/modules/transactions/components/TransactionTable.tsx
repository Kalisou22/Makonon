import React from 'react';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import type { Transaction } from '../types';

interface TransactionTableProps {
  data: Transaction[];
  isLoading: boolean;
  onWithdraw?: (code: string) => void;
  onCancel?: (code: string) => void;
  onView?: (transaction: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  isLoading,
  onWithdraw,
  onCancel,
  onView,
}) => {
  const formatMontant = (montant: number) => montant.toLocaleString('fr-FR') + ' GNF';
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

  const getStatusVariant = (statut: string) => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      EN_ATTENTE: 'warning',
      ENVOYE: 'info',
      RETIRE: 'success',
      ANNULE: 'danger',
      EXPIRE: 'default',
    };
    return map[statut] || 'info';
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: Transaction) => <span className="font-mono text-sm font-medium">{item.code}</span>,
    },
    {
      key: 'montant',
      header: 'Montant',
      render: (item: Transaction) => formatMontant(item.montant),
      align: 'right' as const,
    },
    {
      key: 'frais',
      header: 'Frais',
      render: (item: Transaction) => formatMontant(item.frais),
      align: 'right' as const,
    },
    {
      key: 'expediteur',
      header: 'Expéditeur',
      render: (item: Transaction) => item.expediteur?.nom || '-',
    },
    {
      key: 'beneficiaire',
      header: 'Bénéficiaire',
      render: (item: Transaction) => item.beneficiaire?.nom || '-',
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
      render: (item: Transaction) => formatDate(item.date_envoi),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Transaction) => (
        <div className="flex gap-2 justify-center">
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
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} emptyMessage="Aucune transaction trouvée" />;
};
